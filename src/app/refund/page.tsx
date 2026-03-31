'use client';

import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const sections = [
  {
    title: '1. Overview',
    content:
      'We want you to be completely satisfied with Bestemail. If you\'re not happy with your purchase, we offer a straightforward refund policy.',
  },
  {
    title: '2. 7-Day Money-Back Guarantee',
    list: [
      'New subscribers are eligible for a full refund within 7 days of their first payment',
      'This applies to first-time purchases only',
      'The refund covers the full subscription amount paid',
    ],
  },
  {
    title: '3. How to Request a Refund',
    list: [
      'Email billing@bestemail.in with your account email and reason for refund',
      'Include your registered email address and transaction ID',
      'Requests must be made within 7 days of the initial payment',
    ],
  },
  {
    title: '4. Refund Processing',
    list: [
      'Refunds are processed within 5-7 business days',
      'Amount will be credited to the original payment method',
      'You will receive a confirmation email once the refund is initiated',
      'Bank processing times may vary (additional 3-5 business days)',
    ],
  },
  {
    title: '5. What\'s Not Eligible for Refund',
    list: [
      'Subscriptions beyond the 7-day window',
      'Renewed subscriptions (monthly or annual renewals)',
      'Accounts that have violated our Terms of Service',
      'Partial month usage after the 7-day period',
      'Add-on purchases or extra email credits',
    ],
  },
  {
    title: '6. Pro-rated Refunds',
    content:
      'We do not offer pro-rated refunds for partial months of usage. This is standard practice for SaaS subscriptions. When you cancel, your access continues until the end of your current billing period.',
  },
  {
    title: '7. Annual Subscriptions',
    list: [
      'Annual subscribers can request a refund within 7 days of the annual payment',
      'After 7 days, no refunds are available for annual plans',
      'You may switch to monthly billing at renewal',
    ],
  },
  {
    title: '8. Contact Us',
    content: 'For refund requests or questions about billing:',
    list: [
      'Email: billing@bestemail.in',
      'Response time: Within 24 hours (Mon-Sat)',
      'Include: Account email, transaction ID, reason for request',
    ],
  },
];

export default function RefundPolicyPage() {
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
          Refund Policy
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
