'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function PressPage() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const pageStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const
  };

  const pressNotes = [
    {
      date: '2026-03-01',
      title: 'Bestemail product pages updated for clearer early-stage positioning',
      summary: 'Recent copy changes focus on matching public marketing language more closely to the current product state.'
    },
    {
      date: '2026-02-20',
      title: 'Core workflow focus remains campaigns, contacts, settings, and delivery workflows',
      summary: 'Bestemail continues to prioritize practical core workflows before expanding broader surface-area claims.'
    },
    {
      date: '2026-02-01',
      title: 'Media and partner inquiries welcome by email',
      summary: 'For current product status, assets, or interviews, contact the team directly for the most accurate information.'
    }
  ];

  const companyFacts = [
    { label: 'Stage', value: 'Early public build' },
    { label: 'Focus', value: 'Campaigns + contacts + delivery' },
    { label: 'Company', value: 'Hostao L.L.C.' },
    { label: 'Press contact', value: 'press@bestemail.in' }
  ];

  const mediaAssets = [
    {
      type: 'Logo Pack',
      desc: 'Brand assets available on request',
      size: 'Shared manually'
    },
    {
      type: 'Product Screenshots',
      desc: 'Recent screenshots of the current interface',
      size: 'Shared manually'
    },
    {
      type: 'Founder Bio',
      desc: 'Short company and founder background for coverage',
      size: 'Shared manually'
    },
    {
      type: 'Product Status Notes',
      desc: 'Current build notes to help avoid outdated or overstated descriptions',
      size: 'Shared manually'
    }
  ];

  return (
    <div style={pageStyle}>
      <Navigation />

      <section style={{
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
        padding: isMobile ? '60px 0 40px' : '120px 0 80px',
        textAlign: 'center' as const
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{
            fontSize: isMobile ? '36px' : '64px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            Press & Media
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Resources</span>
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '22px',
            color: '#8b8ba7',
            maxWidth: '760px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            Bestemail is still early. If you are covering the product, please contact us for the latest status so your story reflects what is live today.
          </p>
          <a
            href="mailto:press@bestemail.in"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)',
              color: '#ffffff',
              padding: isMobile ? '14px 28px' : '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
          >
            Contact Press Team
          </a>
        </div>
      </section>

      <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#0f0f1a' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: '700', color: '#ffffff', marginBottom: '32px', textAlign: 'center' }}>
            About Bestemail
          </h2>

          <div style={{ fontSize: isMobile ? '16px' : '18px', color: '#8b8ba7', lineHeight: '1.8', marginBottom: '48px', backgroundColor: '#1a1a2e', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ marginBottom: '20px' }}>
              Bestemail is an early-stage email product under Hostao L.L.C. The current product emphasis is on campaign creation,
              contact management, settings, and dependable sending workflows.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Some broader pages on the site describe future-facing areas such as integrations, solution templates, or more advanced marketing workflows.
              Those areas should be treated as roadmap or in-progress unless explicitly confirmed otherwise.
            </p>
            <p>
              For current product status, screenshots, founder information, or a short briefing before publication, contact the team directly.
            </p>
          </div>

          <h3 style={{ fontSize: '28px', fontWeight: '600', color: '#ffffff', marginBottom: '32px', textAlign: 'center' }}>
            Current Facts
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
            {companyFacts.map((fact, index) => (
              <div key={index} style={{ textAlign: 'center', padding: '24px', backgroundColor: '#1a1a2e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#00B4D8', marginBottom: '8px' }}>{fact.value}</div>
                <div style={{ fontSize: '14px', color: '#8b8ba7' }}>{fact.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#1a1a2e' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: '700', color: '#ffffff', marginBottom: '48px', textAlign: 'center' }}>
            Recent Notes
          </h2>

          <div>
            {pressNotes.map((release, index) => (
              <div key={index} style={{ backgroundColor: '#0f0f1a', borderRadius: '12px', padding: '32px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '14px', color: '#8b8ba7', marginBottom: '8px' }}>
                      {new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{release.title}</h3>
                    <p style={{ fontSize: '16px', color: '#8b8ba7', lineHeight: '1.5' }}>{release.summary}</p>
                  </div>
                  <span style={{ color: '#00B4D8', fontSize: '14px', fontWeight: '600', flexShrink: 0 }}>Email for details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#0f0f1a' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: '700', color: '#ffffff', marginBottom: '16px', textAlign: 'center' }}>
            Media Assets
          </h2>
          <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#8b8ba7', maxWidth: '600px', margin: '0 auto 48px', textAlign: 'center' }}>
            Assets are shared manually so the latest materials match the current product.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '24px' }}>
            {mediaAssets.map((asset, index) => (
              <div key={index} style={{ backgroundColor: '#1a1a2e', borderRadius: '12px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>{asset.type}</h4>
                  <p style={{ fontSize: '14px', color: '#8b8ba7', marginBottom: '4px' }}>{asset.desc}</p>
                  <p style={{ fontSize: '13px', color: '#8b8ba7' }}>{asset.size}</p>
                </div>
                <span style={{ color: '#00B4D8', fontSize: '14px', fontWeight: '600' }}>Request</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '60px 0' : '80px 0', backgroundColor: '#1a1a2e', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1rem' }}>
          <h3 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>Media Contact</h3>
          <p style={{ fontSize: '18px', color: '#8b8ba7', marginBottom: '32px' }}>
            For press inquiries, interviews, or background information
          </p>

          <div style={{ backgroundColor: '#0f0f1a', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-block', textAlign: 'left' }}>
            <p style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px' }}>
              <strong>Press Team</strong>
            </p>
            <p style={{ fontSize: '16px', color: '#8b8ba7', marginBottom: '4px' }}>
              Email:{' '}
              <a href="mailto:press@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>
                press@bestemail.in
              </a>
            </p>
            <p style={{ fontSize: '16px', color: '#8b8ba7' }}>
              Please include your publication, deadline, and what you need.
            </p>
          </div>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
