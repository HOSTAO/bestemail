import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

type RouteContext = { params: Promise<{ id: string; stepId: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id, stepId } = await context.params;

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
    const updates: Record<string, unknown> = {};

    if (typeof body.subject === 'string') updates.subject = body.subject.trim().slice(0, 200);
    if (typeof body.body_html === 'string') updates.body_html = body.body_html.trim().slice(0, 100000);
    if (typeof body.delay_days === 'number') updates.delay_days = Math.max(body.delay_days, 0);
    if (typeof body.stop_on_reply === 'boolean') updates.stop_on_reply = body.stop_on_reply;

    const { data, error } = await supabaseAdmin
      .from('cold_email_steps')
      .update(updates)
      .eq('id', stepId)
      .eq('campaign_id', id)
      .select()
      .single();

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json(data);
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id, stepId } = await context.params;

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

    // Get the step being deleted to know its step_number
    const { data: deletedStep } = await supabaseAdmin
      .from('cold_email_steps')
      .select('step_number')
      .eq('id', stepId)
      .eq('campaign_id', id)
      .single();

    if (!deletedStep) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    // Delete the step
    const { error } = await supabaseAdmin
      .from('cold_email_steps')
      .delete()
      .eq('id', stepId)
      .eq('campaign_id', id);

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    // Renumber remaining steps that were after the deleted one
    const { data: remainingSteps } = await supabaseAdmin
      .from('cold_email_steps')
      .select('id, step_number')
      .eq('campaign_id', id)
      .gt('step_number', deletedStep.step_number)
      .order('step_number', { ascending: true });

    if (remainingSteps && remainingSteps.length > 0) {
      for (const step of remainingSteps) {
        await supabaseAdmin
          .from('cold_email_steps')
          .update({ step_number: step.step_number - 1 })
          .eq('id', step.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
