import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

export async function GET() {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { data, error } = await supabaseAdmin
      .from('cold_campaigns')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json(data || []);
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
    if (!name) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });
    }

    const fromName = typeof body.from_name === 'string' ? body.from_name.trim().slice(0, 100) : '';
    const fromEmail = typeof body.from_email === 'string' ? body.from_email.trim().slice(0, 200) : '';
    const replyTo = typeof body.reply_to === 'string' ? body.reply_to.trim().slice(0, 200) : fromEmail;
    const dailyLimit = typeof body.daily_limit === 'number' ? Math.min(Math.max(body.daily_limit, 1), 1000) : 50;
    const status = body.status === 'active' ? 'active' : 'paused';

    const { data, error } = await supabaseAdmin
      .from('cold_campaigns')
      .insert({
        user_id: user.id,
        name,
        from_name: fromName,
        from_email: fromEmail,
        reply_to: replyTo,
        daily_limit: dailyLimit,
        status,
        sent_count: 0,
        reply_count: 0,
        open_count: 0,
      })
      .select()
      .single();

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to create cold campaign:', error);
    const message = error instanceof Error ? error.message : 'Failed to create campaign';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
