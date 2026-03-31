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

    const { data: emails, error } = await supabaseAdmin
      .from('sequence_emails')
      .select('*')
      .eq('sequence_id', id)
      .order('step_number', { ascending: true });

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to list sequence emails:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: emails || [] });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to list sequence emails:', error);
    const message = error instanceof Error ? error.message : 'Failed to list sequence emails';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

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

    const body = await request.json();
    const subject = trimString(body.subject, 200);

    if (!subject) {
      return NextResponse.json({ error: 'Email subject is required' }, { status: 400 });
    }

    const body_html = trimString(body.body_html, 100_000) || '<p></p>';
    const delay_days = typeof body.delay_days === 'number' && body.delay_days >= 0
      ? Math.floor(body.delay_days)
      : 0;
    const delay_hours = typeof body.delay_hours === 'number' && body.delay_hours >= 0
      ? Math.floor(body.delay_hours)
      : 0;
    const send_time = typeof body.send_time === 'string' && /^\d{2}:\d{2}$/.test(body.send_time)
      ? body.send_time
      : null;

    // Auto-set step_number
    const { data: existingEmails } = await supabaseAdmin
      .from('sequence_emails')
      .select('step_number')
      .eq('sequence_id', id)
      .order('step_number', { ascending: false })
      .limit(1);

    const nextStep = existingEmails && existingEmails.length > 0
      ? existingEmails[0].step_number + 1
      : 1;

    const { data: email, error } = await supabaseAdmin
      .from('sequence_emails')
      .insert({
        sequence_id: id,
        step_number: nextStep,
        subject,
        body_html,
        delay_days,
        delay_hours,
        send_time,
      })
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to create sequence email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: email }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create sequence email:', error);
    const message = error instanceof Error ? error.message : 'Failed to create sequence email';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
