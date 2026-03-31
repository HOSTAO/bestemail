'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  name?: string;
};

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await fetch('/api/auth/check');
        const authData = await authRes.json();
        if (!authData.authenticated) {
          setIsAuthenticated(false);
          router.push('/login');
          return;
        }
        setUserName(authData.user?.name || authData.user?.email?.split('@')[0] || '');

        const [campRes, contRes] = await Promise.all([
          fetch('/api/campaigns'),
          fetch('/api/contacts'),
        ]);
        if (campRes.ok) {
          const d = await campRes.json();
          setCampaigns(d.campaigns || d || []);
        }
        if (contRes.ok) {
          const d = await contRes.json();
          setContacts(d.contacts || d || []);
        }
      } catch (e) {
        console.error('Dashboard init failed:', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (!isAuthenticated || loading) {
    return (
      <div style={{ padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#8b8ba7' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #E0F7FA', borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Loading...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const sentCampaigns = campaigns.filter(c => c.status === 'sent');
  const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.sent_count ?? c.sent ?? 0), 0);
  const totalOpens = sentCampaigns.reduce((sum, c) => sum + (c.open_count ?? c.opens ?? 0), 0);
  const totalClicks = sentCampaigns.reduce((sum, c) => sum + (c.click_count ?? c.clicks ?? 0), 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { href: '/dashboard/campaigns/new', icon: '✉️', title: 'Write an Email', desc: 'Create and send a beautiful email to your customers', color: '#00B4D8' },
    { href: '/dashboard/contacts', icon: '👥', title: 'Add Customers', desc: 'Import your customer list or add them one by one', color: '#FF6B6B' },
    { href: '/dashboard/forms', icon: '📋', title: 'Create a Form', desc: 'Get new customers to sign up on your website', color: '#22c55e' },
    { href: '/dashboard/analytics', icon: '📊', title: 'View Reports', desc: 'See how your emails are performing', color: '#f59e0b' },
  ];

  const getStatusChip = (status?: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      sent: { bg: '#dcfce7', color: '#16a34a', label: 'Sent' },
      draft: { bg: '#E0F7FA', color: '#00B4D8', label: 'Draft' },
      scheduled: { bg: '#fef3c7', color: '#d97706', label: 'Scheduled' },
    };
    const s = map[status || 'draft'] || map.draft;
    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        fontSize: 12,
        fontWeight: 600,
      }}>{s.label}</span>
    );
  };

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom: isMobile ? 20 : 28 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
          {getGreeting()}, {userName ? userName.split(' ')[0] : 'there'}! 👋
        </h1>
        <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: isMobile ? 14 : 15 }}>
          Here&apos;s how your business is doing
        </p>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: isMobile ? 12 : 16,
        marginBottom: isMobile ? 20 : 28,
      }}>
        {[
          { label: 'Your Customers', value: contacts.length, icon: '👥', color: '#00B4D8' },
          { label: 'Emails Sent', value: totalSent, icon: '✉️', color: '#FF6B6B' },
          { label: 'People Read It', value: totalOpens, icon: '👁️', color: '#22c55e' },
          { label: 'People Clicked', value: totalClicks, icon: '👆', color: '#f59e0b' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#fff',
            borderRadius: 16,
            padding: isMobile ? '16px' : '20px',
            boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
            border: '1px solid #E0F7FA',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: isMobile ? 12 : 13, color: '#8b8ba7', fontWeight: 500 }}>{stat.label}</span>
              <span style={{ fontSize: isMobile ? 18 : 20 }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, color: '#1a1a2e', marginTop: 8 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* What do you want to do today? */}
      <div style={{ marginBottom: isMobile ? 20 : 28 }}>
        <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#1a1a2e', marginBottom: isMobile ? 12 : 16 }}>
          What do you want to do today?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: isMobile ? 12 : 14,
        }}>
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} style={{
              background: '#fff',
              borderRadius: 16,
              padding: isMobile ? 16 : 20,
              border: '1px solid #E0F7FA',
              boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
              textDecoration: 'none',
              color: '#1a1a2e',
              transition: 'all 0.2s ease',
              display: isMobile ? 'flex' : 'block',
              alignItems: 'center',
              gap: isMobile ? 14 : undefined,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: action.color + '14',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                marginBottom: isMobile ? 0 : 12,
                flexShrink: 0,
              }}>
                {action.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: isMobile ? 14 : 15, marginBottom: 4 }}>{action.title}</div>
                <div style={{ fontSize: 13, color: '#8b8ba7', lineHeight: 1.5 }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly Summary */}
      {sentCampaigns.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #00B4D8, #48CAE4)',
          borderRadius: 16,
          padding: isMobile ? 16 : 24,
          marginBottom: isMobile ? 20 : 28,
          color: '#fff',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, marginBottom: 4 }}>Your Progress</div>
          <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700 }}>
            You sent {sentCampaigns.length} {sentCampaigns.length === 1 ? 'email' : 'emails'} to {totalSent} people. {totalOpens} people read {totalOpens === 1 ? 'it' : 'them'}!
          </div>
          {totalOpens > 0 && totalSent > 0 && (
            <div style={{ marginTop: 8, fontSize: isMobile ? 13 : 14, opacity: 0.85 }}>
              That&apos;s {Math.round((totalOpens / totalSent) * 100)}% of your customers — {Math.round((totalOpens / totalSent) * 100) > 20 ? '🟢 Great job!' : Math.round((totalOpens / totalSent) * 100) > 10 ? '🟡 Good start!' : '🔴 Let\'s improve this!'}
            </div>
          )}
        </div>
      )}

      {/* Recent Emails */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #E0F7FA',
        boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '16px 16px 12px' : '20px 20px 16px',
        }}>
          <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>Recent Emails</h2>
          <Link href="/dashboard/campaigns/new" style={{
            background: '#00B4D8',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
          }}>
            + New Email
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: isMobile ? '32px 16px' : '40px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✉️</div>
            <p style={{ color: '#8b8ba7', fontSize: 15, marginBottom: 16 }}>No emails yet. Write your first email!</p>
            <Link href="/dashboard/campaigns/new" style={{
              display: 'inline-block',
              background: '#00B4D8',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              minHeight: 44,
            }}>
              Write Your First Email
            </Link>
          </div>
        ) : (
          <div>
            {campaigns.slice(0, 5).map((campaign, i) => (
              <Link key={campaign.id} href={`/dashboard/campaigns/new?id=${campaign.id}`} style={{
                display: isMobile ? 'block' : 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '14px 16px' : '14px 20px',
                borderTop: i > 0 ? '1px solid #F0F0F8' : 'none',
                textDecoration: 'none',
                color: '#1a1a2e',
              }}>
                <div style={{ minWidth: 0, marginBottom: isMobile ? 8 : 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{campaign.name || campaign.subject || 'Untitled'}</div>
                  <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{campaign.subject || ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 16, flexWrap: 'wrap' }}>
                  {getStatusChip(campaign.status)}
                  <span style={{ fontSize: 12, color: '#8b8ba7' }}>
                    {(campaign.sent_count ?? campaign.sent ?? 0)} received
                  </span>
                  <span style={{ fontSize: 12, color: '#8b8ba7' }}>
                    {(campaign.open_count ?? campaign.opens ?? 0)} read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Getting Started Checklist */}
      {(contacts.length === 0 || campaigns.length === 0) && (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E0F7FA',
          boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
          padding: isMobile ? 16 : 24,
          marginTop: isMobile ? 20 : 28,
        }}>
          <h2 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Getting Started ✨</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { done: true, label: 'Create your account', href: '#' },
              { done: contacts.length > 0, label: 'Add your first customers', href: '/dashboard/contacts' },
              { done: campaigns.length > 0, label: 'Write your first email', href: '/dashboard/campaigns/new' },
              { done: sentCampaigns.length > 0, label: 'Send your first email', href: '/dashboard/campaigns/new' },
            ].map((step) => (
              <Link key={step.label} href={step.href} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid #E0F7FA',
                background: step.done ? '#E0F7FA' : '#fff',
                textDecoration: 'none',
                color: '#1a1a2e',
                minHeight: 44,
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: step.done ? '#00B4D8' : '#E0F7FA',
                  color: step.done ? '#fff' : '#8b8ba7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {step.done ? '✓' : ''}
                </div>
                <span style={{
                  fontWeight: 500,
                  fontSize: 14,
                  textDecoration: step.done ? 'line-through' : 'none',
                  color: step.done ? '#8b8ba7' : '#1a1a2e',
                }}>{step.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
