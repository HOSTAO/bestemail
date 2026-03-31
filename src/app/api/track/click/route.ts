// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaignId = searchParams.get('c');
    const contactId = searchParams.get('r');
    const linkId = searchParams.get('l');
    const url = searchParams.get('u');
    
    if (!campaignId || !contactId || !url) {
      return NextResponse.redirect('/');
    }
    
    // Decode the URL
    const targetUrl = decodeURIComponent(url);
    
    // Get user agent and IP for analytics
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    
    const supabase = createClientServer();
    
    if (!supabase) {
      console.log('Supabase not configured, skipping click tracking');
      return NextResponse.redirect(targetUrl);
    }
    
    // Record the click
    await supabase
      .from('campaign_clicks')
      .insert({
        campaign_id: campaignId,
        contact_id: contactId,
        link_id: linkId,
        url: targetUrl,
        clicked_at: new Date().toISOString(),
        user_agent: userAgent.substring(0, 255),
        ip_address: ip.substring(0, 45),
      });
    
    // Update campaign stats
    await supabase.rpc('increment_campaign_clicks', {
      campaign_id_param: campaignId
    });
    
    // Update contact engagement (clicks are worth more than opens)
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
        engagement_score: (contact?.engagement_score || 0) + 3,
      })
      .eq('id', contactId);
    
    // Redirect to the actual URL
    return NextResponse.redirect(targetUrl);
    
  } catch (error) {
    console.error('Error tracking click:', error);
    
    // If tracking fails, still try to redirect
    const url = request.nextUrl.searchParams.get('u');
    if (url) {
      return NextResponse.redirect(decodeURIComponent(url));
    }
    
    return NextResponse.redirect('/');
  }
}