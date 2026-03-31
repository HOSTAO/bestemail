import { NextRequest, NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

// 1x1 transparent GIF
const TRACKING_PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaignId = searchParams.get('c');
    const contactId = searchParams.get('r');
    
    if (!campaignId || !contactId) {
      return new NextResponse(TRACKING_PIXEL, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    // Get user agent and IP for analytics
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    
    // Detect device type
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    const device = isMobile ? 'mobile' : 'desktop';
    
    // Detect email client
    let emailClient = 'unknown';
    if (userAgent.includes('Thunderbird')) emailClient = 'thunderbird';
    else if (userAgent.includes('Microsoft Outlook')) emailClient = 'outlook';
    else if (userAgent.includes('Postbox')) emailClient = 'postbox';
    else if (userAgent.includes('Apple Mail')) emailClient = 'apple-mail';
    else if (userAgent.includes('Gmail')) emailClient = 'gmail';
    
    const supabase = createClientServer();
    
    if (!supabase) {
      console.log('Supabase not configured, skipping open tracking');
      return new NextResponse(TRACKING_PIXEL, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }
    
    // Check if already opened (avoid duplicate tracking)
    const { data: existing } = await supabase
      .from('campaign_opens')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('contact_id', contactId)
      .single();
    
    if (!existing) {
      // Record the open
      await supabase
        .from('campaign_opens')
        .insert({
          campaign_id: campaignId,
          contact_id: contactId,
          opened_at: new Date().toISOString(),
          user_agent: userAgent.substring(0, 255),
          ip_address: ip.substring(0, 45),
          device_type: device,
          email_client: emailClient,
        });
      
      // Update campaign stats
      await supabase.rpc('increment_campaign_opens', {
        campaign_id_param: campaignId
      });
      
      // Update contact engagement
      // First get current score
      const { data: contact } = await supabase
        .from('contacts')
        .select('engagement_score')
        .eq('id', contactId)
        .single();
      
      await supabase
        .from('contacts')
        .update({
          last_engaged_at: new Date().toISOString(),
          engagement_score: (contact?.engagement_score || 0) + 1,
        })
        .eq('id', contactId);
    }
    
    return new NextResponse(TRACKING_PIXEL, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error tracking open:', error);
    
    // Still return the pixel even if tracking fails
    return new NextResponse(TRACKING_PIXEL, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  }
}