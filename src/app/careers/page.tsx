'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function CareersPage() {
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const benefits = [
    { icon: '\u{1F3E0}', title: 'Remote-First', desc: 'Work from anywhere in India. We believe great work happens when you\'re comfortable.' },
    { icon: '\u23F0', title: 'Flexible Hours', desc: 'We measure output, not hours. Set your own schedule that works for you.' },
    { icon: '\u{1F4B0}', title: 'Competitive Salary', desc: 'Market-rate compensation with annual reviews and performance bonuses.' },
    { icon: '\u{1F4DA}', title: 'Learning Budget', desc: '\u20B950,000/year for courses, books, conferences, and certifications.' },
    { icon: '\u{1F3E5}', title: 'Health Insurance', desc: 'Comprehensive health coverage for you and your family.' },
    { icon: '\u{1F680}', title: 'Growth Opportunity', desc: 'Early-stage startup with real ownership. Your work directly impacts the product.' },
  ];

  const positions = [
    {
      title: 'Frontend Engineer',
      location: 'Remote, India',
      type: 'Full-time',
      description: 'Build beautiful, responsive interfaces with React and Next.js',
      requirements: ['2+ years React/Next.js', 'TypeScript', 'Responsive design', 'API integration'],
    },
    {
      title: 'Customer Success Manager',
      location: 'Remote, India',
      type: 'Full-time',
      description: 'Help our customers succeed with email marketing',
      requirements: ['1+ years in customer success/support', 'Excellent communication', 'Email marketing knowledge preferred'],
    },
    {
      title: 'Growth Marketer',
      location: 'Remote, India',
      type: 'Full-time',
      description: 'Drive user acquisition and growth through content and campaigns',
      requirements: ['2+ years in digital marketing', 'SEO/content marketing', 'Data-driven mindset', 'Email marketing experience'],
    },
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column' as const,
    }}>
      <Navigation />

      {/* Hero */}
      <section style={{
        padding: isMobile ? '80px 20px 48px' : '120px 20px 80px',
        textAlign: 'center' as const,
        position: 'relative' as const,
        overflow: 'hidden',
      }}>
        {/* Subtle purple glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(0,180,216,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' as const }}>
          <h1 style={{
            fontSize: isMobile ? 32 : 42,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
            lineHeight: 1.2,
          }}>
            Join the Bestemail Team
          </h1>
          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: '#8b8ba7',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Help us build the future of email marketing in India.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' as const }}>
          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: '#8b8ba7',
            maxWidth: 700,
            margin: '0 auto 12px',
            lineHeight: 1.7,
          }}>
            We&apos;re building something special — an email marketing platform designed from the ground up for Indian businesses.
          </p>
          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: '#8b8ba7',
            maxWidth: 700,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            If you&apos;re passionate about creating tools that make a real difference, we want to hear from you.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 24,
        }}>
          {benefits.map((b, i) => (
            <div key={i} style={{
              backgroundColor: '#1a1a2e',
              borderRadius: 12,
              padding: isMobile ? 24 : 28,
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'border-color 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,180,216,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', marginBottom: 8, marginTop: 0 }}>
                {b.title}
              </h3>
              <p style={{ fontSize: 14, color: '#8b8ba7', lineHeight: 1.6, margin: 0 }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 32,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 32,
            textAlign: 'center' as const,
          }}>
            Current Openings
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
            {positions.map((pos, i) => (
              <div key={i} style={{
                backgroundColor: '#1a1a2e',
                borderRadius: 12,
                padding: isMobile ? 24 : 32,
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: '4px solid #00B4D8',
                transition: 'transform 0.3s, border-color 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  flexDirection: isMobile ? 'column' as const : 'row' as const,
                  gap: 16,
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', margin: '0 0 6px' }}>
                      {pos.title}
                    </h3>
                    <div style={{ fontSize: 14, color: '#8b8ba7', marginBottom: 10 }}>
                      {pos.location} &middot; {pos.type}
                    </div>
                    <p style={{ fontSize: 15, color: '#8b8ba7', lineHeight: 1.5, margin: '0 0 12px' }}>
                      {pos.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                      {pos.requirements.map((req, j) => (
                        <span key={j} style={{
                          fontSize: 12,
                          color: '#8b8ba7',
                          backgroundColor: 'rgba(0,180,216,0.1)',
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid rgba(0,180,216,0.2)',
                        }}>
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@bestemail.in?subject=Application for ${pos.title}`}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#00B4D8',
                      color: '#ffffff',
                      padding: '10px 24px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: 14,
                      whiteSpace: 'nowrap' as const,
                      transition: 'opacity 0.3s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Apply &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't See Your Role */}
      <section style={{ padding: isMobile ? '40px 20px' : '60px 20px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          backgroundColor: '#1a1a2e',
          borderRadius: 12,
          padding: isMobile ? 24 : 40,
          border: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center' as const,
        }}>
          <h3 style={{ fontSize: 22, fontWeight: 600, color: '#ffffff', marginBottom: 12, marginTop: 0 }}>
            Don&apos;t See Your Role?
          </h3>
          <p style={{ fontSize: 15, color: '#8b8ba7', marginBottom: 8, lineHeight: 1.6 }}>
            We&apos;re always looking for talented people.
          </p>
          <p style={{ fontSize: 15, color: '#8b8ba7', margin: 0, lineHeight: 1.6 }}>
            Send your resume to{' '}
            <a href="mailto:careers@bestemail.in" style={{ color: '#00B4D8', textDecoration: 'none' }}>
              careers@bestemail.in
            </a>{' '}
            with a brief introduction.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: isMobile ? '48px 20px 60px' : '80px 20px',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? 28 : 32,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 12,
          }}>
            Ready to make an impact?
          </h2>
          <p style={{
            fontSize: isMobile ? 16 : 18,
            color: '#8b8ba7',
            maxWidth: 600,
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}>
            Join a team that&apos;s transforming email marketing for Indian businesses.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <a
              href="#positions"
              style={{
                display: 'inline-block',
                backgroundColor: '#00B4D8',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 16,
                transition: 'opacity 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              View All Openings
            </a>
            <a
              href="mailto:careers@bestemail.in"
              style={{
                display: 'inline-block',
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '12px 30px',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: 16,
                border: '2px solid rgba(255,255,255,0.2)',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00B4D8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            >
              Send Your Resume
            </a>
          </div>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
