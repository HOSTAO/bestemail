import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await context.params;

    // Verify campaign ownership
    const { data: campaign } = await supabaseAdmin
      .from('cold_campaigns')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from('cold_email_steps')
      .select('*')
      .eq('campaign_id', id)
      .order('step_number', { ascending: true });

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json(data || []);
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await context.params;

    // Verify campaign ownership
    const { data: campaign } = await supabaseAdmin
      .from('cold_campaigns')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const body = await request.json();

    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 200) : '';
    const bodyHtml = typeof body.body_html === 'string' ? body.body_html.trim().slice(0, 100000) : '';
    const delayDays = typeof body.delay_days === 'number' ? Math.max(body.delay_days, 0) : 1;
    const stopOnReply = body.stop_on_reply !== false;

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    // Get max step_number
    const { data: existingSteps } = await supabaseAdmin
      .from('cold_email_steps')
      .select('step_number')
      .eq('campaign_id', id)
      .order('step_number', { ascending: false })
      .limit(1);

    const nextStepNumber = existingSteps && existingSteps.length > 0 ? existingSteps[0].step_number + 1 : 1;

    const { data, error } = await supabaseAdmin
      .from('cold_email_steps')
      .insert({
        campaign_id: id,
        step_number: nextStepNumber,
        subject,
        body_html: bodyHtml,
        delay_days: delayDays,
        stop_on_reply: stopOnReply,
      })
      .select()
      .single();

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create step:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
