import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';
import crypto from 'crypto';

export async function GET() {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const { data: webhooks, error } = await supabaseAdmin
      .from('webhooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to list webhooks:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: webhooks || [] }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to list webhooks:', error);
    const message = error instanceof Error ? error.message : 'Failed to list webhooks';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const body = await request.json();
    const url = typeof body.url === 'string' ? body.url.trim() : '';
    const events = Array.isArray(body.events) ? body.events : [];

    if (!url) {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (events.length === 0) {
      return NextResponse.json({ error: 'At least one event must be selected' }, { status: 400 });
    }

    const secret_key = crypto.randomBytes(32).toString('hex');

    const { data: webhook, error } = await supabaseAdmin
      .from('webhooks')
      .insert({
        user_id: user.id,
        url,
        events,
        secret_key,
        is_active: true,
        last_triggered_at: null,
      })
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to create webhook:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: webhook }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to create webhook';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const body = await request.json();
    const { id, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active must be a boolean' }, { status: 400 });
    }

    const { data: webhook, error } = await supabaseAdmin
      .from('webhooks')
      .update({ is_active })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to update webhook:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: webhook }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to update webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to update webhook';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('webhooks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to delete webhook:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to delete webhook:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete webhook';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
