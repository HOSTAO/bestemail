import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function GET() {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const { data: sequences, error } = await supabaseAdmin
      .from('sequences')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to list sequences:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: sequences || [] });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to list sequences:', error);
    const message = error instanceof Error ? error.message : 'Failed to list sequences';
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
    const name = trimString(body.name, 120);

    if (!name) {
      return NextResponse.json({ error: 'Sequence name is required' }, { status: 400 });
    }

    const description = trimString(body.description, 500);
    const trigger_type = ['tag_added', 'form_submitted', 'manual', 'date_based'].includes(body.trigger_type)
      ? body.trigger_type
      : 'manual';
    const trigger_config = typeof body.trigger_config === 'object' && body.trigger_config !== null
      ? body.trigger_config
      : {};

    const { data: sequence, error } = await supabaseAdmin
      .from('sequences')
      .insert({
        user_id: user.id,
        name,
        description,
        trigger_type,
        trigger_config,
        status: 'draft',
        subscriber_count: 0,
      })
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to create sequence:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: sequence }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create sequence:', error);
    const message = error instanceof Error ? error.message : 'Failed to create sequence';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
