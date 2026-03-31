import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const body = await request.json();
    const { webhook_id } = body;

    if (!webhook_id) {
      return NextResponse.json({ error: 'webhook_id is required' }, { status: 400 });
    }

    const { data: webhook, error } = await supabaseAdmin
      .from('webhooks')
      .select('*')
      .eq('id', webhook_id)
      .eq('user_id', user.id)
      .single();

    if (error || !webhook) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    const testPayload = JSON.stringify({
      event: 'email.delivered',
      timestamp: new Date().toISOString(),
      data: {
        email: 'test@example.com',
        campaign_id: 'test-123',
        subject: 'Test Email',
      },
    });

    const signature = crypto
      .createHmac('sha256', webhook.secret_key)
      .update(testPayload)
      .digest('hex');

    let success = false;
    let statusCode = 0;

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
        },
        body: testPayload,
        signal: AbortSignal.timeout(10000),
      });

      statusCode = response.status;
      success = response.ok;
    } catch (fetchError) {
      console.error('Webhook test delivery failed:', fetchError);
      success = false;
    }

    // Update last_triggered_at regardless of success
    await supabaseAdmin
      .from('webhooks')
      .update({ last_triggered_at: new Date().toISOString() })
      .eq('id', webhook_id)
      .eq('user_id', user.id);

    if (success) {
      return NextResponse.json({ success: true, status: statusCode }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, status: statusCode, error: statusCode ? `Endpoint returned ${statusCode}` : 'Failed to reach endpoint' },
        { status: 200 }
      );
    }
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to test webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to test webhook';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
