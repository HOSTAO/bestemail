import Link from 'next/link';
import Logo from './Logo';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'API Documentation', href: '/api-docs' },
      { label: 'White Label', href: '/white-label' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
      { label: 'Partners', href: '/partners' }
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Email Templates', href: '/templates' },
      { label: 'Help Center', href: '/help' },
      { label: 'Video Tutorials', href: '/tutorials' },
      { label: 'Case Studies', href: '/case-studies' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR Compliance', href: '/gdpr' },
      { label: 'Refund Policy', href: '/refund' }
    ]
  };

  const socialLinks = [
    { icon: '𝕏', href: 'https://twitter.com/bestemail', label: 'Twitter' },
    { icon: 'in', href: 'https://linkedin.com/company/bestemail', label: 'LinkedIn' },
    { icon: 'f', href: 'https://facebook.com/bestemail', label: 'Facebook' },
    { icon: '▶', href: 'https://youtube.com/bestemail', label: 'YouTube' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.grid}>
          {/* Company Info */}
          <div className={styles.companyInfo}>
            <div className={styles.logoSection}>
              <Logo size="md" />
            </div>
            <p className={styles.description}>
              India's most affordable email marketing platform. Send targeted campaigns, 
              automate workflows, and grow your business.
            </p>
            <div className={styles.parentCompany}>
              <p className={styles.parentLabel}>A Product of</p>
              <p className={styles.parentName}>Hostao L.L.C.</p>
              <p className={styles.parentTagline}>Enterprise Email Solutions</p>
            </div>
            {/* Social Links */}
            <div className={styles.socialLinks}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  <span>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className={styles.linkSection}>
            <h3>Product</h3>
            <ul className={styles.linkList}>
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkSection}>
            <h3>Company</h3>
            <ul className={styles.linkList}>
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkSection}>
            <h3>Resources</h3>
            <ul className={styles.linkList}>
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkSection}>
            <h3>Legal</h3>
            <ul className={styles.linkList}>
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className={styles.contactSection}>
          <div className={styles.contactGrid}>
            <div className={styles.officeInfo}>
              <h4>India Office</h4>
              <p>
                Hostao L.L.C.<br />
                123, Tech Park, Sector 5<br />
                Mumbai, Maharashtra 400001<br />
                India
              </p>
            </div>
            <div className={styles.officeInfo}>
              <h4>Contact Us</h4>
              <p>
                Email: support@bestemail.in<br />
                Sales: sales@bestemail.in<br />
                Phone: <a href="tel:+917470111222">+91 747 0111 222</a><br />
                Support Hours: 24/7
              </p>
            </div>
            <div className={styles.newsletterSection}>
              <h4>Newsletter</h4>
              <p>
                Get the latest updates on email marketing trends and tips.
              </p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.newsletterInput}
                />
                <button
                  type="submit"
                  className={styles.newsletterButton}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        {/* Hostao Ecosystem Strip */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 0', textAlign: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontWeight: 600 }}>Part of the Hostao Ecosystem</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 16px' }}>
              {[
                ['Hostao', 'https://hostao.com'],
                ['AutoChat', 'https://autochat.in'],
                ['RatingE', 'https://ratinge.com'],
                ['HelpKit', 'https://helpkit.in'],
                ['CookieSeal', 'https://cookieseal.in'],
                ['BestEmail', 'https://bestemail.in'],
                ['RoadmapR', 'https://roadmapr.in'],
                ['SuperLaunch', 'https://superlaunch.in'],
              ].map(([name, href], i, arr) => (
                <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  {name === 'BestEmail' ? (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{name}</span>
                  ) : (
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{name}</a>
                  )}
                  {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.bottomSection}>
          <div className={styles.bottomContent}>
            <div>
              <p className={styles.copyright}>
                &copy; {currentYear} Bestemail. A product of Hostao L.L.C. All rights reserved.
              </p>
              <p className={styles.trademark}>
                Bestemail® is a registered trademark of Hostao L.L.C.
              </p>
            </div>
            <div className={styles.badges}>
              <div className={styles.badge}>
                <span>🇮🇳</span>
                <span>Made in India</span>
              </div>
              <div className={styles.badge}>
                <span>🔒</span>
                <span>SSL Secured</span>
              </div>
              <div className={styles.badge}>
                <span>✓</span>
                <span>ISO 27001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}