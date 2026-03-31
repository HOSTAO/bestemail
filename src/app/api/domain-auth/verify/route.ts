import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import dns from 'dns/promises';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const body = await request.json();
    const domainId = body.domain_id;

    if (!domainId) {
      return NextResponse.json({ error: 'domain_id is required' }, { status: 400 });
    }

    // Fetch the domain record
    const { data: domainRecord, error: fetchError } = await supabaseAdmin
      .from('sending_domains')
      .select('*')
      .eq('id', domainId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !domainRecord) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }

    const domain = domainRecord.domain as string;
    const dkimSelector = (domainRecord.dkim_selector as string) || 'bestemail';

    let spfVerified = false;
    let dkimVerified = false;
    let dmarcVerified = false;

    // Check SPF: look for TXT record containing 'v=spf1' on the domain
    try {
      const txtRecords = await dns.resolveTxt(domain);
      for (const record of txtRecords) {
        const joined = record.join('');
        if (joined.toLowerCase().includes('v=spf1')) {
          spfVerified = true;
          break;
        }
      }
    } catch {
      // DNS lookup failed - SPF not verified
    }

    // Check DKIM: look for TXT record on {selector}._domainkey.{domain}
    try {
      const dkimHost = `${dkimSelector}._domainkey.${domain}`;
      const txtRecords = await dns.resolveTxt(dkimHost);
      if (txtRecords.length > 0) {
        dkimVerified = true;
      }
    } catch {
      // DNS lookup failed - DKIM not verified
    }

    // Check DMARC: look for TXT record on _dmarc.{domain} containing 'v=DMARC1'
    try {
      const dmarcHost = `_dmarc.${domain}`;
      const txtRecords = await dns.resolveTxt(dmarcHost);
      for (const record of txtRecords) {
        const joined = record.join('');
        if (joined.toLowerCase().includes('v=dmarc1')) {
          dmarcVerified = true;
          break;
        }
      }
    } catch {
      // DNS lookup failed - DMARC not verified
    }

    // Update the sending_domains row with verification results
    const allVerified = spfVerified && dkimVerified && dmarcVerified;
    const updateData: Record<string, unknown> = {
      spf_verified: spfVerified,
      dkim_verified: dkimVerified,
      dmarc_verified: dmarcVerified,
    };

    if (allVerified) {
      updateData.verified_at = new Date().toISOString();
    } else {
      updateData.verified_at = null;
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('sending_domains')
      .update(updateData)
      .eq('id', domainId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to update domain verification:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error('Domain verification failed:', error);
    const message = error instanceof Error ? error.message : 'Verification failed';
    const statusCode = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
