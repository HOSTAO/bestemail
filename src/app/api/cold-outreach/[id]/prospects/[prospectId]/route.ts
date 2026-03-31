import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

type RouteContext = { params: Promise<{ id: string; prospectId: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id, prospectId } = await context.params;

    // Verify campaign ownership
    const { data: campaign } = await supabaseAdmin
      .from('cold_campaigns')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (typeof body.status === 'string' && ['pending', 'active', 'replied', 'bounced', 'completed'].includes(body.status)) {
      updates.status = body.status;
    }

    if (typeof body.first_name === 'string') updates.first_name = body.first_name.trim().slice(0, 100);
    if (typeof body.last_name === 'string') updates.last_name = body.last_name.trim().slice(0, 100);
    if (typeof body.company === 'string') updates.company = body.company.trim().slice(0, 200);
    if (typeof body.custom_vars === 'object' && body.custom_vars !== null) updates.custom_vars = body.custom_vars;

    const { data, error } = await supabaseAdmin
      .from('cold_prospects')
      .update(updates)
      .eq('id', prospectId)
      .eq('campaign_id', id)
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

    const { id, prospectId } = await context.params;

    // Verify campaign ownership
    const { data: campaign } = await supabaseAdmin
      .from('cold_campaigns')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const { error } = await supabaseAdmin
      .from('cold_prospects')
      .delete()
      .eq('id', prospectId)
      .eq('campaign_id', id);

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
