import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';
import { createSendyCampaign } from '@/lib/sendy';
import { loadSecureSettings } from '@/lib/secure-settings';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const campaignId = String(body.campaignId || '');

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
    }

    const campaign = await db.getCampaign(user.id, campaignId);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const secureSettings = await loadSecureSettings(user.email);
    if (!secureSettings.api_url || !secureSettings.api_key || !secureSettings.list_id) {
      await db.updateCampaignStatus(user.id, campaignId, 'draft');
      return NextResponse.json({
        ok: false,
        error: 'Sendy is not configured. Save API URL, API key, and list ID in Settings before sending.',
        campaign: { ...campaign, status: 'draft' },
      }, { status: 400 });
    }

    const sendy = await createSendyCampaign({
      fromName: secureSettings.from_name || process.env.SENDY_FROM_NAME || 'Bestemail',
      fromEmail: secureSettings.from_email || process.env.SENDY_FROM_EMAIL || 'no-reply@bestemail.in',
      replyTo: secureSettings.from_email || process.env.SENDY_REPLY_TO || 'support@bestemail.in',
      subject: campaign.subject,
      plainText: campaign.content || '',
      htmlText: campaign.html_content || `<p>${(campaign.content || '').replace(/\n/g, '<br/>')}</p>`,
      title: campaign.name,
      scheduleDate: campaign.scheduled_at,
      configOverride: {
        apiUrl: secureSettings.api_url,
        apiKey: secureSettings.api_key,
        listId: secureSettings.list_id,
        brandId: secureSettings.brand_id,
      },
    });

    const newStatus = sendy.ok ? (campaign.scheduled_at ? 'scheduled' : 'sent') : 'draft';
    await db.updateCampaignStatus(user.id, campaignId, newStatus);

    return NextResponse.json({
      ok: sendy.ok,
      response: sendy.text,
      reason: sendy.reason,
      campaign: { ...campaign, status: newStatus },
    }, { status: sendy.ok ? 200 : sendy.reason === 'config_missing' ? 400 : 502 });
  } catch (error) {
    console.error('Failed to send campaign:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Send failed'
    }, { status: 500 });
  }
}