import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify subscriber ownership
    const { data: subscriber } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 500);

    const { data: events, error } = await supabaseAdmin
      .from('subscriber_events')
      .select('*')
      .eq('subscriber_id', id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to list events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: events || [] }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to list subscriber events:', error);
    const message = error instanceof Error ? error.message : 'Failed to list events';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify subscriber ownership
    const { data: subscriber } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    const body = await request.json();
    const eventType = trimString(body.event_type, 100);

    if (!eventType) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 });
    }

    const eventData = typeof body.event_data === 'object' && body.event_data !== null
      ? body.event_data
      : {};
    const source = trimString(body.source, 100) || 'api';

    // Create event
    const { data: event, error } = await supabaseAdmin
      .from('subscriber_events')
      .insert({
        subscriber_id: id,
        event_type: eventType,
        event_data: eventData,
        source,
      })
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to create event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update subscriber last_activity_at
    await supabaseAdmin
      .from('subscribers')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', id);

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create subscriber event:', error);
    const message = error instanceof Error ? error.message : 'Failed to create event';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
