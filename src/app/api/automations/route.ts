import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

const VALID_TRIGGER_TYPES = ['tag_added', 'form_submitted', 'subscriber_created', 'lead_score_threshold'];
const VALID_ACTION_TYPES = ['add_tag', 'remove_tag', 'enroll_sequence', 'send_email', 'update_score'];

export async function GET() {
  try {
    const user = await requireAuth();
    const automations = await db.getAutomations(user.id);
    return NextResponse.json({ data: automations || [] });
  } catch (error: any) {
    // If the automations table doesn't exist yet, return a friendly response
    if (error?.code === '42P01' || (typeof error?.message === 'string' && error.message.includes('does not exist'))) {
      return NextResponse.json({ data: [], migrationRequired: true });
    }
    console.error('Failed to list automations:', error);
    const message = error instanceof Error ? error.message : 'Failed to list automations';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
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

    const automation = await db.createAutomation(user.id, {
      name,
      trigger_type,
      trigger_config,
      action_type,
      action_config,
      status,
    });

    return NextResponse.json({ data: automation }, { status: 201 });
  } catch (error: any) {
    if (error?.code === '42P01' || (typeof error?.message === 'string' && error.message.includes('does not exist'))) {
      return NextResponse.json({ error: 'Automations table not set up yet', migrationRequired: true }, { status: 503 });
    }
    console.error('Failed to create automation:', error);
    const message = error instanceof Error ? error.message : 'Failed to create automation';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
