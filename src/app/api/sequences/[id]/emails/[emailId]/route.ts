import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; emailId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, emailId } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify sequence ownership
    const { data: sequence } = await supabaseAdmin
      .from('sequences')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Verify email belongs to sequence
    const { data: existing } = await supabaseAdmin
      .from('sequence_emails')
      .select('id')
      .eq('id', emailId)
      .eq('sequence_id', id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Email step not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.subject !== undefined) {
      const subject = trimString(body.subject, 200);
      if (!subject) return NextResponse.json({ error: 'Email subject is required' }, { status: 400 });
      updates.subject = subject;
    }
    if (body.body_html !== undefined) {
      updates.body_html = trimString(body.body_html, 100_000);
    }
    if (body.delay_days !== undefined && typeof body.delay_days === 'number' && body.delay_days >= 0) {
      updates.delay_days = Math.floor(body.delay_days);
    }
    if (body.delay_hours !== undefined && typeof body.delay_hours === 'number' && body.delay_hours >= 0) {
      updates.delay_hours = Math.floor(body.delay_hours);
    }
    if (body.send_time !== undefined) {
      updates.send_time = typeof body.send_time === 'string' && /^\d{2}:\d{2}$/.test(body.send_time)
        ? body.send_time
        : null;
    }

    const { data: email, error } = await supabaseAdmin
      .from('sequence_emails')
      .update(updates)
      .eq('id', emailId)
      .eq('sequence_id', id)
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to update sequence email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: email });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to update sequence email:', error);
    const message = error instanceof Error ? error.message : 'Failed to update sequence email';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; emailId: string }> }
) {
  try {
    const user = await requireAuth();
    const { id, emailId } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify sequence ownership
    const { data: sequence } = await supabaseAdmin
      .from('sequences')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    // Get the step number of the email being deleted
    const { data: emailToDelete } = await supabaseAdmin
      .from('sequence_emails')
      .select('step_number')
      .eq('id', emailId)
      .eq('sequence_id', id)
      .single();

    if (!emailToDelete) {
      return NextResponse.json({ error: 'Email step not found' }, { status: 404 });
    }

    // Delete the email step
    const { error } = await supabaseAdmin
      .from('sequence_emails')
      .delete()
      .eq('id', emailId)
      .eq('sequence_id', id);

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to delete sequence email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Renumber remaining steps that come after the deleted one
    const { data: remaining } = await supabaseAdmin
      .from('sequence_emails')
      .select('id, step_number')
      .eq('sequence_id', id)
      .gt('step_number', emailToDelete.step_number)
      .order('step_number', { ascending: true });

    if (remaining && remaining.length > 0) {
      for (const email of remaining) {
        await supabaseAdmin
          .from('sequence_emails')
          .update({ step_number: email.step_number - 1 })
          .eq('id', email.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to delete sequence email:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete sequence email';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
