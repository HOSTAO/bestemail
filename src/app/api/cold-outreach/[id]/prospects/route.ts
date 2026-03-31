import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await context.params;

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

    const statusFilter = request.nextUrl.searchParams.get('status');

    let query = supabaseAdmin
      .from('cold_prospects')
      .select('*')
      .eq('campaign_id', id)
      .order('created_at', { ascending: false });

    if (statusFilter && ['pending', 'active', 'replied', 'bounced', 'completed'].includes(statusFilter)) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) { if (isMigrationPending(error)) return migrationPendingResponse(); throw error; }

    return NextResponse.json(data || []);
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuth();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await context.params;

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
    const prospects = Array.isArray(body) ? body : body.prospects;

    if (!Array.isArray(prospects) || prospects.length === 0) {
      return NextResponse.json({ error: 'Prospects array is required' }, { status: 400 });
    }

    // Validate and format prospects
    const rows = [];
    const errors: string[] = [];

    for (let i = 0; i < prospects.length; i++) {
      const p = prospects[i];
      const email = typeof p.email === 'string' ? p.email.trim().toLowerCase() : '';
      if (!email || !email.includes('@')) {
        errors.push(`Row ${i + 1}: invalid email "${p.email || ''}"`);
        continue;
      }

      rows.push({
        campaign_id: id,
        email,
        first_name: typeof p.first_name === 'string' ? p.first_name.trim().slice(0, 100) : '',
        last_name: typeof p.last_name === 'string' ? p.last_name.trim().slice(0, 100) : '',
        company: typeof p.company === 'string' ? p.company.trim().slice(0, 200) : '',
        custom_vars: typeof p.custom_vars === 'object' && p.custom_vars !== null ? p.custom_vars : {},
        status: 'pending',
        current_step: 0,
      });
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid prospects to import', details: errors }, { status: 400 });
    }

    // Insert in batches of 500
    let imported = 0;
    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500);
      const { error } = await supabaseAdmin.from('cold_prospects').insert(batch);
      if (error) {
        console.error('Batch insert error:', error);
        errors.push(`Batch starting at row ${i + 1}: ${error.message}`);
      } else {
        imported += batch.length;
      }
    }

    return NextResponse.json({
      imported,
      skipped: prospects.length - imported,
      errors: errors.length > 0 ? errors : undefined,
    }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to import prospects:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
