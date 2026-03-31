import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export const metadata: Metadata = {
  title: 'Cookie Policy | BestEmail — Email Marketing India',
  description: 'Learn how BestEmail uses cookies and similar tracking technologies on our platform.',
};

export default function CookiePolicyPage() {
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
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8, color: '#ffffff' }}>Cookie Policy</h1>
        <p style={{ color: '#9CA3AF', marginBottom: 40, fontSize: 14 }}>Last updated: March 2026 — Hostao LLC</p>

        <div style={{ lineHeight: 1.8, color: '#D1D5DB' }}>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>1. What Are Cookies?</h2>
          <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, improve user experience, and provide information to site owners. BestEmail (operated by Hostao LLC) uses cookies and similar technologies on <strong>bestemail.in</strong>.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>2. Types of Cookies We Use</h2>

          <h3 style={{ color: '#E5E7EB', fontSize: 17, marginTop: 24, marginBottom: 8 }}>Strictly Necessary Cookies</h3>
          <p>These cookies are essential for the platform to function. They enable core features like authentication, session management, and security. You cannot opt out of these cookies as the service cannot be provided without them.</p>
          <ul>
            <li><strong>bestemail_session</strong> — Keeps you logged in during your session</li>
            <li><strong>csrf_token</strong> — Protects against cross-site request forgery attacks</li>
            <li><strong>auth_token</strong> — Stores your authentication state</li>
          </ul>

          <h3 style={{ color: '#E5E7EB', fontSize: 17, marginTop: 24, marginBottom: 8 }}>Functional Cookies</h3>
          <p>These cookies remember your preferences to enhance your experience on the platform.</p>
          <ul>
            <li><strong>theme_preference</strong> — Remembers your theme settings</li>
            <li><strong>dashboard_layout</strong> — Stores your dashboard layout preferences</li>
            <li><strong>language_preference</strong> — Stores language and locale settings</li>
          </ul>

          <h3 style={{ color: '#E5E7EB', fontSize: 17, marginTop: 24, marginBottom: 8 }}>Analytics Cookies</h3>
          <p>We use analytics cookies to understand how visitors interact with our website. This helps us improve our service.</p>
          <ul>
            <li><strong>_ga, _gid</strong> — Google Analytics (anonymised IP)</li>
            <li><strong>plausible</strong> — Privacy-friendly analytics (no personal data stored)</li>
          </ul>

          <h3 style={{ color: '#E5E7EB', fontSize: 17, marginTop: 24, marginBottom: 8 }}>Marketing Cookies</h3>
          <p>These cookies may be set by our advertising partners to build a profile of your interests. We do not sell your data. You can opt out via your cookie preferences at any time.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>3. How We Use Cookies</h2>
          <ul>
            <li>To keep you signed in to your BestEmail account</li>
            <li>To remember your platform preferences and settings</li>
            <li>To understand how you use our platform and improve it</li>
            <li>To measure the effectiveness of our marketing campaigns</li>
            <li>To prevent fraud and maintain platform security</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>4. Third-Party Cookies</h2>
          <p>We may allow selected third parties to set cookies on our site. These third parties include:</p>
          <ul>
            <li><strong>Google Analytics</strong> — Website analytics (privacy.google.com)</li>
            <li><strong>Cloudflare</strong> — Security and performance (cloudflare.com/privacypolicy)</li>
            <li><strong>Stripe / Razorpay</strong> — Payment processing (where applicable)</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>5. Your Cookie Choices</h2>
          <p>You have the following options to control cookies:</p>
          <ul>
            <li><strong>Cookie Banner:</strong> When you first visit BestEmail, you can accept or reject non-essential cookies via our consent banner.</li>
            <li><strong>Browser Settings:</strong> You can configure your browser to block or delete cookies. Note that blocking cookies may affect platform functionality.</li>
            <li><strong>Opt-Out Links:</strong> For Google Analytics, visit <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#818CF8' }}>tools.google.com/dlpage/gaoptout</a>.</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>6. Cookie Retention</h2>
          <p>Session cookies expire when you close your browser. Persistent cookies remain on your device for a set period (typically 30 days to 2 years depending on the cookie) or until you delete them.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>7. Compliance</h2>
          <p>Our cookie practices comply with:</p>
          <ul>
            <li>EU ePrivacy Directive and GDPR (General Data Protection Regulation)</li>
            <li>UK GDPR</li>
            <li>India Digital Personal Data Protection Act 2023 (DPDPA)</li>
            <li>California Consumer Privacy Act (CCPA)</li>
          </ul>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>8. Changes to This Policy</h2>
          <p>We may update this Cookie Policy from time to time. When we do, we will revise the &quot;Last updated&quot; date at the top of this page. Continued use of BestEmail after any changes constitutes acceptance of the updated policy.</p>

          <h2 style={{ color: '#ffffff', fontSize: 22, marginTop: 40, marginBottom: 12 }}>9. Contact Us</h2>
          <p>If you have questions about our use of cookies, please contact:</p>
          <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, padding: '20px 24px', marginTop: 12 }}>
            <p style={{ margin: 0 }}><strong style={{ color: '#ffffff' }}>Hostao LLC</strong></p>
            <p style={{ margin: '4px 0' }}>30 N Gould St, Ste 4000, Sheridan, Wyoming 82801, USA</p>
            <p style={{ margin: '4px 0' }}>Email: <a href="mailto:privacy@bestemail.in" style={{ color: '#818CF8' }}>privacy@bestemail.in</a></p>
            <p style={{ margin: '4px 0' }}>Grievance Officer: <a href="mailto:grievance@bestemail.in" style={{ color: '#818CF8' }}>grievance@bestemail.in</a></p>
          </div>
        </div>
      </main>

      <StandardFooter />
    </div>
  );
}
