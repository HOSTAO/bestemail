import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SETUP_SECRET = process.env.SESSION_SECRET || 'bestemail-setup-2026';

export async function POST(request: NextRequest) {
  try {
    const { secret, email } = await request.json();

    if (secret !== SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // List all users
    if (!email) {
      const { data, error } = await supabase.from('users').select('id, email, name, role').order('created_at');
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ users: data });
    }

    // Update role to admin
    const { data, error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('email', email.toLowerCase())
      .select('id, email, name, role')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
