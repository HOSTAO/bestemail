'use client';

import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const sections = [
  {
    title: '1. Easy Cancellation',
    content:
      'We believe in earning your business every month. You can cancel your Bestemail subscription at any time with no cancellation fees or penalties.',
  },
  {
    title: '2. How to Cancel',
    list: [
      'Log in to your Bestemail dashboard',
      'Go to Settings \u2192 Billing \u2192 Manage Subscription',
      'Click "Cancel Plan"',
      'Confirm your cancellation',
      'You\u2019ll receive a confirmation email',
    ],
  },
  {
    title: '3. What Happens After Cancellation',
    list: [
      'Your subscription remains active until the end of your current billing period',
      'You retain full access to all features until the period ends',
      'No further charges will be made to your payment method',
      'Automated sequences and campaigns will stop at the end of the billing period',
    ],
  },
  {
    title: '4. Data Retention',
    list: [
      'Your data (contacts, templates, campaign history) is retained for 30 days after your subscription ends',
      'During this 30-day window, you can reactivate your account and recover all data',
      'After 30 days, your data is permanently deleted from our servers',
      'You can request immediate data deletion by contacting support',
    ],
  },
  {
    title: '5. Exporting Your Data',
    content: 'Before cancelling, we recommend:',
    list: [
      'Export your contact lists (Dashboard \u2192 Contacts \u2192 Export)',
      'Download campaign reports (Dashboard \u2192 Analytics \u2192 Export)',
      'Save any custom templates',
    ],
  },
  {
    title: '6. Reactivation',
    list: [
      'You can reactivate your account within 30 days of cancellation',
      'All your data, templates, and settings will be restored',
      'Simply log in and choose a new plan',
      'After 30 days, you\u2019ll need to start fresh with a new account',
    ],
  },
  {
    title: '7. Annual Subscription Cancellation',
    list: [
      'Annual plans can be cancelled at any time',
      'Access continues until the end of the annual period',
      'No partial refunds for remaining months (see our Refund Policy)',
      'Auto-renewal is stopped immediately upon cancellation',
    ],
  },
  {
    title: '8. Downgrading Instead of Cancelling',
    content:
      'If cost is a concern, consider downgrading to a lower plan instead of cancelling:',
    list: [
      'Go to Settings \u2192 Billing \u2192 Change Plan',
      'Select a more affordable plan',
      'Changes take effect at your next billing cycle',
    ],
  },
  {
    title: '9. Contact Support',
    content: 'Need help with cancellation or have questions?',
    list: [
      'Email: support@bestemail.in',
      'Response time: Within 24 hours',
      'We\u2019re happy to help resolve any issues before you leave',
    ],
  },
];

export default function CancellationPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f1a', color: '#ffffff' }}>
      <Navigation />

      {/* Hero */}
      <section
        style={{
          padding: '100px 24px 48px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #00B4D8, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Cancellation Policy
        </h1>
        <p style={{ color: '#8b8ba7', fontSize: '1rem' }}>Last updated: March 2026</p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>
        {sections.map((section, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '28px 32px',
              marginBottom: '20px',
            }}
          >
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '14px',
                color: '#ffffff',
              }}
            >
              {section.title}
            </h2>

            {section.content && (
              <p
                style={{
                  color: '#8b8ba7',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  marginBottom: section.list ? '14px' : '0',
                }}
              >
                {section.content}
              </p>
            )}

            {section.list && (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {section.list.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      color: '#8b8ba7',
                      lineHeight: 1.8,
                      fontSize: '0.95rem',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <StandardFooter />
    </div>
  );
}
