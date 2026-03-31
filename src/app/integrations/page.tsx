'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const integrations = [
  {
    emoji: '\u2601\uFE0F',
    name: 'Cloudflare',
    status: 'Available' as const,
    description: 'One-click DNS setup for domain authentication. Improve email deliverability with automated DKIM, SPF, and DMARC configuration.',
  },
  {
    emoji: '\u{1F4B3}',
    name: 'Razorpay',
    status: 'Available' as const,
    description: 'Secure payment processing for subscriptions. Accept UPI, cards, net banking, and wallets.',
  },
  {
    emoji: '\u{1F4AC}',
    name: 'WhatsApp Business',
    status: 'Coming Soon' as const,
    description: 'Send WhatsApp notifications alongside email campaigns. Reach customers on their preferred channel.',
  },
  {
    emoji: '\u26A1',
    name: 'Zapier',
    status: 'Coming Soon' as const,
    description: 'Connect Bestemail with 5,000+ apps. Automate workflows across your entire tech stack.',
  },
  {
    emoji: '\u{1F6D2}',
    name: 'Shopify',
    status: 'Coming Soon' as const,
    description: 'Sync your Shopify customers and trigger emails based on purchase behavior.',
  },
  {
    emoji: '\u{1F6CD}\uFE0F',
    name: 'WooCommerce',
    status: 'Coming Soon' as const,
    description: 'Connect your WooCommerce store for automated order confirmations and marketing emails.',
  },
  {
    emoji: '\u{1F50C}',
    name: 'REST API',
    status: 'Available' as const,
    description: 'Full API access for custom integrations. Manage contacts, campaigns, and analytics programmatically.',
  },
  {
    emoji: '\u{1FA9D}',
    name: 'Webhooks',
    status: 'Available' as const,
    description: 'Real-time event notifications for opens, clicks, bounces, and more. Build custom workflows.',
  },
];

export default function IntegrationsPage() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
      <Navigation />

      {/* Hero */}
      <section style={{
        padding: isMobile ? '80px 0 50px' : '120px 0 80px',
        textAlign: 'center',
        background: '#0f0f1a',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{
            margin: '0 0 20px',
            fontSize: isMobile ? '32px' : '42px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
          }}>
            Integrations
          </h1>
          <p style={{
            margin: '0 auto',
            maxWidth: 640,
            fontSize: isMobile ? '16px' : '18px',
            color: '#8b8ba7',
            lineHeight: 1.7,
          }}>
            Connect Bestemail with the tools you already use
          </p>
        </div>
      </section>

      {/* Integration Grid */}
      <section style={{
        padding: isMobile ? '0 0 60px' : '0 0 80px',
        background: '#0f0f1a',
        flexGrow: 1,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: 24,
          }}>
            {integrations.map((item) => {
              const isAvailable = item.status === 'Available';
              return (
                <div
                  key={item.name}
                  style={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Top row: emoji + status */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16,
                  }}>
                    <span style={{ fontSize: '32px' }}>{item.emoji}</span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: '12px',
                      fontWeight: 600,
                      background: isAvailable ? '#10b981' : '#f59e0b',
                      color: isAvailable ? '#052e16' : '#451a03',
                    }}>
                      {item.status}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 style={{
                    margin: '0 0 10px',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}>
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    margin: '0 0 20px',
                    fontSize: '14px',
                    color: '#8b8ba7',
                    lineHeight: 1.7,
                    flexGrow: 1,
                  }}>
                    {item.description}
                  </p>

                  {/* Link */}
                  <a href="#" style={{
                    color: '#00B4D8',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}>
                    Learn more {'\u2192'}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section style={{
        padding: isMobile ? '60px 0' : '80px 0',
        background: '#1a1a2e',
      }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center',
        }}>
          <h2 style={{
            margin: '0 0 16px',
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: 700,
            color: '#ffffff',
          }}>
            Build Custom Integrations
          </h2>
          <p style={{
            margin: '0 auto 32px',
            maxWidth: 600,
            fontSize: '16px',
            color: '#8b8ba7',
            lineHeight: 1.7,
          }}>
            Our REST API gives you full control over your Bestemail account. Manage contacts, send campaigns, and access analytics programmatically.
          </p>
          <a href="/docs" style={{
            color: '#00B4D8',
            fontSize: '16px',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            View API Documentation {'\u2192'}
          </a>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: isMobile ? '60px 0' : '80px 0',
        background: '#0f0f1a',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
          }}>
            Need an integration we don't have?
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#8b8ba7',
            marginBottom: 32,
            maxWidth: 500,
            margin: '0 auto 32px',
          }}>
            Let us know what tools you use and we will prioritize building the integrations you need.
          </p>
          <a href="/contact" style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: '#00B4D8',
            color: '#ffffff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
          }}>
            Request Integration
          </a>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
