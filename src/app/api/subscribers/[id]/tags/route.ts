import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

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

    const body = await request.json();
    const tagId = typeof body.tag_id === 'string' ? body.tag_id.trim() : '';

    if (!tagId) {
      return NextResponse.json({ error: 'tag_id is required' }, { status: 400 });
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

    // Add tag to subscriber
    const { error } = await supabaseAdmin
      .from('subscriber_tags')
      .upsert({ subscriber_id: id, tag_id: tagId }, { onConflict: 'subscriber_id,tag_id' });

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to add tag:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update tag subscriber_count
    const { count } = await supabaseAdmin
      .from('subscriber_tags')
      .select('*', { count: 'exact', head: true })
      .eq('tag_id', tagId);

    await supabaseAdmin
      .from('tags')
      .update({ subscriber_count: count || 0 })
      .eq('id', tagId);

    // Log subscriber event
    await supabaseAdmin
      .from('subscriber_events')
      .insert({
        subscriber_id: id,
        event_type: 'tag_added',
        event_data: { tag_id: tagId },
        source: 'api',
      });

    return NextResponse.json({ data: { subscriber_id: id, tag_id: tagId, added: true } }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to add tag to subscriber:', error);
    const message = error instanceof Error ? error.message : 'Failed to add tag';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const body = await request.json();
    const tagId = typeof body.tag_id === 'string' ? body.tag_id.trim() : '';

    if (!tagId) {
      return NextResponse.json({ error: 'tag_id is required' }, { status: 400 });
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

    // Remove tag from subscriber
    const { error } = await supabaseAdmin
      .from('subscriber_tags')
      .delete()
      .eq('subscriber_id', id)
      .eq('tag_id', tagId);

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to remove tag:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update tag subscriber_count
    const { count } = await supabaseAdmin
      .from('subscriber_tags')
      .select('*', { count: 'exact', head: true })
      .eq('tag_id', tagId);

    await supabaseAdmin
      .from('tags')
      .update({ subscriber_count: count || 0 })
      .eq('id', tagId);

    return NextResponse.json({ data: { subscriber_id: id, tag_id: tagId, removed: true } }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to remove tag from subscriber:', error);
    const message = error instanceof Error ? error.message : 'Failed to remove tag';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
