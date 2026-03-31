import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';

type ActivityEvent = {
  id: string;
  timestamp: string;
  event_type: 'sent' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'spam';
  email: string;
  campaign_name: string;
  details: string;
};

const SAMPLE_DOMAINS = [
  'gmail.com', 'outlook.com', 'yahoo.com', 'company.io', 'startup.co',
  'business.com', 'agency.dev', 'shop.store', 'brand.xyz', 'team.app',
];

const SAMPLE_NAMES = [
  'alice', 'bob', 'carol', 'dave', 'emma', 'frank', 'grace', 'henry',
  'iris', 'jack', 'kate', 'leo', 'mia', 'noah', 'olivia', 'peter',
  'quinn', 'rachel', 'sam', 'tina', 'uma', 'victor', 'wendy', 'xander',
];

const SAMPLE_CAMPAIGNS = [
  'March Newsletter', 'Product Launch Announcement', 'Weekly Digest #12',
  'Flash Sale - 40% Off', 'Welcome Series - Day 1', 'Re-engagement Campaign',
  'Feature Update v2.5', 'Holiday Special Offer', 'Customer Survey Q1',
  'Onboarding Sequence #3', 'Webinar Invitation', 'Year-End Recap',
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateMockEvents(userId: string, total: number): ActivityEvent[] {
  const rand = seededRandom(userId.split('').reduce((a, c) => a + c.charCodeAt(0), 0));
  const events: ActivityEvent[] = [];
  const now = Date.now();

  const typeWeights: { type: ActivityEvent['event_type']; weight: number; detail: string }[] = [
    { type: 'sent', weight: 0.35, detail: 'Email delivered successfully' },
    { type: 'opened', weight: 0.28, detail: 'Recipient opened the email' },
    { type: 'clicked', weight: 0.18, detail: 'Link clicked in email body' },
    { type: 'bounced', weight: 0.08, detail: 'Hard bounce - address not found' },
    { type: 'unsubscribed', weight: 0.07, detail: 'Recipient unsubscribed via link' },
    { type: 'spam', weight: 0.04, detail: 'Marked as spam by recipient' },
  ];

  for (let i = 0; i < total; i++) {
    const r = rand();
    let cumulative = 0;
    let chosen = typeWeights[0];
    for (const tw of typeWeights) {
      cumulative += tw.weight;
      if (r <= cumulative) { chosen = tw; break; }
    }

    const nameIdx = Math.floor(rand() * SAMPLE_NAMES.length);
    const domainIdx = Math.floor(rand() * SAMPLE_DOMAINS.length);
    const campaignIdx = Math.floor(rand() * SAMPLE_CAMPAIGNS.length);
    const hoursAgo = Math.floor(rand() * 720); // up to 30 days ago

    const timestamp = new Date(now - hoursAgo * 3600 * 1000);

    events.push({
      id: `evt-${userId.slice(0, 6)}-${i}`,
      timestamp: timestamp.toISOString(),
      event_type: chosen.type,
      email: `${SAMPLE_NAMES[nameIdx]}@${SAMPLE_DOMAINS[domainIdx]}`,
      campaign_name: SAMPLE_CAMPAIGNS[campaignIdx],
      details: chosen.type === 'clicked'
        ? `Clicked: https://example.com/link-${Math.floor(rand() * 100)}`
        : chosen.type === 'bounced' && rand() > 0.5
          ? 'Soft bounce - mailbox full'
          : chosen.detail,
    });
  }

  // Sort newest first
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return events;
}

async function fetchRealCampaignEvents(userId: string): Promise<ActivityEvent[]> {
  if (!supabaseAdmin) return [];

  try {
    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select('id, name, status, sent_at, stats, created_at')
      .eq('user_id', userId)
      .eq('status', 'sent')
      .order('sent_at', { ascending: false })
      .limit(20);

    if (error || !campaigns?.length) return [];

    const events: ActivityEvent[] = [];
    for (const c of campaigns) {
      const stats = (c.stats || {}) as { sent?: number; opened?: number; clicked?: number };
      const ts = c.sent_at || c.created_at;

      if (stats.sent) {
        events.push({
          id: `camp-${c.id}-sent`,
          timestamp: ts,
          event_type: 'sent',
          email: `${stats.sent} recipients`,
          campaign_name: c.name,
          details: `Batch send: ${stats.sent} emails delivered`,
        });
      }
      if (stats.opened) {
        events.push({
          id: `camp-${c.id}-opened`,
          timestamp: new Date(new Date(ts).getTime() + 3600000).toISOString(),
          event_type: 'opened',
          email: `${stats.opened} recipients`,
          campaign_name: c.name,
          details: `${stats.opened} unique opens`,
        });
      }
      if (stats.clicked) {
        events.push({
          id: `camp-${c.id}-clicked`,
          timestamp: new Date(new Date(ts).getTime() + 7200000).toISOString(),
          event_type: 'clicked',
          email: `${stats.clicked} recipients`,
          campaign_name: c.name,
          details: `${stats.clicked} unique clicks`,
        });
      }
    }

    return events;
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const url = request.nextUrl;

    const typeFilter = url.searchParams.get('type') || '';
    const emailSearch = (url.searchParams.get('email') || '').toLowerCase();
    const fromDate = url.searchParams.get('from') || '';
    const toDate = url.searchParams.get('to') || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));

    // Combine real campaign events with mock data
    const realEvents = await fetchRealCampaignEvents(user.id);
    const mockEvents = generateMockEvents(user.id, 500);

    let allEvents = [...realEvents, ...mockEvents];

    // Deduplicate by id
    const seen = new Set<string>();
    allEvents = allEvents.filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    });

    // Sort newest first
    allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply filters
    if (typeFilter && typeFilter !== 'all') {
      allEvents = allEvents.filter((e) => e.event_type === typeFilter);
    }

    if (emailSearch) {
      allEvents = allEvents.filter((e) => e.email.toLowerCase().includes(emailSearch));
    }

    if (fromDate) {
      const from = new Date(fromDate);
      allEvents = allEvents.filter((e) => new Date(e.timestamp) >= from);
    }

    if (toDate) {
      const to = new Date(toDate + 'T23:59:59.999Z');
      allEvents = allEvents.filter((e) => new Date(e.timestamp) <= to);
    }

    const total = allEvents.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const events = allEvents.slice(start, start + limit);

    return NextResponse.json({ events, total, page, pages });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    const status = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
