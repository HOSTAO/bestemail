'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  emoji: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: 'SEND',
    items: [
      { href: '/dashboard', label: 'Home', emoji: '🏠', icon: <HomeIcon /> },
      { href: '/dashboard/campaigns', label: 'Emails', emoji: '✉️', icon: <MailIcon /> },
      { href: '/dashboard/ab-testing', label: 'A/B Test', emoji: '⚡', icon: <ABTestIcon /> },
      { href: '/dashboard/templates', label: 'Templates', emoji: '🎨', icon: <TemplateIcon /> },
    ],
  },
  {
    title: 'AUDIENCE',
    items: [
      { href: '/dashboard/subscribers', label: 'Subscribers', emoji: '👤', icon: <UsersIcon /> },
      { href: '/dashboard/tags', label: 'Tags', emoji: '🏷️', icon: <TagIcon /> },
      { href: '/dashboard/contacts', label: 'Customers', emoji: '👥', icon: <UsersIcon /> },
      { href: '/dashboard/segments', label: 'Segments', emoji: '📂', icon: <SegmentIcon /> },
    ],
  },
  {
    title: 'GROW',
    items: [
      { href: '/dashboard/sequences', label: 'Sequences', emoji: '📨', icon: <SequenceIcon /> },
      { href: '/dashboard/forms', label: 'Forms', emoji: '📋', icon: <FormIcon /> },
      { href: '/dashboard/automation', label: 'Automations', emoji: '🤖', icon: <AutoIcon /> },
    ],
  },
  {
    title: 'OUTREACH',
    items: [
      { href: '/dashboard/cold-outreach', label: 'Cold Outreach', emoji: '🎯', icon: <OutreachIcon /> },
    ],
  },
  {
    title: 'TRACK',
    items: [
      { href: '/dashboard/analytics', label: 'Reports', emoji: '📊', icon: <ChartIcon /> },
      { href: '/dashboard/sources', label: 'Sources', emoji: '🌐', icon: <SourceIcon /> },
      { href: '/dashboard/activity', label: 'Activity Log', emoji: '📋', icon: <ActivityIcon /> },
    ],
  },
  {
    title: 'MANAGE',
    items: [
      { href: '/dashboard/domain-auth', label: 'Domain Auth', emoji: '🌐', icon: <DomainIcon /> },
      { href: '/dashboard/sender-ids', label: 'Sender IDs', emoji: '📧', icon: <SenderIcon /> },
      { href: '/dashboard/webhooks', label: 'Webhooks', emoji: '🔗', icon: <WebhookIcon /> },
      { href: '/dashboard/integrations', label: 'Integrations', emoji: '🔌', icon: <IntegrationIcon /> },
      { href: '/dashboard/billing', label: 'Billing', emoji: '💳', icon: <BillingIcon /> },
      { href: '/dashboard/team', label: 'Team', emoji: '👥', icon: <TeamIcon /> },
      { href: '/dashboard/settings', label: 'Settings', emoji: '⚙️', icon: <SettingsIcon /> },
    ],
  },
];

const allNavItems = navGroups.flatMap(g => g.items);

const bottomNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Home', emoji: '🏠', icon: <HomeIcon /> },
  { href: '/dashboard/contacts', label: 'Customers', emoji: '👥', icon: <UsersIcon /> },
  { href: '/dashboard/campaigns', label: 'Emails', emoji: '✉️', icon: <MailIcon /> },
  { href: '/dashboard/analytics', label: 'Reports', emoji: '📊', icon: <ChartIcon /> },
  { href: '/dashboard/settings', label: 'More', emoji: '⚙️', icon: <SettingsIcon /> },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout-v2', { method: 'POST' });
    } catch {}
    router.push('/login');
  };
  const isMobile = useIsMobile();

  const [templateCount, setTemplateCount] = useState(0);
  useEffect(() => {
    fetch('/api/templates?search=')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.count) setTemplateCount(data.count); })
      .catch(() => {});
  }, []);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FF' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{
          width: 240,
          background: '#fff',
          borderRight: '1px solid #E0F7FA',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
        }}>
          {/* Brand */}
          <div style={{ padding: '24px 20px 16px' }}>
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #00B4D8, #FF6B6B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 18,
              }}>B</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>Bestemail</div>
                <div style={{ fontSize: 11, color: '#8b8ba7', fontWeight: 500 }}>Email made simple</div>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
            {navGroups.map((group) => (
              <div key={group.title}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#8b8ba7',
                  letterSpacing: '0.08em',
                  padding: '14px 12px 6px',
                }}>
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '9px 12px',
                      borderRadius: 12,
                      background: active ? '#E0F7FA' : 'transparent',
                      color: active ? '#00B4D8' : '#64648b',
                      fontWeight: active ? 600 : 500,
                      fontSize: 14,
                      transition: 'all 0.2s ease',
                    }}>
                      <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.icon}
                      </span>
                      {item.label}
                      {item.href === '/dashboard/templates' && templateCount > 0 && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#8b8ba7',
                          background: '#E0F7FA',
                          padding: '2px 8px',
                          borderRadius: 10,
                        }}>
                          {templateCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Help card */}
          <div style={{
            margin: '12px',
            padding: '16px',
            background: 'linear-gradient(135deg, #E0F7FA, #FFF0F0)',
            borderRadius: 16,
            fontSize: 13,
            color: '#64648b',
          }}>
            <div style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Need help?</div>
            <div>We are here to help you grow your business with email.</div>
          </div>

          {/* Desktop logout */}
          <div style={{ padding: '0 12px 16px' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                background: '#FFF0F0',
                border: '1px solid #FFD5D5',
                borderRadius: 12,
                color: '#e53e3e',
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <LogoutIcon /> Logout
            </button>
          </div>
        </aside>
      )}

      {/* Mobile header */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: '#fff',
          borderBottom: '1px solid #E0F7FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 40,
        }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #00B4D8, #FF6B6B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
            }}>B</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>Bestemail</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/dashboard/settings" style={{
              color: '#64648b',
              padding: 8,
              minWidth: 44,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SettingsIcon />
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: '#FFF0F0',
                border: 'none',
                borderRadius: 10,
                color: '#e53e3e',
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <LogoutIcon /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 240,
        paddingBottom: isMobile ? 80 : 0,
        paddingTop: isMobile ? 56 : 0,
        minWidth: 0,
      }}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#fff',
          borderTop: '1px solid #E0F7FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 40,
          paddingTop: 6,
          paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        }}>
          {bottomNavItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                fontWeight: active ? 600 : 500,
                color: active ? '#00B4D8' : '#8b8ba7',
                padding: '4px 8px',
                minWidth: 56,
                minHeight: 44,
                justifyContent: 'center',
              }}>
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: active ? '#E0F7FA' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

// Simple SVG icons
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ABTestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <path d="M8 21H3v-5" />
      <line x1="3" y1="21" x2="10" y2="14" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function SegmentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}

function IntegrationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function SequenceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 014-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 01-4 4H3" />
    </svg>
  );
}

function OutreachIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function SourceIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function DomainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function SenderIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function WebhookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
