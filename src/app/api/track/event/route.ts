import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    const body = await request.json();

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const eventType = typeof body.event_type === 'string' ? body.event_type.trim().slice(0, 100) : '';
    const data = typeof body.data === 'object' && body.data !== null ? body.data : {};
    const source = typeof body.source === 'string' ? body.source.trim().slice(0, 200) : 'website';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'A valid email is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!eventType) {
      return NextResponse.json(
        { error: 'event_type is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Lookup subscriber by email (across all users)
    const { data: subscriber } = await supabaseAdmin
      .from('subscribers')
      .select('id, user_id')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const now = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Log event
    const { error: insertError } = await supabaseAdmin
      .from('subscriber_events')
      .insert({
        subscriber_id: subscriber.id,
        user_id: subscriber.user_id,
        event_type: eventType,
        data: {
          ...data,
          source,
          user_agent: userAgent,
          ip_address: ip,
        },
        created_at: now,
      });

    if (isMigrationPending(insertError)) return migrationPendingResponse(CORS_HEADERS);

    if (insertError) {
      console.error('Failed to log event:', insertError);
      return NextResponse.json(
        { error: 'Failed to log event' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Update last_activity_at
    await supabaseAdmin
      .from('subscribers')
      .update({ last_activity_at: now })
      .eq('id', subscriber.id);

    return NextResponse.json(
      { success: true, message: 'Event tracked' },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse(CORS_HEADERS);
    console.error('Track event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
