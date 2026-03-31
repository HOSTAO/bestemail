'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function SecurityPage() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const securityFeatures = [
    {
      icon: '\u{1F510}',
      title: 'Encryption in Transit',
      points: [
        'All data transmitted over TLS 1.3',
        'HTTPS enforced on all endpoints',
        'Certificate pinning for API connections',
      ],
    },
    {
      icon: '\u{1F5C4}\uFE0F',
      title: 'Encryption at Rest',
      points: [
        'AES-256 encryption for stored data',
        'Database encryption via Supabase',
        'Encrypted backups',
      ],
    },
    {
      icon: '\u{1F4B3}',
      title: 'Payment Security',
      points: [
        'Payments processed by Razorpay (PCI DSS Level 1 compliant)',
        'We never store credit card numbers or CVV',
        'Tokenized payment methods for recurring billing',
        'UPI, cards, and net banking secured by Razorpay',
      ],
    },
    {
      icon: '\u2709\uFE0F',
      title: 'Email Security',
      points: [
        'DKIM signing for all outbound emails',
        'SPF records for sender verification',
        'DMARC policies to prevent email spoofing',
        'One-click Cloudflare DNS setup for domain authentication',
      ],
    },
    {
      icon: '\u{1F3D7}\uFE0F',
      title: 'Infrastructure',
      points: [
        'Hosted on Supabase (SOC 2 Type II compliant)',
        'Regular security patches and updates',
        'Automated backups with point-in-time recovery',
        'DDoS protection via Cloudflare',
      ],
    },
    {
      icon: '\u{1F511}',
      title: 'Access Control',
      points: [
        'Role-based access control (RBAC) for team accounts',
        'Two-factor authentication available',
        'Session management and auto-logout',
        'IP-based access restrictions (Enterprise plan)',
      ],
    },
  ];

  const dataProtectionPoints = [
    'Data minimization — we only collect what is necessary',
    'Purpose limitation — data is used only for stated purposes',
    'Strict access controls — limited to authorized personnel',
    'Regular audits — periodic reviews of data handling practices',
  ];

  const compliancePoints = [
    'Information Technology Act, 2000 compliance',
    'Personal Data Protection compliance',
    'Anti-spam law compliance (CAN-SPAM, GDPR awareness)',
    'Regular third-party security assessments',
  ];

  const stats = [
    { value: '0', label: 'Data Breaches' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Monitoring' },
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Navigation />

      {/* Hero */}
      <section style={{
        padding: isMobile ? '80px 20px 48px' : '120px 20px 80px',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{'\u{1F512}'}</div>
          <h1 style={{
            fontSize: isMobile ? 32 : 42,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Security at Bestemail
          </h1>
          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: '#8b8ba7',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Your data security is our top priority. Here&apos;s how we protect your information.
          </p>
        </div>
      </section>

      {/* Security Features Grid */}
      <section style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 24,
        }}>
          {securityFeatures.map((feature, i) => (
            <div key={i} style={{
              backgroundColor: '#1a1a2e',
              borderRadius: 12,
              padding: isMobile ? 24 : 32,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>{feature.icon}</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', margin: 0 }}>
                  {feature.title}
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {feature.points.map((point, j) => (
                  <li key={j} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    marginBottom: 10,
                    fontSize: 15,
                    color: '#8b8ba7',
                    lineHeight: 1.5,
                  }}>
                    <span style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }}>{'\u2713'}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Data Protection */}
      <section style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          backgroundColor: '#1a1a2e',
          borderRadius: 12,
          padding: isMobile ? 24 : 40,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <h2 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, marginBottom: 8, color: '#ffffff' }}>
            Data Protection
          </h2>
          <p style={{ fontSize: 16, color: '#8b8ba7', marginBottom: 24, lineHeight: 1.6 }}>
            We follow industry best practices for data protection.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {dataProtectionPoints.map((point, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 12,
                fontSize: 15,
                color: '#8b8ba7',
                lineHeight: 1.5,
              }}>
                <span style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }}>{'\u2713'}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Compliance */}
      <section style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          backgroundColor: '#1a1a2e',
          borderRadius: 12,
          padding: isMobile ? 24 : 40,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <h2 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, marginBottom: 8, color: '#ffffff' }}>
            Compliance
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0' }}>
            {compliancePoints.map((point, i) => (
              <li key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 12,
                fontSize: 15,
                color: '#8b8ba7',
                lineHeight: 1.5,
              }}>
                <span style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }}>{'\u2713'}</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          backgroundColor: '#1a1a2e',
          borderRadius: 12,
          padding: isMobile ? 24 : 40,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <h2 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 700, marginBottom: 8, color: '#ffffff' }}>
            Responsible Disclosure
          </h2>
          <p style={{ fontSize: 16, color: '#8b8ba7', marginBottom: 20, lineHeight: 1.6 }}>
            Found a vulnerability? We appreciate responsible disclosure.
          </p>
          <p style={{ fontSize: 15, color: '#8b8ba7', marginBottom: 12, lineHeight: 1.6 }}>
            Report to:{' '}
            <a href="mailto:security@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>
              security@bestemail.in
            </a>
          </p>
          <p style={{ fontSize: 15, color: '#8b8ba7', marginBottom: 12, lineHeight: 1.6 }}>
            We take all reports seriously and will respond within 48 hours.
          </p>
          <p style={{ fontSize: 15, color: '#8b8ba7', lineHeight: 1.6 }}>
            We will not take legal action against researchers who act in good faith.
          </p>
        </div>
      </section>

      {/* Security Stats */}
      <section style={{ padding: isMobile ? '40px 20px 60px' : '60px 20px 80px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 24,
          textAlign: 'center' as const,
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              backgroundColor: '#1a1a2e',
              borderRadius: 12,
              padding: isMobile ? 24 : 32,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                fontSize: isMobile ? 36 : 42,
                fontWeight: 700,
                color: '#00B4D8',
                marginBottom: 8,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 15, color: '#8b8ba7' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
