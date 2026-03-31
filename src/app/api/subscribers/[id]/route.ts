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

    // Fetch subscriber with tags
    const { data: subscriber, error } = await supabaseAdmin
      .from('subscribers')
      .select('*, subscriber_tags(tag_id, tags(id, name, color, description))')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    // Fetch recent events
    const { data: events } = await supabaseAdmin
      .from('subscriber_events')
      .select('*')
      .eq('subscriber_id', id)
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch active sequence enrollments
    const { data: enrollments } = await supabaseAdmin
      .from('sequence_enrollments')
      .select('*, sequences(id, name, status)')
      .eq('subscriber_id', id)
      .eq('status', 'active');

    return NextResponse.json({
      data: {
        ...subscriber,
        events: events || [],
        sequence_enrollments: enrollments || [],
      },
    }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to get subscriber:', error);
    const message = error instanceof Error ? error.message : 'Failed to get subscriber';
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
      .from('subscribers')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.first_name !== undefined) updateData.first_name = trimString(body.first_name, 120);
    if (body.last_name !== undefined) updateData.last_name = trimString(body.last_name, 120);
    if (body.company !== undefined) updateData.company = trimString(body.company, 200);
    if (body.phone !== undefined) updateData.phone = trimString(body.phone, 30);
    if (body.source !== undefined) updateData.source = trimString(body.source, 100);
    if (body.source_url !== undefined) updateData.source_url = trimString(body.source_url, 500);
    if (body.ip_address !== undefined) updateData.ip_address = trimString(body.ip_address, 45);
    if (body.custom_fields !== undefined && typeof body.custom_fields === 'object') {
      updateData.custom_fields = body.custom_fields;
    }
    if (['active', 'unsubscribed', 'bounced', 'complained'].includes(body.status)) {
      updateData.status = body.status;
    }

    const { data: subscriber, error } = await supabaseAdmin
      .from('subscribers')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to update subscriber:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle tag_ids if provided — replace all tags
    if (Array.isArray(body.tag_ids)) {
      // Remove existing tags
      await supabaseAdmin
        .from('subscriber_tags')
        .delete()
        .eq('subscriber_id', id);

      // Insert new tags
      const tagIds = body.tag_ids.filter((tid: unknown) => typeof tid === 'string' && tid.trim());
      if (tagIds.length > 0) {
        const tagRows = tagIds.map((tagId: string) => ({
          subscriber_id: id,
          tag_id: tagId.trim(),
        }));

        await supabaseAdmin
          .from('subscriber_tags')
          .insert(tagRows);
      }
    }

    // Return subscriber with tags
    const { data: fullSubscriber } = await supabaseAdmin
      .from('subscribers')
      .select('*, subscriber_tags(tag_id, tags(id, name, color))')
      .eq('id', id)
      .single();

    return NextResponse.json({ data: fullSubscriber || subscriber }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to update subscriber:', error);
    const message = error instanceof Error ? error.message : 'Failed to update subscriber';
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

    // Verify ownership and delete
    const { data: subscriber, error } = await supabaseAdmin
      .from('subscribers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error || !subscriber) {
      return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { id, deleted: true } }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to delete subscriber:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete subscriber';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
