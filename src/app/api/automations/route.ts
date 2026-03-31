import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

const VALID_TRIGGER_TYPES = ['tag_added', 'form_submitted', 'subscriber_created', 'lead_score_threshold'];
const VALID_ACTION_TYPES = ['add_tag', 'remove_tag', 'enroll_sequence', 'send_email', 'update_score'];

export async function GET() {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const { data: automations, error } = await supabaseAdmin
      .from('automations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to list automations:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: automations || [] });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to list automations:', error);
    const message = error instanceof Error ? error.message : 'Failed to list automations';
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
    const name = trimString(body.name, 255);
    const trigger_type = trimString(body.trigger_type, 100);
    const action_type = trimString(body.action_type, 100);
    const status = trimString(body.status, 50) || 'active';

    if (!name) {
      return NextResponse.json({ error: 'Automation name is required' }, { status: 400 });
    }

    if (!VALID_TRIGGER_TYPES.includes(trigger_type)) {
      return NextResponse.json({ error: `Invalid trigger_type. Must be one of: ${VALID_TRIGGER_TYPES.join(', ')}` }, { status: 400 });
    }

    if (!VALID_ACTION_TYPES.includes(action_type)) {
      return NextResponse.json({ error: `Invalid action_type. Must be one of: ${VALID_ACTION_TYPES.join(', ')}` }, { status: 400 });
    }

    if (!['active', 'paused'].includes(status)) {
      return NextResponse.json({ error: 'Status must be active or paused' }, { status: 400 });
    }

    const trigger_config = body.trigger_config && typeof body.trigger_config === 'object' ? body.trigger_config : {};
    const action_config = body.action_config && typeof body.action_config === 'object' ? body.action_config : {};

    const now = new Date().toISOString();

    const { data: automation, error } = await supabaseAdmin
      .from('automations')
      .insert({
        user_id: user.id,
        name,
        trigger_type,
        trigger_config,
        action_type,
        action_config,
        status,
        run_count: 0,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to create automation:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: automation }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create automation:', error);
    const message = error instanceof Error ? error.message : 'Failed to create automation';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
