import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

const VALID_TRIGGER_TYPES = ['tag_added', 'form_submitted', 'subscriber_created', 'lead_score_threshold'];
const VALID_ACTION_TYPES = ['add_tag', 'remove_tag', 'enroll_sequence', 'send_email', 'update_score'];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const automation = await db.getAutomation(user.id, id);
    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    return NextResponse.json({ data: automation });
  } catch (error) {
    console.error('Failed to get automation:', error);
    const message = error instanceof Error ? error.message : 'Failed to get automation';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existing = await db.getAutomation(user.id, id);
    if (!existing) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = trimString(body.name, 255);
      if (!name) return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 });
      updates.name = name;
    }

    if (body.trigger_type !== undefined) {
      const trigger_type = trimString(body.trigger_type, 100);
      if (!VALID_TRIGGER_TYPES.includes(trigger_type)) {
        return NextResponse.json({ error: `Invalid trigger_type. Must be one of: ${VALID_TRIGGER_TYPES.join(', ')}` }, { status: 400 });
      }
      updates.trigger_type = trigger_type;
    }

    if (body.action_type !== undefined) {
      const action_type = trimString(body.action_type, 100);
      if (!VALID_ACTION_TYPES.includes(action_type)) {
        return NextResponse.json({ error: `Invalid action_type. Must be one of: ${VALID_ACTION_TYPES.join(', ')}` }, { status: 400 });
      }
      updates.action_type = action_type;
    }

    if (body.status !== undefined) {
      const status = trimString(body.status, 50);
      if (!['active', 'paused'].includes(status)) {
        return NextResponse.json({ error: 'Status must be active or paused' }, { status: 400 });
      }
      updates.status = status;
    }

    if (body.trigger_config !== undefined) {
      updates.trigger_config = typeof body.trigger_config === 'object' ? body.trigger_config : {};
    }

    if (body.action_config !== undefined) {
      updates.action_config = typeof body.action_config === 'object' ? body.action_config : {};
    }

    const automation = await db.updateAutomation(user.id, id, updates);
    return NextResponse.json({ data: automation });
  } catch (error) {
    console.error('Failed to update automation:', error);
    const message = error instanceof Error ? error.message : 'Failed to update automation';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const existing = await db.getAutomation(user.id, id);
    if (!existing) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
    }

    await db.deleteAutomation(user.id, id);
    return NextResponse.json({ message: 'Automation deleted' });
  } catch (error) {
    console.error('Failed to delete automation:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete automation';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
