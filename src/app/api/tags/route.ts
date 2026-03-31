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

    const { data: tags, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to list tags:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: tags || [] }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to list tags:', error);
    const message = error instanceof Error ? error.message : 'Failed to list tags';
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
    const name = trimString(body.name, 100);

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }

    // Check uniqueness per user
    const { data: existing } = await supabaseAdmin
      .from('tags')
      .select('id')
      .eq('user_id', user.id)
      .ilike('name', name)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'A tag with this name already exists' }, { status: 409 });
    }

    const color = trimString(body.color, 20) || '#3B82F6';
    const description = trimString(body.description, 500);

    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .insert({
        user_id: user.id,
        name,
        color,
        description,
        subscriber_count: 0,
      })
      .select()
      .single();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to create tag:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: tag }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create tag:', error);
    const message = error instanceof Error ? error.message : 'Failed to create tag';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
