'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function PartnersPage() {
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

  const partnerTypes = [
    {
      title: 'Technology Partners',
      icon: '🔌',
      desc: 'Integrate your platform with Bestemail to offer enhanced email capabilities to your users.',
      benefits: ['API access', 'Co-marketing opportunities', 'Technical support', 'Revenue sharing']
    },
    {
      title: 'Agency Partners',
      icon: '🏢',
      desc: 'Offer Bestemail to your clients and earn recurring commissions on every referral.',
      benefits: ['White-label options', 'Partner dashboard', 'Training & certification', 'Priority support']
    },
    {
      title: 'Reseller Partners',
      icon: '💼',
      desc: 'Resell Bestemail with your own branding and pricing to your customer base.',
      benefits: ['Volume discounts', 'Custom domains', 'Billing flexibility', 'Marketing resources']
    }
  ];

  const partnerBenefits = [
    {
      icon: '💰',
      title: '30% Revenue Share',
      desc: 'Earn recurring commissions for the lifetime of every customer you refer'
    },
    {
      icon: '🎯',
      title: 'Dedicated Support',
      desc: 'Get a dedicated partner success manager to help you grow'
    },
    {
      icon: '📚',
      title: 'Training Resources',
      desc: 'Access comprehensive training materials and certification programs'
    },
    {
      icon: '🔧',
      title: 'Technical Integration',
      desc: 'Priority API support and custom integration assistance'
    },
    {
      icon: '📈',
      title: 'Co-Marketing',
      desc: 'Joint marketing campaigns, case studies, and webinars'
    },
    {
      icon: '🏷️',
      title: 'White Label Options',
      desc: 'Offer Bestemail under your own brand with custom domains'
    }
  ];

  const successStories = [
    {
      company: 'TechCorp Solutions',
      type: 'Technology Partner',
      metric: '$2.4M',
      desc: 'Annual revenue generated through Bestemail integration'
    },
    {
      company: 'Digital Marketing Pro',
      type: 'Agency Partner',
      metric: '150+',
      desc: 'Clients successfully onboarded to Bestemail'
    },
    {
      company: 'CloudScale Inc',
      type: 'Reseller Partner',
      metric: '3.5x',
      desc: 'ROI achieved in the first year of partnership'
    }
  ];

  return (
    <div style={pageStyle}>
      <Navigation />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
        padding: isMobile ? '60px 0 40px' : '120px 0 80px',
        textAlign: 'center' as const
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 180, 216, 0.15)',
            color: '#48CAE4',
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px',
            gap: '8px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              display: 'inline-block'
            }}></span>
            Join our Partner Network
          </div>

          <h1 style={{
            fontSize: isMobile ? '36px' : '64px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            Grow your business with
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Bestemail Partnership</span>
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '22px',
            color: '#8b8ba7',
            maxWidth: '700px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            Partner with us to offer world-class email marketing solutions to your
            customers and earn recurring revenue.
          </p>
          <a
            href="#apply"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)',
              color: '#ffffff',
              padding: isMobile ? '14px 28px' : '18px 40px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '18px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 14px 0 rgba(0, 180, 216, 0.3)'
            }}
          >
            Become a Partner
          </a>
        </div>
      </section>

      {/* Partner Types */}
      <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#0f0f1a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
            textAlign: 'center',
            letterSpacing: '-1px'
          }}>Partner Programs</h2>
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            color: '#8b8ba7',
            maxWidth: '700px',
            margin: '0 auto 64px',
            textAlign: 'center'
          }}>
            Choose the partnership model that best fits your business
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {partnerTypes.map((type, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '16px',
                  padding: '40px 32px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = '#00B4D8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>{type.icon}</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '12px'
                }}>{type.title}</h3>
                <p style={{
                  fontSize: '16px',
                  color: '#8b8ba7',
                  marginBottom: '24px',
                  lineHeight: '1.5'
                }}>{type.desc}</p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left'
                }}>
                  {type.benefits.map((benefit, i) => (
                    <li key={i} style={{
                      fontSize: '15px',
                      color: '#8b8ba7',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#1a1a2e' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '64px',
            textAlign: 'center',
            letterSpacing: '-1px'
          }}>Partner Benefits</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {partnerBenefits.map((benefit, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#0f0f1a',
                  borderRadius: '12px',
                  padding: '28px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'start'
                }}
              >
                <span style={{ fontSize: '28px', flexShrink: 0 }}>{benefit.icon}</span>
                <div>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}>{benefit.title}</h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#8b8ba7',
                    lineHeight: '1.5'
                  }}>{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#0f0f1a' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '64px',
            textAlign: 'center',
            letterSpacing: '-1px'
          }}>Partner Success Stories</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {successStories.map((story, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  backgroundColor: '#1a1a2e',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '8px'
                }}>{story.company}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#8b8ba7',
                  marginBottom: '16px'
                }}>{story.type}</p>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '700',
                  color: '#00B4D8',
                  marginBottom: '12px'
                }}>{story.metric}</div>
                <p style={{
                  fontSize: '15px',
                  color: '#8b8ba7',
                  lineHeight: '1.5'
                }}>{story.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section id="apply" style={{
        padding: isMobile ? '60px 0' : '100px 0',
        background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Ready to Partner with Bestemail?
          </h2>
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Join our growing network of partners and help businesses worldwide
            achieve their email marketing goals.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:partners@bestemail.in"
              style={{
                backgroundColor: '#ffffff',
                color: '#0077B6',
                padding: isMobile ? '14px 28px' : '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                display: 'inline-block',
                transition: 'all 0.3s'
              }}
            >
              Apply Now
            </a>
            <a
              href="/contact"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #ffffff',
                color: '#ffffff',
                padding: isMobile ? '12px 26px' : '14px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                display: 'inline-block',
                transition: 'all 0.3s'
              }}
            >
              Schedule a Call
            </a>
          </div>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
