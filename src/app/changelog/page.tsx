import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export const metadata: Metadata = {
  title: 'Changelog | BestEmail — Email Marketing India',
  description: 'What\'s new in BestEmail — feature updates, improvements, and bug fixes for India\'s email marketing platform.',
};

const CHANGELOG = [
  {
    version: 'v1.3.0',
    date: 'March 2026',
    badge: 'New',
    badgeColor: '#4F46E5',
    entries: [
      { type: '✨ Feature', text: 'Cold Outreach module — send personalised outreach sequences to prospects' },
      { type: '✨ Feature', text: 'SMS campaigns — send transactional and promotional SMS alongside email' },
      { type: '✨ Feature', text: 'Cloudflare one-click DNS setup for domain authentication' },
      { type: '✨ Feature', text: 'Embed forms on your website with a single JavaScript snippet' },
      { type: '⚡ Improvement', text: 'Campaign analytics dashboard — real-time open/click tracking' },
      { type: '⚡ Improvement', text: 'Contact segmentation with dynamic rules and tags' },
      { type: '🐛 Fix', text: 'Resolved timezone display issues in campaign scheduler' },
    ],
  },
  {
    version: 'v1.2.0',
    date: 'February 2026',
    badge: 'Released',
    badgeColor: '#10B981',
    entries: [
      { type: '✨ Feature', text: 'Email Automation Sequences — drip campaigns with visual workflow builder' },
      { type: '✨ Feature', text: 'A/B testing for subject lines and email content' },
      { type: '✨ Feature', text: '330+ email templates including Indian festival themes (Diwali, Holi, Eid, Onam)' },
      { type: '⚡ Improvement', text: 'Bulk contact import from CSV with deduplication' },
      { type: '⚡ Improvement', text: 'White-label mode for agencies' },
      { type: '🐛 Fix', text: 'Fixed DKIM signature validation for custom domains' },
      { type: '🐛 Fix', text: 'Resolved contact list pagination issues on large datasets' },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'January 2026',
    badge: 'Released',
    badgeColor: '#10B981',
    entries: [
      { type: '✨ Feature', text: 'Campaign builder with drag-and-drop email editor' },
      { type: '✨ Feature', text: 'Subscriber management — import, tag, and segment contacts' },
      { type: '✨ Feature', text: 'Open and click tracking with pixel and link wrapping' },
      { type: '✨ Feature', text: 'Sender ID management and domain authentication (DKIM/SPF/DMARC)' },
      { type: '⚡ Improvement', text: 'Optimised email delivery for Indian ISPs (Airtel, Jio, BSNL)' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'December 2025',
    badge: 'Launch',
    badgeColor: '#F59E0B',
    entries: [
      { type: '🚀 Launch', text: 'BestEmail public launch — India\'s email marketing platform built for INR pricing' },
      { type: '✨ Feature', text: 'Core email campaign platform' },
      { type: '✨ Feature', text: 'Contact management and list building' },
      { type: '✨ Feature', text: 'Basic analytics and reporting' },
      { type: '✨ Feature', text: 'INR pricing — Starter ₹999/mo, Growth ₹2,499/mo, Enterprise ₹4,999/mo' },
    ],
  },
];

const UPCOMING = [
  'AI-powered subject line recommendations',
  'Advanced deliverability scoring and inbox placement testing',
  'Shopify and WooCommerce direct integrations',
  'WhatsApp + Email unified campaign builder',
  'Advanced segmentation with RFM scoring',
  'DPDPA 2023 compliance toolkit for Indian businesses',
];

export default function ChangelogPage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0B0F14',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      color: '#F9FAFB',
    }}>
      <Navigation />

      <main style={{ flex: 1, maxWidth: 860, margin: '0 auto', padding: '80px 24px 60px', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 12, color: '#ffffff' }}>Changelog</h1>
          <p style={{ color: '#9CA3AF', fontSize: 16, maxWidth: 500 }}>
            New features, improvements, and bug fixes — shipped by the BestEmail team for India&apos;s growing businesses.
          </p>
        </div>

        {/* Upcoming */}
        <div style={{
          background: '#111827',
          border: '1px solid rgba(79,70,229,0.4)',
          borderRadius: 16,
          padding: '28px 32px',
          marginBottom: 60,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>🔭</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0 }}>Coming Soon</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {UPCOMING.map((item, i) => (
              <div key={i} style={{
                background: '#0B0F14',
                border: '1px solid #1F2937',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 14,
                color: '#D1D5DB',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
              }}>
                <span style={{ color: '#4F46E5', marginTop: 2 }}>◦</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 20,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(to bottom, #4F46E5, rgba(79,70,229,0.1))',
          }} />

          <div style={{ paddingLeft: 56 }}>
            {CHANGELOG.map((release) => (
              <div key={release.version} style={{ marginBottom: 56, position: 'relative' }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: -46,
                  top: 4,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: release.badgeColor,
                  border: '3px solid #0B0F14',
                  boxShadow: `0 0 0 3px ${release.badgeColor}33`,
                }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: 0 }}>{release.version}</h2>
                  <span style={{
                    background: release.badgeColor + '22',
                    color: release.badgeColor,
                    border: `1px solid ${release.badgeColor}44`,
                    borderRadius: 6,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                  }}>{release.badge}</span>
                  <span style={{ color: '#6B7280', fontSize: 14 }}>{release.date}</span>
                </div>

                {/* Entries */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {release.entries.map((entry, i) => (
                    <div key={i} style={{
                      background: '#111827',
                      border: '1px solid #1F2937',
                      borderRadius: 10,
                      padding: '12px 18px',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                    }}>
                      <span style={{ fontSize: 13, color: '#9CA3AF', minWidth: 100, flexShrink: 0 }}>{entry.type}</span>
                      <span style={{ fontSize: 14, color: '#D1D5DB', lineHeight: 1.6 }}>{entry.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe */}
        <div style={{
          background: '#111827',
          border: '1px solid #1F2937',
          borderRadius: 16,
          padding: '32px',
          textAlign: 'center',
          marginTop: 40,
        }}>
          <h3 style={{ color: '#ffffff', fontSize: 20, marginBottom: 8 }}>Stay updated</h3>
          <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>Get notified when we ship new features. No spam.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                background: '#0B0F14',
                border: '1px solid #374151',
                borderRadius: 8,
                padding: '10px 16px',
                color: '#ffffff',
                fontSize: 14,
                outline: 'none',
                width: 240,
              }}
            />
            <button style={{
              background: '#4F46E5',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              Subscribe
            </button>
          </div>
        </div>

      </main>

      <StandardFooter />
    </div>
  );
}
