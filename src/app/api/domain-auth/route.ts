import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const { data: domains, error } = await supabaseAdmin
      .from('sending_domains')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to list domains:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: domains || [] }, { status: 200 });
  } catch (error) {
    console.error('Failed to list domains:', error);
    const message = error instanceof Error ? error.message : 'Failed to list domains';
    const statusCode = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const body = await request.json();
    const domain = typeof body.domain === 'string' ? body.domain.trim().toLowerCase() : '';

    if (!domain) {
      return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
    }

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
    }

    // Check for duplicate domain per user
    const { data: existing } = await supabaseAdmin
      .from('sending_domains')
      .select('id')
      .eq('user_id', user.id)
      .eq('domain', domain)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'This domain has already been added' }, { status: 409 });
    }

    // Generate DKIM selector and mock RSA public key
    const dkimSelector = 'bestemail';
    const dkimPublicKey = crypto.randomBytes(128).toString('base64');

    const { data: newDomain, error } = await supabaseAdmin
      .from('sending_domains')
      .insert({
        user_id: user.id,
        domain,
        dkim_selector: dkimSelector,
        dkim_public_key: dkimPublicKey,
        spf_verified: false,
        dkim_verified: false,
        dmarc_verified: false,
        verified_at: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add domain:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: newDomain }, { status: 201 });
  } catch (error) {
    console.error('Failed to add domain:', error);
    const message = error instanceof Error ? error.message : 'Failed to add domain';
    const statusCode = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Domain ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('sending_domains')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete domain:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete domain:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete domain';
    const statusCode = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
