// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({
        plan: { name: 'Free', price: '$0/mo', renewal_date: null, daily_limit: 500, monthly_limit: 10000, contacts_limit: 2000 },
        usage: { emails_today: 0, emails_month: 0, contacts: 0, campaigns_month: 0 },
        history: [],
      });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();

    // Count contacts for user
    const { count: contactsCount } = await supabaseAdmin
      .from('contacts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Campaigns sent today — sum stats->sent
    const { data: todayCampaigns } = await supabaseAdmin
      .from('campaigns')
      .select('stats')
      .eq('user_id', user.id)
      .gte('created_at', todayStart);

    const emailsToday = (todayCampaigns || []).reduce((sum: number, c: any) => {
      const sent = c.stats?.sent || 0;
      return sum + sent;
    }, 0);

    // Campaigns this month
    const { data: monthCampaigns } = await supabaseAdmin
      .from('campaigns')
      .select('stats')
      .eq('user_id', user.id)
      .gte('created_at', monthStart);

    const emailsMonth = (monthCampaigns || []).reduce((sum: number, c: any) => {
      const sent = c.stats?.sent || 0;
      return sum + sent;
    }, 0);

    const campaignsMonth = (monthCampaigns || []).length;

    // History: group campaigns by month for last 6 months
    const { data: historyCampaigns } = await supabaseAdmin
      .from('campaigns')
      .select('created_at, stats')
      .eq('user_id', user.id)
      .gte('created_at', sixMonthsAgo)
      .order('created_at', { ascending: false });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historyMap: Record<string, { emails: number; campaigns: number }> = {};

    // Pre-fill last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      historyMap[key] = { emails: 0, campaigns: 0 };
    }

    (historyCampaigns || []).forEach((c) => {
      const d = new Date(c.created_at);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (historyMap[key]) {
        historyMap[key].emails += c.stats?.sent || 0;
        historyMap[key].campaigns += 1;
      }
    });

    const history = Object.entries(historyMap).map(([month, data]) => ({
      month,
      emails: data.emails,
      campaigns: data.campaigns,
    }));

    return NextResponse.json({
      plan: {
        name: 'Free',
        price: '$0/mo',
        renewal_date: null,
        daily_limit: 500,
        monthly_limit: 10000,
        contacts_limit: 2000,
      },
      usage: {
        emails_today: emailsToday,
        emails_month: emailsMonth,
        contacts: contactsCount || 0,
        campaigns_month: campaignsMonth,
      },
      history,
    });
  } catch (err: unknown) {
    console.error('Billing usage error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
