import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

function gifResponse() {
  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const page = searchParams.get('page');

    if (!uid || !supabaseAdmin) {
      return gifResponse();
    }

    // Verify subscriber exists
    const { data: subscriber } = await supabaseAdmin
      .from('subscribers')
      .select('id, user_id')
      .eq('id', uid)
      .maybeSingle();

    if (!subscriber) {
      return gifResponse();
    }

    const now = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const decodedPage = page ? decodeURIComponent(page) : '';

    // Log page_visited event
    await supabaseAdmin.from('subscriber_events').insert({
      subscriber_id: subscriber.id,
      user_id: subscriber.user_id,
      event_type: 'page_visited',
      data: {
        page: decodedPage,
        user_agent: userAgent,
        ip_address: ip,
      },
      created_at: now,
    });

    // Update last_activity_at
    await supabaseAdmin
      .from('subscribers')
      .update({ last_activity_at: now })
      .eq('id', subscriber.id);
  } catch (error) {
    console.error('Tracking pixel error:', error);
  }

  return gifResponse();
}
