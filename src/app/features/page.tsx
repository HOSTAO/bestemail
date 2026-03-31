'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const featureSections = [
  {
    id: 'campaigns',
    emoji: '\u{1F4E7}',
    title: 'Email Campaigns',
    subtitle: 'Create stunning emails in minutes',
    description: 'Design and send beautiful email campaigns with our intuitive editor. Choose from hundreds of templates or build your own from scratch.',
    items: [
      'Drag-and-drop email editor',
      '330+ professionally designed templates',
      'Festival and seasonal templates for Indian market',
      'Schedule campaigns for optimal delivery',
      'A/B test subject lines and content',
      'Rich text and HTML editing',
    ],
  },
  {
    id: 'automation',
    emoji: '\u{1F504}',
    title: 'Automation Sequences',
    subtitle: 'Put your email marketing on autopilot',
    description: 'Build powerful automated workflows that nurture leads and engage subscribers without manual effort.',
    items: [
      'Drip campaign sequences',
      'Trigger-based automation (signup, tag, date)',
      'Conditional logic and branching',
      'Welcome series, onboarding flows',
      'Re-engagement campaigns',
      'Time-delay controls',
    ],
  },
  {
    id: 'analytics',
    emoji: '\u{1F4CA}',
    title: 'Advanced Analytics',
    subtitle: 'Data-driven decisions for better results',
    description: 'Get deep insights into your campaign performance with comprehensive analytics and reporting tools.',
    items: [
      'Real-time open and click tracking',
      'Bounce and unsubscribe monitoring',
      'Campaign comparison reports',
      'Subscriber engagement scoring',
      'Geographic and device analytics',
      'Export reports as CSV',
    ],
  },
  {
    id: 'contacts',
    emoji: '\u{1F3AF}',
    title: 'Contact Management',
    subtitle: 'Organize and segment your audience',
    description: 'Keep your subscriber list clean and organized with powerful management and segmentation tools.',
    items: [
      'Import contacts via CSV',
      'Tags and custom fields',
      'Smart segmentation and filtering',
      'Automatic deduplication',
      'Subscriber profiles and history',
      'Bulk actions and management',
    ],
  },
  {
    id: 'forms',
    emoji: '\u{1F4DD}',
    title: 'Forms & Lead Capture',
    subtitle: 'Grow your email list effortlessly',
    description: 'Create and embed signup forms on any website to capture leads and grow your subscriber base.',
    items: [
      'Embeddable signup forms',
      'Customizable form designs',
      'Multi-website support',
      'Form analytics and conversion tracking',
      'Auto-tag new subscribers',
      'GDPR-compliant consent collection',
    ],
  },
  {
    id: 'integrations',
    emoji: '\u{1F517}',
    title: 'Integrations',
    subtitle: 'Connect with your favorite tools',
    description: 'Seamlessly connect Bestemail with the tools and services you already use to streamline your workflow.',
    items: [
      'Cloudflare DNS one-click setup',
      'Webhook support',
      'REST API access',
      'Razorpay payment integration',
      'Zapier support (coming soon)',
      'Custom integration options',
    ],
  },
];

export default function FeaturesPage() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

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
            Powerful Features for Every Email Marketer
          </h1>
          <p style={{
            margin: '0 auto',
            maxWidth: 640,
            fontSize: isMobile ? '16px' : '18px',
            color: '#8b8ba7',
            lineHeight: 1.7,
          }}>
            Everything you need to create, send, and optimize email campaigns that convert.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      {featureSections.map((section, idx) => {
        const isEven = idx % 2 === 0;
        const bgColor = isEven ? '#0f0f1a' : '#1a1a2e';

        return (
          <section
            key={section.id}
            id={section.id}
            style={{
              padding: isMobile ? '60px 0' : '80px 0',
              background: bgColor,
            }}
          >
            <div style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: '0 20px',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              gap: isMobile ? '40px' : '60px',
            }}>
              {/* Text Side */}
              <div style={{
                flex: 1,
                order: isMobile ? 1 : (isEven ? 1 : 2),
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(0, 180, 216, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: 20,
                }}>
                  {section.emoji}
                </div>
                <h2 style={{
                  margin: '0 0 8px',
                  fontSize: isMobile ? '24px' : '28px',
                  fontWeight: 700,
                  color: '#ffffff',
                }}>
                  {section.title}
                </h2>
                <p style={{
                  margin: '0 0 16px',
                  fontSize: '16px',
                  color: '#00B4D8',
                  fontWeight: 600,
                }}>
                  {section.subtitle}
                </p>
                <p style={{
                  margin: '0 0 28px',
                  fontSize: '15px',
                  color: '#8b8ba7',
                  lineHeight: 1.7,
                }}>
                  {section.description}
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {section.items.map((item) => (
                    <li key={item} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      fontSize: '15px',
                      color: '#ffffff',
                      lineHeight: 1.5,
                    }}>
                      <span style={{ color: '#10b981', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{'\u2713'}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Placeholder */}
              <div style={{
                flex: 1,
                order: isMobile ? 2 : (isEven ? 2 : 1),
              }}>
                <div style={{
                  width: '100%',
                  minHeight: 300,
                  borderRadius: 16,
                  background: '#1a1a2e',
                  border: '1px solid rgba(0, 180, 216, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8b8ba7',
                  fontSize: '16px',
                  fontWeight: 500,
                }}>
                  Screenshot
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section style={{
        padding: isMobile ? '60px 0' : '80px 0',
        background: '#0f0f1a',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
          }}>
            Ready to get started?
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#8b8ba7',
            marginBottom: 32,
            maxWidth: 500,
            margin: '0 auto 32px',
          }}>
            Start your free trial today. No credit card required.
          </p>
          <a href="/signup" style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: '#00B4D8',
            color: '#ffffff',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '16px',
            transition: 'background 0.2s',
          }}>
            Start Free Trial
          </a>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
