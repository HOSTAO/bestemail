'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function PrivacyPolicyPage() {
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
          }}>Privacy Policy</h1>
          <p style={{ fontSize: 16, color: '#8b8ba7', margin: 0 }}>
            Last updated: March 2026 &nbsp;|&nbsp; Effective date: March 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: isMobile ? '48px 0' : '80px 0', flex: 1 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>

          {/* 1. Introduction */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>1. Introduction</h2>
            <p style={bodyText}>
              Bestemail (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This policy explains how we collect, use, store, and protect your personal information when you use our email marketing platform at bestemail.in.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>2. Information We Collect</h2>
            <ul style={listStyle}>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Account info:</strong> name, email, phone number, company name</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Payment info:</strong> billing address, GST number (processed securely via Razorpay — we never store card details)</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Usage data:</strong> login times, features used, campaign performance metrics</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Contact data:</strong> email lists and subscriber information you upload</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Technical data:</strong> IP address, browser type, device info, cookies</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Communication data:</strong> support tickets, emails to our team</li>
            </ul>
          </div>

          {/* 3. How We Use Your Information */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>3. How We Use Your Information</h2>
            <ul style={listStyle}>
              <li style={listItem}>Provide and maintain our email marketing services</li>
              <li style={listItem}>Process payments and manage subscriptions</li>
              <li style={listItem}>Send service-related communications (billing, updates, security alerts)</li>
              <li style={listItem}>Improve our platform and develop new features</li>
              <li style={listItem}>Provide customer support</li>
              <li style={listItem}>Comply with legal obligations</li>
              <li style={listItem}>Prevent fraud and abuse</li>
            </ul>
          </div>

          {/* 4. Data Storage and Security */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>4. Data Storage and Security</h2>
            <ul style={listStyle}>
              <li style={listItem}>Data is stored on Supabase infrastructure (SOC 2 Type II compliant)</li>
              <li style={listItem}>Servers located in secure data centers</li>
              <li style={listItem}>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li style={listItem}>Regular security audits and vulnerability assessments</li>
              <li style={listItem}>Access controls and authentication for all internal systems</li>
            </ul>
          </div>

          {/* 5. Payment Information */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>5. Payment Information</h2>
            <ul style={listStyle}>
              <li style={listItem}>All payments processed through Razorpay (PCI DSS Level 1 compliant)</li>
              <li style={listItem}>We do NOT store credit card numbers, CVV, or full card details</li>
              <li style={listItem}>Razorpay handles all sensitive payment data securely</li>
              <li style={listItem}>Transaction records retained for accounting and tax purposes</li>
            </ul>
          </div>

          {/* 6. Cookies and Tracking */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>6. Cookies and Tracking</h2>
            <ul style={listStyle}>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Essential cookies:</strong> session management, authentication</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Analytics cookies:</strong> understand usage patterns (can be disabled)</li>
              <li style={listItem}>We do not sell your data to advertisers</li>
              <li style={listItem}>No third-party advertising trackers on our platform</li>
            </ul>
          </div>

          {/* 7. Third-Party Services */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>7. Third-Party Services</h2>
            <p style={bodyText}>We share limited data with the following providers:</p>
            <ul style={listStyle}>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Razorpay:</strong> payment processing</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Supabase:</strong> data storage and authentication</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Cloudflare:</strong> DNS management and security</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Email delivery infrastructure (Sendy):</strong> for sending your campaigns</li>
            </ul>
            <p style={{ ...bodyText, marginTop: 16 }}>
              We require all third-party providers to maintain appropriate security measures.
            </p>
          </div>

          {/* 8. Your Rights */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>8. Your Rights</h2>
            <p style={bodyText}>You have the right to:</p>
            <ul style={listStyle}>
              <li style={listItem}>Access your personal data</li>
              <li style={listItem}>Correct inaccurate data</li>
              <li style={listItem}>Delete your account and data</li>
              <li style={listItem}>Export your data in standard formats</li>
              <li style={listItem}>Opt out of marketing communications</li>
              <li style={listItem}>Withdraw consent at any time</li>
            </ul>
            <p style={{ ...bodyText, marginTop: 16 }}>
              To exercise these rights, email{' '}
              <a href="mailto:privacy@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>privacy@bestemail.in</a>
            </p>
          </div>

          {/* 9. Data Retention */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>9. Data Retention</h2>
            <ul style={listStyle}>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Account data:</strong> retained while your account is active</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>After cancellation:</strong> data retained for 30 days, then permanently deleted</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Payment records:</strong> retained for 7 years (Indian tax/accounting requirements)</li>
              <li style={listItem}><strong style={{ color: '#ffffff' }}>Backup data:</strong> purged within 90 days of deletion</li>
            </ul>
          </div>

          {/* 10. Children's Privacy */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>10. Children&apos;s Privacy</h2>
            <p style={bodyText}>
              Our services are not directed to individuals under 18. We do not knowingly collect data from minors.
            </p>
          </div>

          {/* 11. International Data Transfers */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>11. International Data Transfers</h2>
            <p style={bodyText}>
              If you access our services from outside India, your data may be transferred to and processed in India. By using our services, you consent to this transfer.
            </p>
          </div>

          {/* 12. Changes to This Policy */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>12. Changes to This Policy</h2>
            <p style={bodyText}>
              We may update this policy from time to time. We will notify registered users of significant changes via email. Continued use of our services after changes constitutes acceptance.
            </p>
          </div>

          {/* 13. Contact Us */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>13. Contact Us</h2>
            <p style={bodyText}>For privacy-related questions or concerns:</p>
            <ul style={listStyle}>
              <li style={listItem}>Privacy Officer: <a href="mailto:privacy@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>privacy@bestemail.in</a></li>
              <li style={listItem}>General support: <a href="mailto:support@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>support@bestemail.in</a></li>
              <li style={listItem}>Address: Bestemail Technologies, India</li>
            </ul>
          </div>

          {/* 14. Grievance Officer */}
          <div style={{ marginBottom: 56 }}>
            <h2 style={sectionHeading(isMobile)}>14. Grievance Officer</h2>
            <p style={bodyText}>
              In accordance with the Information Technology Act, 2000 and rules made thereunder, the Grievance Officer for the purpose of this policy is reachable at:{' '}
              <a href="mailto:grievance@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>grievance@bestemail.in</a>
            </p>
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
  // bullet via ::before not available inline, use text
};
