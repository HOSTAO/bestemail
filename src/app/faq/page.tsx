'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const faqCategories = [
  {
    name: 'Getting Started',
    items: [
      { q: 'What is BestEmail?', a: 'BestEmail is an email marketing platform built specifically for Indian businesses. Create campaigns, automate emails, manage contacts, and track performance — all in one place.' },
      { q: 'How do I create an account?', a: 'Click "Get Started" on the homepage, enter your email and business details. You\'ll get instant access to the free plan with 1,000 emails/month.' },
      { q: 'Is there a free plan?', a: 'Yes! Our free plan includes 1,000 emails/month, basic templates, and contact management for up to 500 contacts.' },
    ]
  },
  {
    name: 'Campaigns',
    items: [
      { q: 'How do I create a campaign?', a: 'Dashboard → Campaigns → New Campaign. Choose a template or start from scratch, add your content, select recipients, and schedule or send immediately.' },
      { q: 'Can I schedule campaigns?', a: 'Yes — schedule for any date/time. We also support timezone-based delivery so emails arrive at the right local time.' },
      { q: 'What\'s the difference between a campaign and automation?', a: 'Campaigns are one-time sends. Automations are triggered sequences — like welcome emails when someone subscribes, or follow-ups after a purchase.' },
    ]
  },
  {
    name: 'Templates',
    items: [
      { q: 'How many templates are available?', a: 'Over 300 templates across categories: Welcome, Festivals (Diwali, Eid, Holi, Christmas), Business, E-commerce, Newsletters, and more.' },
      { q: 'Can I customize templates?', a: 'Absolutely. Use our drag-and-drop editor to change colors, fonts, images, and layout. You can also save custom templates for reuse.' },
    ]
  },
  {
    name: 'Deliverability',
    items: [
      { q: 'How do I improve deliverability?', a: 'Authenticate your domain with SPF, DKIM, and DMARC. Keep your lists clean, avoid spammy subject lines, and use our built-in deliverability checker.' },
      { q: 'Why are my emails going to spam?', a: 'Common reasons: unauthenticated domain, purchased/stale email lists, spammy content, or too many bounces. Our deliverability guide walks you through fixes.' },
    ]
  },
  {
    name: 'Billing',
    items: [
      { q: 'What payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, and PayPal. All plans billed in INR with GST included.' },
      { q: 'Can I change or cancel my plan?', a: 'Settings → Billing → Change Plan anytime. Downgrades take effect at billing cycle end. Cancel anytime, no penalties.' },
      { q: 'Do you offer refunds?', a: 'Yes — we offer pro-rated refunds within 7 days of plan upgrade if you\'re not satisfied. See our refund policy for details.' },
    ]
  },
  {
    name: 'Technical',
    items: [
      { q: 'Is there an API?', a: 'Yes — our REST API supports contact management, campaign triggers, analytics retrieval, and webhook integrations. See API docs for details.' },
      { q: 'Can I embed signup forms on my website?', a: 'Yes — create forms in Dashboard → Forms, then copy the embed code to your website. Works with any platform.' },
    ]
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  return (
    <>
      <Navigation />
      <main style={{ minHeight: '100vh', background: '#fff' }}>
        <section style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '80px 20px', textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>Frequently Asked Questions</h1>
          <p style={{ opacity: 0.9, maxWidth: 600, margin: '0 auto 32px' }}>Find answers to common questions about BestEmail</p>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <input type="text" placeholder="Search FAQs..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '16px 24px', borderRadius: 12, border: 'none', fontSize: '1rem', outline: 'none' }} />
          </div>
        </section>

        <section style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px' }}>
          {faqCategories.map((cat, ci) => {
            const items = cat.items.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));
            if (items.length === 0) return null;
            return (
              <div key={ci} style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: '#1e40af' }}>{cat.name}</h2>
                {items.map((f, fi) => {
                  const key = `${ci}-${fi}`;
                  return (
                    <div key={key} style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
                      <button onClick={() => setOpenItem(openItem === key ? null : key)}
                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1rem', fontWeight: 600, color: '#111', padding: 0 }}>
                        {f.q}
                        <span style={{ fontSize: '1.3rem', transform: openItem === key ? 'rotate(45deg)' : 'none', transition: '0.2s', flexShrink: 0, marginLeft: 12 }}>+</span>
                      </button>
                      {openItem === key && <p style={{ color: '#4b5563', marginTop: 12, lineHeight: 1.6, fontSize: '0.95rem' }}>{f.a}</p>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>

        <section style={{ background: '#f9fafb', padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>Can&apos;t find what you&apos;re looking for?</p>
          <a href="/support" style={{ color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>Contact our support team →</a>
        </section>
      </main>
      <StandardFooter />
    </>
  );
}
