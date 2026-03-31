import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await context.params;

    const { data: campaign, error } = await supabaseAdmin
      .from('cold_campaigns')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Fetch steps
    const { data: steps } = await supabaseAdmin
      .from('cold_email_steps')
      .select('*')
      .eq('campaign_id', id)
      .order('step_number', { ascending: true });

    // Fetch prospect stats
    const { data: prospects } = await supabaseAdmin
      .from('cold_prospects')
      .select('status')
      .eq('campaign_id', id);

    const prospectStats: Record<string, number> = { total: 0, pending: 0, active: 0, replied: 0, bounced: 0, completed: 0 };
    if (prospects) {
      prospectStats.total = prospects.length;
      for (const p of prospects) {
        const s = p.status || 'pending';
        if (s in prospectStats) prospectStats[s]++;
      }
    }

    return NextResponse.json({
      ...campaign,
      steps: steps || [],
      prospect_stats: prospectStats,
    });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('cold_campaigns')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (typeof body.name === 'string') updates.name = body.name.trim().slice(0, 200);
    if (typeof body.from_name === 'string') updates.from_name = body.from_name.trim().slice(0, 100);
    if (typeof body.from_email === 'string') updates.from_email = body.from_email.trim().slice(0, 200);
    if (typeof body.reply_to === 'string') updates.reply_to = body.reply_to.trim().slice(0, 200);
    if (typeof body.daily_limit === 'number') updates.daily_limit = Math.min(Math.max(body.daily_limit, 1), 1000);
    if (body.status === 'active' || body.status === 'paused') updates.status = body.status;

    const { data, error } = await supabaseAdmin
      .from('cold_campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json(data);
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await context.params;

    // Verify ownership
    const { data: existing } = await supabaseAdmin
      .from('cold_campaigns')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Delete prospects first
    await supabaseAdmin.from('cold_prospects').delete().eq('campaign_id', id);
    // Delete steps
    await supabaseAdmin.from('cold_email_steps').delete().eq('campaign_id', id);
    // Delete campaign
    const { error } = await supabaseAdmin.from('cold_campaigns').delete().eq('id', id);

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
