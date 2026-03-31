// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Get tag
    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Get subscribers with this tag
    const { data: subscriberTags } = await supabaseAdmin
      .from('subscriber_tags')
      .select('subscriber_id, subscribers(id, email, first_name, last_name, status, created_at)')
      .eq('tag_id', id);

    const subscribers = (subscriberTags || [])
      .map((st) => st.subscribers)
      .filter(Boolean);

    return NextResponse.json({
      data: {
        ...tag,
        subscribers,
      },
    }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to get tag:', error);
    const message = error instanceof Error ? error.message : 'Failed to get tag';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PUT(
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

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('tags')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.name !== undefined) {
      const name = trimString(body.name, 100);
      if (!name) {
        return NextResponse.json({ error: 'Tag name cannot be empty' }, { status: 400 });
      }

      // Check uniqueness (exclude current tag)
      const { data: duplicate } = await supabaseAdmin
        .from('tags')
        .select('id')
        .eq('user_id', user.id)
        .ilike('name', name)
        .neq('id', id)
        .single();

      if (duplicate) {
        return NextResponse.json({ error: 'A tag with this name already exists' }, { status: 409 });
      }

      updateData.name = name;
    }

    if (body.color !== undefined) updateData.color = trimString(body.color, 20);
    if (body.description !== undefined) updateData.description = trimString(body.description, 500);

    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to update tag:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: tag }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to update tag:', error);
    const message = error instanceof Error ? error.message : 'Failed to update tag';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify ownership
    const { data: tag } = await supabaseAdmin
      .from('tags')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    // Delete subscriber_tags entries first (cascade)
    await supabaseAdmin
      .from('subscriber_tags')
      .delete()
      .eq('tag_id', id);

    // Delete the tag
    const { error } = await supabaseAdmin
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to delete tag:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: { id, deleted: true } }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to delete tag:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete tag';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
