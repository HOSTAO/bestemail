import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!supabaseAdmin) {
      return NextResponse.json({ ips: [], enabled: false });
    }

    const { data } = await supabaseAdmin
      .from('settings')
      .select('ip_allowlist')
      .eq('user_id', user.id)
      .single();

    const allowlist = data?.ip_allowlist || { ips: [], enabled: false };

    return NextResponse.json(allowlist);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed';
    const status = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();

    const ips = Array.isArray(body.ips) ? body.ips.filter((ip: unknown) => typeof ip === 'string' && ip.trim()) : [];
    const enabled = !!body.enabled;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { error } = await supabaseAdmin
      .from('settings')
      .update({ ip_allowlist: { ips, enabled } })
      .eq('user_id', user.id);

    if (error) {
      // If no row exists yet, try upsert
      const { error: upsertError } = await supabaseAdmin
        .from('settings')
        .upsert({ user_id: user.id, ip_allowlist: { ips, enabled } }, { onConflict: 'user_id' });

      if (upsertError) {
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed';
    const status = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
