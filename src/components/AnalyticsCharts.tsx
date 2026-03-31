'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useIsMobile } from '@/hooks/useIsMobile';

type Campaign = {
  id: string;
  name?: string;
  subject?: string;
  status?: string;
  sent?: number;
  sent_count?: number;
  opens?: number;
  open_count?: number;
  clicks?: number;
  click_count?: number;
  created_at?: string;
};

type Contact = {
  id: string;
  email: string;
  created_at?: string;
};

type Props = {
  campaigns: Campaign[];
  contacts: Contact[];
};

export default function AnalyticsCharts({ campaigns, contacts }: Props) {
  const isMobile = useIsMobile();
  const sentCampaigns = campaigns.filter(c => c.status === 'sent');

  const barData = sentCampaigns.slice(0, 8).map(c => ({
    name: (c.name || c.subject || 'Untitled').slice(0, isMobile ? 8 : 15),
    received: c.sent_count ?? c.sent ?? 0,
    read: c.open_count ?? c.opens ?? 0,
    clicked: c.click_count ?? c.clicks ?? 0,
  }));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const growthData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthContacts = contacts.filter(c => {
      if (!c.created_at) return i === 0;
      const cd = new Date(c.created_at);
      return cd <= new Date(d.getFullYear(), d.getMonth() + 1, 0);
    });
    growthData.push({
      month: monthNames[d.getMonth()],
      customers: monthContacts.length,
    });
  }

  const chartHeight = isMobile ? 200 : 260;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: isMobile ? 16 : 20 }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #E0F7FA',
        padding: isMobile ? 16 : 20,
        boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
      }}>
        <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>
          Your Customers Over Time
        </h3>
        {contacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#8b8ba7', fontSize: 14 }}>
            Add customers to see your growth chart
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F7FA" />
              <XAxis dataKey="month" tick={{ fontSize: isMobile ? 10 : 12, fill: '#8b8ba7' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12, fill: '#8b8ba7' }} axisLine={false} tickLine={false} width={isMobile ? 30 : 40} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E0F7FA', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Line type="monotone" dataKey="customers" stroke="#00B4D8" strokeWidth={2.5} dot={{ fill: '#00B4D8', strokeWidth: 0, r: isMobile ? 3 : 4 }} activeDot={{ r: 6, fill: '#00B4D8' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #E0F7FA',
        padding: isMobile ? 16 : 20,
        boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
      }}>
        <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>
          Email Performance
        </h3>
        {barData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#8b8ba7', fontSize: 14 }}>
            Send your first email to see performance data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F7FA" />
              <XAxis dataKey="name" tick={{ fontSize: isMobile ? 9 : 11, fill: '#8b8ba7' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12, fill: '#8b8ba7' }} axisLine={false} tickLine={false} width={isMobile ? 30 : 40} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E0F7FA', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="received" fill="#C2ADFF" radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="read" fill="#00B4D8" radius={[4, 4, 0, 0]} name="Read" />
              <Bar dataKey="clicked" fill="#FF6B6B" radius={[4, 4, 0, 0]} name="Clicked" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
