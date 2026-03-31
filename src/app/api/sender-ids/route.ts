import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!supabaseAdmin) return NextResponse.json({ senderIds: [] });
    const { data, error } = await supabaseAdmin
      .from('sender_ids')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ senderIds: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { from_name, from_email, reply_to } = await req.json();

    if (!from_name?.trim() || !from_email?.trim()) {
      return NextResponse.json({ error: 'From Name and From Email are required' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(from_email.trim())) {
      return NextResponse.json({ error: 'Invalid From Email format' }, { status: 400 });
    }

    const replyToEmail = reply_to?.trim() || from_email.trim();
    if (reply_to?.trim() && !EMAIL_REGEX.test(reply_to.trim())) {
      return NextResponse.json({ error: 'Invalid Reply-To Email format' }, { status: 400 });
    }

    if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

    // Check if user has any senders — if not, make this one default
    const { data: existing } = await supabaseAdmin
      .from('sender_ids')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    const isFirst = !existing || existing.length === 0;

    const { data, error } = await supabaseAdmin
      .from('sender_ids')
      .insert({
        user_id: user.id,
        from_name: from_name.trim(),
        from_email: from_email.trim(),
        reply_to: replyToEmail,
        is_default: isFirst,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ senderId: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create sender identity';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { id, is_default } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Sender ID is required' }, { status: 400 });
    }

    if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

    if (is_default) {
      // Unset all other defaults for this user first
      const { error: unsetError } = await supabaseAdmin
        .from('sender_ids')
        .update({ is_default: false })
        .eq('user_id', user.id);

      if (unsetError) throw unsetError;

      // Set the selected one as default
      const { error: setError } = await supabaseAdmin
        .from('sender_ids')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (setError) throw setError;
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update sender identity';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Sender ID is required' }, { status: 400 });
    }

    if (!supabaseAdmin) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    const { error } = await supabaseAdmin
      .from('sender_ids')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete sender identity';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
