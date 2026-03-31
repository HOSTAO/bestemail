'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function AboutPage() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const values = [
    { icon: '\u{1F3AF}', title: 'Simplicity', description: 'We believe powerful tools don\'t need to be complicated. Every feature is designed to be intuitive.' },
    { icon: '\u{1F1EE}\u{1F1F3}', title: 'Made in India', description: 'Built by Indians, for Indian businesses. We understand your market, your festivals, your customers.' },
    { icon: '\u26A1', title: 'Reliability', description: '99.9% uptime. Your campaigns go out on time, every time. No excuses.' },
    { icon: '\u{1F91D}', title: 'Transparency', description: 'Clear pricing, honest communication, no hidden fees. What you see is what you get.' },
  ];

  const stats = [
    { number: '332', label: 'Templates' },
    { number: '500+', label: 'Businesses' },
    { number: '99.9%', label: 'Uptime' },
    { number: '2026', label: 'Founded' },
  ];

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
        padding: isMobile ? '80px 0 40px' : '120px 0 60px',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
          }}>About Bestemail</h1>
          <p style={{
            fontSize: '18px',
            color: '#8b8ba7',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            Making professional email marketing accessible to every Indian business
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '34px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '40px',
            textAlign: 'center',
          }}>Our Story</h2>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' as const : 'row' as const,
            gap: '40px',
            alignItems: 'center',
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '16px', color: '#8b8ba7', lineHeight: '1.8', marginBottom: '20px' }}>
                We started Bestemail in 2026 with a simple belief: every Indian business deserves access to powerful email marketing tools — without the complexity or high costs of international platforms.
              </p>
              <p style={{ fontSize: '16px', color: '#8b8ba7', lineHeight: '1.8', marginBottom: '20px' }}>
                Most email marketing platforms are built for Western markets with pricing in dollars and features that don&apos;t match Indian business needs. We&apos;re changing that.
              </p>
              <p style={{ fontSize: '16px', color: '#8b8ba7', lineHeight: '1.8' }}>
                Bestemail is built from the ground up for Indian businesses — with INR pricing, festival templates, WhatsApp-friendly workflows, and infrastructure that ensures your emails actually reach the inbox.
              </p>
            </div>
            <div style={{
              flex: 1,
              minHeight: '280px',
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8b8ba7',
              fontSize: '14px',
            }}>
              Visual Placeholder
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '24px',
          }}>
            <div style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#00B4D8', marginBottom: '16px' }}>Our Mission</h3>
              <p style={{ fontSize: '16px', color: '#8b8ba7', lineHeight: '1.7' }}>
                To make professional email marketing simple, affordable, and effective for businesses across India.
              </p>
            </div>
            <div style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '16px',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#00B4D8', marginBottom: '16px' }}>Our Vision</h3>
              <p style={{ fontSize: '16px', color: '#8b8ba7', lineHeight: '1.7' }}>
                To become India&apos;s most trusted email marketing platform, empowering 100,000 businesses to grow through email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '34px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '40px',
            textAlign: 'center',
          }}>Our Values</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '24px',
          }}>
            {values.map((value, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(0,180,216,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{value.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{value.title}</h3>
                <p style={{ fontSize: '14px', color: '#8b8ba7', lineHeight: '1.6' }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '34px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '40px',
            textAlign: 'center',
          }}>Leadership</h2>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#1a1a2e',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center' as const,
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#00B4D8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px',
              fontWeight: '700',
              color: '#ffffff',
            }}>RM</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>Reji Modiyil</h3>
            <p style={{ fontSize: '14px', color: '#00B4D8', marginBottom: '16px', fontWeight: '500' }}>Founder & CEO</p>
            <p style={{ fontSize: '14px', color: '#8b8ba7', lineHeight: '1.7' }}>
              Passionate about building email marketing tools that empower Indian businesses to grow. Previously built and scaled email systems serving millions of messages.
            </p>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            backgroundColor: '#1a1a2e',
            borderRadius: '16px',
            padding: isMobile ? '32px 16px' : '48px',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '32px',
            textAlign: 'center' as const,
          }}>
            {stats.map((stat, index) => (
              <div key={index}>
                <div style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>{stat.number}</div>
                <div style={{ fontSize: '14px', color: '#8b8ba7' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office */}
      <section style={{ padding: isMobile ? '40px 0' : '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' as const }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '34px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '12px',
          }}>Our Office</h2>
          <p style={{ fontSize: '16px', color: '#8b8ba7', marginBottom: '32px' }}>
            Operating from India, serving businesses globally
          </p>
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: '#1a1a2e',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ fontSize: '15px', color: '#8b8ba7', lineHeight: '1.7', marginBottom: '16px' }}>
              We&apos;re a remote-first team passionate about email marketing and Indian business growth.
            </p>
            <p style={{ fontSize: '15px', color: '#ffffff', fontWeight: '500' }}>Bestemail Technologies</p>
            <p style={{ fontSize: '14px', color: '#8b8ba7' }}>Kochi, Kerala, India</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: isMobile ? '40px 0 60px' : '60px 0 80px',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: isMobile ? '24px' : '30px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' }}>
            Want to join us?
          </h2>
          <Link href="/careers" style={{
            display: 'inline-block',
            padding: '14px 32px',
            backgroundColor: '#00B4D8',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'background-color 0.3s',
          }}>
            See Open Positions
          </Link>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
