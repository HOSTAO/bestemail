import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Get the sequence
    const { data: sequence, error } = await supabaseAdmin
      .from('sequences')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Get email steps
    const { data: emails } = await supabaseAdmin
      .from('sequence_emails')
      .select('*')
      .eq('sequence_id', id)
      .order('step_number', { ascending: true });

    // Get enrollment stats
    const { data: enrollments } = await supabaseAdmin
      .from('sequence_enrollments')
      .select('status')
      .eq('sequence_id', id);

    const stats = {
      total: enrollments?.length || 0,
      active: enrollments?.filter(e => e.status === 'active').length || 0,
      completed: enrollments?.filter(e => e.status === 'completed').length || 0,
      cancelled: enrollments?.filter(e => e.status === 'cancelled').length || 0,
      unsubscribed: enrollments?.filter(e => e.status === 'unsubscribed').length || 0,
    };

    return NextResponse.json({
      data: {
        ...sequence,
        emails: emails || [],
        enrollment_stats: stats,
      },
    });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to get sequence:', error);
    const message = error instanceof Error ? error.message : 'Failed to get sequence';
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

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('sequences')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.name !== undefined) {
      const name = trimString(body.name, 120);
      if (!name) return NextResponse.json({ error: 'Sequence name is required' }, { status: 400 });
      updates.name = name;
    }
    if (body.description !== undefined) updates.description = trimString(body.description, 500);
    if (body.trigger_type !== undefined) {
      if (['tag_added', 'form_submitted', 'manual', 'date_based'].includes(body.trigger_type)) {
        updates.trigger_type = body.trigger_type;
      }
    }
    if (body.trigger_config !== undefined && typeof body.trigger_config === 'object') {
      updates.trigger_config = body.trigger_config;
    }
    if (body.status !== undefined) {
      if (['draft', 'active', 'paused'].includes(body.status)) {
        updates.status = body.status;
      }
    }

    const { data: sequence, error } = await supabaseAdmin
      .from('sequences')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to update sequence:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: sequence });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to update sequence:', error);
    const message = error instanceof Error ? error.message : 'Failed to update sequence';
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

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('sequences')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Delete enrollments first
    await supabaseAdmin
      .from('sequence_enrollments')
      .delete()
      .eq('sequence_id', id);

    // Delete email steps
    await supabaseAdmin
      .from('sequence_emails')
      .delete()
      .eq('sequence_id', id);

    // Delete sequence
    const { error } = await supabaseAdmin
      .from('sequences')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to delete sequence:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to delete sequence:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete sequence';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
