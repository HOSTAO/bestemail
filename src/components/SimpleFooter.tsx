import Link from 'next/link';

export default function SimpleFooter() {
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: '#111827',
    color: '#d1d5db',
    padding: '3rem 0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1.5rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    marginBottom: '2rem'
  };

  const linkStyle = {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.875rem',
    display: 'block',
    marginBottom: '0.5rem'
  };

  const headingStyle = {
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: '1rem',
    fontSize: '1rem'
  };

  const socialButtonStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: '#1f2937',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginRight: '0.5rem'
  };

  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* Company Info */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>
            Bestemail
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#e5e7eb', marginBottom: '1rem' }}>
            Enterprise Platform
          </p>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            India's most affordable email marketing platform. Send targeted campaigns, 
            automate workflows, and grow your business.
          </p>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>A Product of</p>
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff' }}>Hostao L.L.C.</p>
            <p style={{ fontSize: '0.875rem' }}>Enterprise Email Solutions</p>
          </div>
          {/* Social Links */}
          <div>
            <a href="https://twitter.com/bestemail" target="_blank" rel="noopener noreferrer" style={socialButtonStyle}>𝕏</a>
            <a href="https://linkedin.com/company/bestemail" target="_blank" rel="noopener noreferrer" style={socialButtonStyle}>in</a>
            <a href="https://facebook.com/bestemail" target="_blank" rel="noopener noreferrer" style={socialButtonStyle}>f</a>
            <a href="https://youtube.com/bestemail" target="_blank" rel="noopener noreferrer" style={socialButtonStyle}>▶</a>
          </div>
        </div>

        {/* Links Grid */}
        <div style={gridStyle}>
          {/* Product Links */}
          <div>
            <h3 style={headingStyle}>Product</h3>
            <Link href="/features" style={linkStyle}>Features</Link>
            <Link href="/pricing" style={linkStyle}>Pricing</Link>
            <Link href="/integrations" style={linkStyle}>Integrations</Link>
            <Link href="/api-docs" style={linkStyle}>API Documentation</Link>
            <Link href="/white-label" style={linkStyle}>White Label</Link>
          </div>

          {/* Company Links */}
          <div>
            <h3 style={headingStyle}>Company</h3>
            <Link href="/about" style={linkStyle}>About Us</Link>
            <Link href="/careers" style={linkStyle}>Careers</Link>
            <Link href="/press" style={linkStyle}>Press Kit</Link>
            <Link href="/contact" style={linkStyle}>Contact</Link>
            <Link href="/partners" style={linkStyle}>Partners</Link>
          </div>

          {/* Resources Links */}
          <div>
            <h3 style={headingStyle}>Resources</h3>
            <Link href="/blog" style={linkStyle}>Blog</Link>
            <Link href="/templates" style={linkStyle}>Email Templates</Link>
            <Link href="/help" style={linkStyle}>Help Center</Link>
            <Link href="/tutorials" style={linkStyle}>Video Tutorials</Link>
            <Link href="/case-studies" style={linkStyle}>Case Studies</Link>
          </div>

          {/* Legal Links */}
          <div>
            <h3 style={headingStyle}>Legal</h3>
            <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
            <Link href="/terms" style={linkStyle}>Terms of Service</Link>
            <Link href="/cookies" style={linkStyle}>Cookie Policy</Link>
            <Link href="/gdpr" style={linkStyle}>GDPR Compliance</Link>
            <Link href="/refund" style={linkStyle}>Refund Policy</Link>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div>
              <h4 style={headingStyle}>India Office</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                Hostao L.L.C.<br />
                123, Tech Park, Sector 5<br />
                Mumbai, Maharashtra 400001<br />
                India
              </p>
            </div>
            <div>
              <h4 style={headingStyle}>Contact Us</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                Email: support@bestemail.in<br />
                Sales: sales@bestemail.in<br />
                Phone: <a href="tel:+917470111222" style={{ color: '#60a5fa' }}>+91 747 0111 222</a><br />
                Support Hours: 24/7
              </p>
            </div>
            <div>
              <h4 style={headingStyle}>Newsletter</h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                Get the latest updates on email marketing trends and tips.
              </p>
              <form style={{ display: 'flex' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem 0 0 0.5rem',
                    flex: '1',
                    border: 'none',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0 0.5rem 0.5rem 0',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem' }}>
              &copy; {currentYear} Bestemail. A product of Hostao L.L.C. All rights reserved.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              Bestemail® is a registered trademark of Hostao L.L.C.
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.875rem' }}>
              <span>🇮🇳 Made in India</span>
              <span>🔒 SSL Secured</span>
              <span>✓ ISO 27001</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}