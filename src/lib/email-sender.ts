import { createClientServer } from '@/lib/supabase';
import { replaceMergeTags } from './email-templates';
import { createSendyCampaign, addSubscriberToSendy } from './sendy';

interface SendEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  campaignId?: string;
  contactId?: string;
  preheader?: string;
  fromName?: string;
  fromEmail?: string;
}

// ONLY SENDY - NO OTHER EMAIL SERVICE
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || 'hello@bestemail.in';
const DEFAULT_FROM_NAME = process.env.DEFAULT_FROM_NAME || 'Bestemail';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bestemail.in';

export function wrapLinksForTracking(
  html: string, 
  campaignId: string, 
  contactId: string
): string {
  // Regex to find all links
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let linkCounter = 0;
  
  return html.replace(linkRegex, (match, url) => {
    // Skip tracking for unsubscribe links, mailto, tel, and anchors
    if (
      url.includes('unsubscribe') || 
      url.startsWith('mailto:') || 
      url.startsWith('tel:') ||
      url.startsWith('#') ||
      url.includes('{{unsubscribe_link}}')
    ) {
      return match;
    }
    
    linkCounter++;
    const trackingUrl = `${BASE_URL}/api/track/click?c=${campaignId}&r=${contactId}&l=${linkCounter}&u=${encodeURIComponent(url)}`;
    
    return match.replace(url, trackingUrl);
  });
}

export function addTrackingPixel(
  html: string, 
  campaignId: string, 
  contactId: string
): string {
  const trackingPixel = `<img src="${BASE_URL}/api/track/open?c=${campaignId}&r=${contactId}" width="1" height="1" style="display:block;width:1px;height:1px;border:0;" alt="" />`;
  
  // Add pixel before closing body tag if it exists
  if (html.includes('</body>')) {
    return html.replace('</body>', `${trackingPixel}</body>`);
  }
  
  // Otherwise add at the end
  return html + trackingPixel;
}

export function generateUnsubscribeLink(contactId: string, campaignId?: string): string {
  const params = new URLSearchParams({
    contact: contactId,
    ...(campaignId && { campaign: campaignId })
  });
  
  return `${BASE_URL}/unsubscribe?${params.toString()}`;
}

export function prepareEmailContent(
  template: string,
  contact: Record<string, any>,
  campaignId?: string
): string {
  // Replace merge tags
  let content = replaceMergeTags(template, {
    first_name: contact.first_name || 'there',
    last_name: contact.last_name || '',
    email: contact.email,
    company_name: contact.company || '',
    city: contact.city || '',
    unsubscribe_link: generateUnsubscribeLink(contact.id, campaignId),
    ...contact.custom_fields,
  });
  
  // Add tracking if campaign ID is provided
  if (campaignId && contact.id) {
    content = wrapLinksForTracking(content, campaignId, contact.id);
    content = addTrackingPixel(content, campaignId, contact.id);
  }
  
  return content;
}

// SENDY ONLY - ALL EMAILS GO THROUGH SENDY
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const {
    to,
    subject,
    htmlContent,
    textContent,
    campaignId,
    contactId,
    preheader,
    fromName = DEFAULT_FROM_NAME,
    fromEmail = DEFAULT_FROM_EMAIL,
  } = options;
  
  // SENDY IS REQUIRED - NO EXCEPTIONS
  if (!process.env.SENDY_API_URL || !process.env.SENDY_API_KEY) {
    throw new Error('SENDY IS REQUIRED: Please configure SENDY_API_URL and SENDY_API_KEY in your environment.');
  }
  
  try {
    // ALL emails go through Sendy as campaigns
    const result = await createSendyCampaign({
      fromName,
      fromEmail,
      replyTo: fromEmail,
      subject,
      plainText: textContent || htmlContent.replace(/<[^>]*>/g, ''),
      htmlText: htmlContent,
      title: `${campaignId ? 'Campaign' : 'Transactional'}: ${subject}`,
    });
    
    return result.ok && (result.text === 'Campaign created and sent' || result.text === 'Campaign created');
  } catch (error) {
    console.error('Sendy error:', error);
    throw new Error(`Sendy is the only email service. Error: ${error}`);
  }
}

// SENDY ONLY - BULK CAMPAIGN SENDING
export async function sendCampaign(
  campaignId: string,
  segmentId?: string
): Promise<{ sent: number; failed: number }> {
  const supabase = createClientServer();
  
  if (!supabase) {
    throw new Error('Database not configured');
  }
  
  // Get campaign details
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();
    
  if (campaignError || !campaign) {
    throw new Error('Campaign not found');
  }
  
  // SENDY IS REQUIRED
  if (!process.env.SENDY_API_URL || !process.env.SENDY_API_KEY) {
    throw new Error('SENDY IS REQUIRED for sending campaigns');
  }
  
  try {
    // Get total contacts count for the segment
    let contactsQuery = supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('subscribed', true);
    
    if (segmentId) {
      // Apply segment filters
      switch (segmentId) {
        case 'engaged':
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          contactsQuery = contactsQuery.gte('last_engaged_at', thirtyDaysAgo.toISOString());
          break;
        case 'new':
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          contactsQuery = contactsQuery.gte('created_at', sevenDaysAgo.toISOString());
          break;
        case 'inactive':
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          contactsQuery = contactsQuery.or(`last_engaged_at.is.null,last_engaged_at.lt.${ninetyDaysAgo.toISOString()}`);
          break;
        case 'vip':
          contactsQuery = contactsQuery.gte('engagement_score', 15);
          break;
      }
    }
    
    const { count: totalContacts } = await contactsQuery;
    
    // Prepare campaign content with tracking
    const htmlContent = prepareEmailContent(
      campaign.html_content,
      { 
        first_name: '[Name]', // Sendy merge tags
        email: '[Email]',
        unsubscribe_link: '[unsubscribe]',
      },
      campaignId
    );
    
    // Send through Sendy ONLY
    const result = await createSendyCampaign({
      fromName: DEFAULT_FROM_NAME,
      fromEmail: DEFAULT_FROM_EMAIL,
      replyTo: DEFAULT_FROM_EMAIL,
      subject: campaign.subject,
      plainText: campaign.content || htmlContent.replace(/<[^>]*>/g, ''),
      htmlText: htmlContent,
      title: campaign.name,
      scheduleDate: campaign.scheduled_at,
    });
    
    if (result.ok) {
      // Update campaign status
      await supabase
        .from('campaigns')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString(),
          sent_count: totalContacts || 0,
          total_recipients: totalContacts || 0,
        })
        .eq('id', campaignId);
        
      return { sent: totalContacts || 0, failed: 0 };
    } else {
      throw new Error(`Sendy error: ${result.text}`);
    }
  } catch (error) {
    console.error('Sendy campaign error:', error);
    throw error; // No fallback - Sendy is required
  }
}