import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const tagId = searchParams.get('tag_id') || '';
    const source = searchParams.get('source') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 1000);

    let query = supabaseAdmin
      .from('subscribers')
      .select('*, subscriber_tags(tag_id, tags(id, name, color))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (source) {
      query = query.eq('source', source);
    }

    if (tagId) {
      // Get subscriber IDs that have this tag
      const { data: taggedIds } = await supabaseAdmin
        .from('subscriber_tags')
        .select('subscriber_id')
        .eq('tag_id', tagId);

      if (!taggedIds || taggedIds.length === 0) {
        return NextResponse.json({ data: [] }, { status: 200 });
      }

      const ids = taggedIds.map((t) => t.subscriber_id);
      query = query.in('id', ids);
    }

    const { data, error } = await query;

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to list subscribers:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to list subscribers:', error);
    const message = error instanceof Error ? error.message : 'Failed to list subscribers';
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
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const subscriberData = {
      user_id: user.id,
      email,
      first_name: trimString(body.first_name, 120),
      last_name: trimString(body.last_name, 120),
      company: trimString(body.company, 200),
      phone: trimString(body.phone, 30),
      source: trimString(body.source, 100) || 'api',
      source_url: trimString(body.source_url, 500),
      ip_address: trimString(body.ip_address, 45),
      status: ['active', 'unsubscribed', 'bounced', 'complained'].includes(body.status)
        ? body.status
        : 'active',
      custom_fields: typeof body.custom_fields === 'object' && body.custom_fields !== null
        ? body.custom_fields
        : {},
    };

    const { data: subscriber, error } = await supabaseAdmin
      .from('subscribers')
      .upsert(subscriberData, { onConflict: 'user_id,email' })
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to create subscriber:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle tag_ids if provided
    const tagIds = Array.isArray(body.tag_ids) ? body.tag_ids.filter((id: unknown) => typeof id === 'string' && id.trim()) : [];

    if (tagIds.length > 0) {
      const tagRows = tagIds.map((tagId: string) => ({
        subscriber_id: subscriber.id,
        tag_id: tagId.trim(),
      }));

      const { error: tagError } = await supabaseAdmin
        .from('subscriber_tags')
        .upsert(tagRows, { onConflict: 'subscriber_id,tag_id' });

      if (tagError) {
        console.error('Failed to assign tags:', tagError);
      }
    }

    // Fetch subscriber with tags
    const { data: fullSubscriber } = await supabaseAdmin
      .from('subscribers')
      .select('*, subscriber_tags(tag_id, tags(id, name, color))')
      .eq('id', subscriber.id)
      .single();

    return NextResponse.json({ data: fullSubscriber || subscriber }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create subscriber:', error);
    const message = error instanceof Error ? error.message : 'Failed to create subscriber';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
