import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSendyCampaign } from '@/lib/sendy';
import { loadSecureSettings } from '@/lib/secure-settings';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

function personalizeContent(template: string, prospect: Record<string, unknown>): string {
  let result = template;
  const customVars = (prospect.custom_vars || {}) as Record<string, string>;

  result = result.replace(/\{\{first_name\}\}/gi, String(prospect.first_name || ''));
  result = result.replace(/\{\{last_name\}\}/gi, String(prospect.last_name || ''));
  result = result.replace(/\{\{company\}\}/gi, String(prospect.company || ''));
  result = result.replace(/\{\{email\}\}/gi, String(prospect.email || ''));

  // Replace custom variables like {{icebreaker}}, {{role}}, etc.
  for (const [key, value] of Object.entries(customVars)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
    result = result.replace(regex, String(value || ''));
  }

  return result;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Auth via secret query param for cron jobs
    const secret = request.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET || process.env.COLD_OUTREACH_CRON_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all active campaigns
    const { data: campaigns, error: campaignError } = await supabaseAdmin
      .from('cold_campaigns')
      .select('*')
      .eq('status', 'active');

    if (campaignError) { if (isMigrationPending(campaignError)) return migrationPendingResponse(); throw campaignError; }
    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ message: 'No active campaigns', processed: 0 });
    }

    const now = new Date().toISOString();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartISO = todayStart.toISOString();

    let totalProcessed = 0;
    const results: Array<{ campaign_id: string; name: string; sent: number; errors: number }> = [];

    for (const campaign of campaigns) {
      let sentThisCampaign = 0;
      let errorsThisCampaign = 0;

      // Count how many emails sent today for this campaign
      const { count: sentToday } = await supabaseAdmin
        .from('cold_send_log')
        .select('id', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id)
        .gte('sent_at', todayStartISO);

      const currentSentToday = sentToday || 0;
      const remainingQuota = campaign.daily_limit - currentSentToday;

      if (remainingQuota <= 0) {
        results.push({ campaign_id: campaign.id, name: campaign.name, sent: 0, errors: 0 });
        continue;
      }

      // Fetch steps for this campaign
      const { data: steps } = await supabaseAdmin
        .from('cold_email_steps')
        .select('*')
        .eq('campaign_id', campaign.id)
        .order('step_number', { ascending: true });

      if (!steps || steps.length === 0) {
        results.push({ campaign_id: campaign.id, name: campaign.name, sent: 0, errors: 0 });
        continue;
      }

      // Find eligible prospects
      const { data: prospects } = await supabaseAdmin
        .from('cold_prospects')
        .select('*')
        .eq('campaign_id', campaign.id)
        .in('status', ['pending', 'active'])
        .or(`next_send_at.is.null,next_send_at.lte.${now}`)
        .limit(remainingQuota);

      if (!prospects || prospects.length === 0) {
        results.push({ campaign_id: campaign.id, name: campaign.name, sent: 0, errors: 0 });
        continue;
      }

      // Load Sendy settings for the campaign owner
      const settings = await loadSecureSettings(campaign.user_id);

      for (const prospect of prospects) {
        const currentStep = prospect.current_step || 0;
        const step = steps.find((s: Record<string, unknown>) => (s.step_number as number) === currentStep + 1);

        if (!step) {
          // No more steps - mark prospect as completed
          await supabaseAdmin
            .from('cold_prospects')
            .update({ status: 'completed' })
            .eq('id', prospect.id);
          continue;
        }

        // Check stop_on_reply for previous steps
        if (prospect.status === 'replied') continue;

        // Personalize the email
        const personalizedSubject = personalizeContent(step.subject, prospect);
        const personalizedBody = personalizeContent(step.body_html, prospect);

        // Send via Sendy
        const sendResult = await createSendyCampaign({
          fromName: campaign.from_name,
          fromEmail: campaign.from_email,
          replyTo: campaign.reply_to || campaign.from_email,
          subject: personalizedSubject,
          htmlText: personalizedBody,
          plainText: stripHtml(personalizedBody),
          title: `Cold: ${campaign.name} - Step ${step.step_number} - ${prospect.email}`,
          userId: campaign.user_id,
          configOverride: {
            apiUrl: settings.api_url,
            apiKey: settings.api_key,
            listId: settings.list_id,
          },
        });

        if (sendResult.ok) {
          // Calculate next send date
          const nextStep = steps.find((s: Record<string, unknown>) => (s.step_number as number) === currentStep + 2);
          const nextSendAt = nextStep
            ? new Date(Date.now() + (nextStep.delay_days || 1) * 86400000).toISOString()
            : null;

          // Update prospect
          await supabaseAdmin
            .from('cold_prospects')
            .update({
              current_step: currentStep + 1,
              status: nextStep ? 'active' : 'completed',
              next_send_at: nextSendAt,
              last_sent_at: now,
            })
            .eq('id', prospect.id);

          // Log the send
          await supabaseAdmin
            .from('cold_send_log')
            .insert({
              campaign_id: campaign.id,
              prospect_id: prospect.id,
              step_id: step.id,
              step_number: step.step_number,
              sent_at: now,
            });

          sentThisCampaign++;
          totalProcessed++;
        } else {
          console.error(`Failed to send cold email to ${prospect.email}:`, sendResult.text);
          errorsThisCampaign++;

          if (sendResult.text?.toLowerCase().includes('bounce')) {
            await supabaseAdmin
              .from('cold_prospects')
              .update({ status: 'bounced' })
              .eq('id', prospect.id);
          }
        }
      }

      // Update campaign sent_count
      if (sentThisCampaign > 0) {
        await supabaseAdmin
          .from('cold_campaigns')
          .update({ sent_count: (campaign.sent_count || 0) + sentThisCampaign })
          .eq('id', campaign.id);
      }

      results.push({
        campaign_id: campaign.id,
        name: campaign.name,
        sent: sentThisCampaign,
        errors: errorsThisCampaign,
      });
    }

    return NextResponse.json({
      message: 'Processing complete',
      processed: totalProcessed,
      campaigns: results,
    });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Cold outreach processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
