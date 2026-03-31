import Link from 'next/link';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const pageContent: Record<string, { title: string; description: string }> = {
  features: { title: 'Features', description: 'Explore all Bestemail features for campaigns, automation, and analytics.' },
  pricing: { title: 'Pricing', description: 'Simple transparent pricing for startups, growing businesses, and enterprises.' },
  templates: { title: 'Templates', description: 'Pre-built professional email templates for promotions, updates, and newsletters.' },
  resources: { title: 'Resources', description: 'Guides, best practices, and tutorials to improve your email marketing results.' },
  about: { title: 'About Bestemail', description: 'We help Indian businesses grow with simple, reliable email marketing.' },
  demo: { title: 'Book a Demo', description: 'Schedule a product demo with our team and see Bestemail in action.' },
  signup: { title: 'Create Account', description: 'Start your 14-day free trial and launch your first campaign in minutes.' },
  contact: { title: 'Contact Us', description: 'Reach our support and sales team for setup help and pricing questions.' },
  help: { title: 'Help Center', description: 'Find quick answers for setup, campaigns, contacts, and automation.' },
  tutorials: { title: 'Video Tutorials', description: 'Step-by-step tutorials to master Bestemail quickly.' },
  status: { title: 'System Status', description: 'Live status and uptime information for Bestemail services.' },
  blog: { title: 'Blog', description: 'Latest email marketing tips, product updates, and growth stories.' },
  careers: { title: 'Careers', description: 'Join our team and help build the future of simple marketing tools.' },
  partners: { title: 'Partners', description: 'Partner with Bestemail to deliver better marketing outcomes for clients.' },
  terms: { title: 'Terms of Service', description: 'Read the terms and conditions for using Bestemail.' },
  privacy: { title: 'Privacy Policy', description: 'Learn how we protect your data and privacy.' },
  security: { title: 'Security', description: 'Our approach to infrastructure, encryption, and account security.' },
  gdpr: { title: 'GDPR', description: 'Compliance and data rights information for customers.' },
  integrations: { title: 'Integrations', description: 'Connect Bestemail with your CRM, e-commerce, and workflow tools.' },
  api: { title: 'API', description: 'Developer APIs for campaign, contacts, and automation management.' },
};

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = pageContent[slug] ?? {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: 'This page is being finalized. The section will be available shortly.',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column' }}>
      <Navigation />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px 64px' }}>
          <Link href="/" style={{ color: '#00B4D8', fontWeight: 600, textDecoration: 'none' }}>← Back to Home</Link>
          <div style={{ marginTop: 24, background: '#1a1a2e', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', padding: '32px 24px' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(34px, 8vw, 52px)', lineHeight: 1.05, fontWeight: 800, color: '#ffffff' }}>{content.title}</h1>
            <p style={{ margin: '16px 0 0', fontSize: 18, color: '#8b8ba7', lineHeight: 1.7 }}>{content.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
              <Link href="/signup" style={{ background: '#00B4D8', color: '#fff', padding: '12px 18px', borderRadius: 12, textDecoration: 'none', fontWeight: 600 }}>Start Free Trial</Link>
              <Link href="/login" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px 18px', borderRadius: 12, textDecoration: 'none', fontWeight: 600 }}>Login</Link>
              <Link href="/dashboard" style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#8b8ba7', padding: '12px 18px', borderRadius: 12, textDecoration: 'none', fontWeight: 600 }}>Open Dashboard</Link>
            </div>
          </div>
        </div>
      </main>

      <StandardFooter />
    </div>
  );
}
