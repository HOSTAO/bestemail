import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const CF_API = 'https://api.cloudflare.com/client/v4';

type RecordResult = { record: string; status: 'created' | 'updated' | 'error'; error?: string };

async function cfFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${CF_API}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return res.json();
}

async function upsertTxtRecord(
  zoneId: string,
  token: string,
  name: string,
  content: string,
  label: string,
): Promise<RecordResult> {
  try {
    // Check if record already exists
    const existing = await cfFetch(
      `/zones/${zoneId}/dns_records?type=TXT&name=${encodeURIComponent(name)}`,
      token,
    );

    const records = existing?.result || [];
    const match = records.find((r: { content?: string }) =>
      r.content?.includes(label === 'SPF' ? 'v=spf1' : label === 'DKIM' ? 'v=DKIM1' : 'v=DMARC1')
    );

    if (match) {
      // Update existing record
      const updated = await cfFetch(`/zones/${zoneId}/dns_records/${match.id}`, token, {
        method: 'PUT',
        body: JSON.stringify({ type: 'TXT', name, content, ttl: 1 }),
      });
      if (!updated.success) {
        return { record: label, status: 'error', error: updated.errors?.[0]?.message || 'Update failed' };
      }
      return { record: label, status: 'updated' };
    } else {
      // Create new record
      const created = await cfFetch(`/zones/${zoneId}/dns_records`, token, {
        method: 'POST',
        body: JSON.stringify({ type: 'TXT', name, content, ttl: 1 }),
      });
      if (!created.success) {
        return { record: label, status: 'error', error: created.errors?.[0]?.message || 'Create failed' };
      }
      return { record: label, status: 'created' };
    }
  } catch (err) {
    return { record: label, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' };
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
    const cloudflareToken = typeof body.cloudflare_token === 'string' ? body.cloudflare_token.trim() : '';

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }
    if (!cloudflareToken) {
      return NextResponse.json({ error: 'Cloudflare API token is required' }, { status: 400 });
    }

    // Fetch domain record from DB
    const { data: domainRecord, error: fetchError } = await supabaseAdmin
      .from('sending_domains')
      .select('*')
      .eq('user_id', user.id)
      .eq('domain', domain)
      .single();

    if (fetchError || !domainRecord) {
      return NextResponse.json({ error: 'Domain not found in your account' }, { status: 404 });
    }

    // Use provided zone_id or look up zone in Cloudflare
    let zoneId = typeof body.zone_id === 'string' ? body.zone_id.trim() : '';

    if (!zoneId) {
      const zonesRes = await cfFetch(`/zones?name=${encodeURIComponent(domain)}`, cloudflareToken);
      if (!zonesRes.success || !zonesRes.result?.length) {
        return NextResponse.json({ error: 'Domain not found in this Cloudflare account' }, { status: 404 });
      }
      zoneId = zonesRes.result[0].id;
    }
    const dkimSelector = (domainRecord.dkim_selector as string) || 'bestemail';
    const dkimPublicKey = domainRecord.dkim_public_key as string;

    // Upsert all three DNS records
    const results = await Promise.all([
      upsertTxtRecord(zoneId, cloudflareToken, domain, 'v=spf1 include:mail.bestemail.in ~all', 'SPF'),
      upsertTxtRecord(zoneId, cloudflareToken, `${dkimSelector}._domainkey.${domain}`, `v=DKIM1; k=rsa; p=${dkimPublicKey}`, 'DKIM'),
      upsertTxtRecord(zoneId, cloudflareToken, `_dmarc.${domain}`, 'v=DMARC1; p=none; rua=mailto:dmarc@bestemail.in', 'DMARC'),
    ]);

    // Update sending_domains with Cloudflare info
    const tokenHint = cloudflareToken.slice(-4);
    await supabaseAdmin
      .from('sending_domains')
      .update({
        cf_zone_id: zoneId,
        cf_connected: true,
        cf_token_hint: tokenHint,
      })
      .eq('id', domainRecord.id)
      .eq('user_id', user.id);

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error('Cloudflare sync failed:', error);
    const message = error instanceof Error ? error.message : 'Cloudflare sync failed';
    const statusCode = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
