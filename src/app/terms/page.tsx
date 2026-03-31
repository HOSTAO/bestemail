'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function TermsPage() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Navigation />

      {/* Hero */}
      <section style={{
        backgroundColor: '#0f0f1a',
        padding: isMobile ? '80px 0 40px' : '120px 0 60px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{
            fontSize: isMobile ? 36 : 52,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}>Terms of Service</h1>
          <p style={{ fontSize: 16, color: '#8b8ba7', margin: 0 }}>
            Last updated: March 2026 &nbsp;|&nbsp; Effective date: March 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: isMobile ? '48px 0' : '80px 0', flex: 1 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>

          {/* 1. Acceptance of Terms */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>1. Acceptance of Terms</h2>
            <p style={bodyText}>
              By accessing or using Bestemail (bestemail.in), you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
            </p>
          </div>

          {/* 2. Service Description */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>2. Service Description</h2>
            <p style={bodyText}>
              Bestemail is a cloud-based email marketing platform that enables businesses to create, send, and manage email campaigns, automation sequences, and subscriber management. Our services include email campaign creation, template library, contact management, analytics, and integrations.
            </p>
          </div>

          {/* 3. Account Registration */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>3. Account Registration</h2>
            <ul style={listStyle}>
              <li style={listItem}>You must provide accurate, complete information</li>
              <li style={listItem}>You are responsible for maintaining account security</li>
              <li style={listItem}>One account per individual/organization</li>
              <li style={listItem}>You must be at least 18 years old</li>
              <li style={listItem}>You are responsible for all activity under your account</li>
            </ul>
          </div>

          {/* 4. Acceptable Use */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>4. Acceptable Use</h2>
            <p style={bodyText}>You agree NOT to:</p>
            <ul style={listStyle}>
              <li style={listItem}>Send unsolicited emails (spam)</li>
              <li style={listItem}>Violate CAN-SPAM Act, GDPR, or any anti-spam laws</li>
              <li style={listItem}>Upload purchased or scraped email lists</li>
              <li style={listItem}>Send content that is illegal, harmful, or offensive</li>
              <li style={listItem}>Impersonate others or misrepresent your identity</li>
              <li style={listItem}>Attempt to access other users&apos; accounts</li>
              <li style={listItem}>Use the service for phishing or fraud</li>
              <li style={listItem}>Exceed your plan&apos;s subscriber or email limits</li>
              <li style={listItem}>Resell or redistribute the service without permission</li>
            </ul>
          </div>

          {/* 5. Payment Terms */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>5. Payment Terms</h2>
            <ul style={listStyle}>
              <li style={listItem}>Subscription plans are billed monthly or annually as selected</li>
              <li style={listItem}>All prices are in Indian Rupees (INR) and subject to 18% GST</li>
              <li style={listItem}>Payments processed securely via Razorpay</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Auto-renewal:</strong> subscriptions auto-renew unless cancelled</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Failed payments:</strong> we will retry and notify you; service may be suspended after 7 days</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Price changes:</strong> 30 days notice before any price increase</li>
            </ul>
          </div>

          {/* 6. Refund and Cancellation */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>6. Refund and Cancellation</h2>
            <ul style={listStyle}>
              <li style={listItem}>7-day money-back guarantee for first-time subscribers</li>
              <li style={listItem}>Cancel anytime from your dashboard</li>
              <li style={listItem}>Access continues until end of billing period</li>
              <li style={listItem}>
                See our{' '}
                <a href="/refund" style={{ color: '#00B4D8', textDecoration: 'none' }}>Refund Policy</a>{' '}
                and{' '}
                <a href="/cancellation" style={{ color: '#00B4D8', textDecoration: 'none' }}>Cancellation Policy</a>{' '}
                for full details
              </li>
            </ul>
          </div>

          {/* 7. Intellectual Property */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>7. Intellectual Property</h2>
            <ul style={listStyle}>
              <li style={listItem}>Bestemail and its original content, features, and functionality are owned by Bestemail Technologies</li>
              <li style={listItem}>Our templates are licensed for use within the platform only</li>
              <li style={listItem}>Your content (email copy, contact lists, designs) remains your property</li>
              <li style={listItem}>You grant us a limited license to process and deliver your content as part of the service</li>
            </ul>
          </div>

          {/* 8. Service Availability */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>8. Service Availability</h2>
            <ul style={listStyle}>
              <li style={listItem}>We strive for 99.9% uptime</li>
              <li style={listItem}>Scheduled maintenance will be communicated in advance</li>
              <li style={listItem}>We are not liable for downtime due to factors beyond our control</li>
              <li style={listItem}>We may modify or discontinue features with reasonable notice</li>
            </ul>
          </div>

          {/* 9. Limitation of Liability */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>9. Limitation of Liability</h2>
            <ul style={listStyle}>
              <li style={listItem}>Our total liability shall not exceed the amount you paid in the 12 months prior to the claim</li>
              <li style={listItem}>We are not liable for indirect, incidental, or consequential damages</li>
              <li style={listItem}>We are not liable for email delivery failures due to recipient server policies</li>
              <li style={listItem}>We are not responsible for the content of emails you send through our platform</li>
            </ul>
          </div>

          {/* 10. Indemnification */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>10. Indemnification</h2>
            <p style={bodyText}>
              You agree to indemnify and hold Bestemail harmless from any claims, damages, or expenses arising from your use of the service, your content, or your violation of these terms.
            </p>
          </div>

          {/* 11. Termination */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>11. Termination</h2>
            <ul style={listStyle}>
              <li style={listItem}>We may suspend or terminate your account for Terms violations</li>
              <li style={listItem}>Upon termination, your right to use the service ceases immediately</li>
              <li style={listItem}>Data retention follows our Privacy Policy and Cancellation Policy</li>
              <li style={listItem}>Sections that should survive termination will survive</li>
            </ul>
          </div>

          {/* 12. Governing Law */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>12. Governing Law</h2>
            <p style={bodyText}>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.
            </p>
          </div>

          {/* 13. Dispute Resolution */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>13. Dispute Resolution</h2>
            <ul style={listStyle}>
              <li style={listItem}>First, contact us at <a href="mailto:legal@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>legal@bestemail.in</a> to resolve disputes amicably</li>
              <li style={listItem}>If unresolved within 30 days, disputes may be referred to arbitration under the Arbitration and Conciliation Act, 1996</li>
              <li style={listItem}>Arbitration shall be conducted in English in India</li>
            </ul>
          </div>

          {/* 14. Changes to Terms */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>14. Changes to Terms</h2>
            <p style={bodyText}>
              We reserve the right to modify these terms. Material changes will be notified 30 days in advance via email. Continued use constitutes acceptance.
            </p>
          </div>

          {/* 15. Severability */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>15. Severability</h2>
            <p style={bodyText}>
              If any provision of these Terms is found invalid, the remaining provisions continue in full force.
            </p>
          </div>

          {/* 16. Contact */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>16. Contact</h2>
            <ul style={listStyle}>
              <li style={listItem}>Legal inquiries: <a href="mailto:legal@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>legal@bestemail.in</a></li>
              <li style={listItem}>General support: <a href="mailto:support@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>support@bestemail.in</a></li>
              <li style={listItem}>Address: Bestemail Technologies, India</li>
            </ul>
          </div>

        </div>
      </section>

      <StandardFooter />
    </div>
  );
}

/* ---------- shared inline style helpers ---------- */

const sectionHeading = (isMobile: boolean): React.CSSProperties => ({
  fontSize: isMobile ? 22 : 26,
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: 20,
  paddingBottom: 12,
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  marginTop: 0,
});

const bodyText: React.CSSProperties = {
  fontSize: 16,
  color: '#8b8ba7',
  lineHeight: 1.8,
  margin: 0,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '12px 0 0 0',
};

const listItem: React.CSSProperties = {
  fontSize: 16,
  color: '#8b8ba7',
  lineHeight: 1.8,
  paddingLeft: 20,
  position: 'relative',
  marginBottom: 6,
};
