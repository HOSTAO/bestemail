'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(1200);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '28px' : '40px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '16px',
    letterSpacing: '-0.5px',
    lineHeight: '1.2',
    textAlign: 'center',
  };

  const sectionSubtitleStyle: React.CSSProperties = {
    fontSize: isMobile ? '15px' : '18px',
    color: '#8b8ba7',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  };

  const features = [
    { icon: '📧', title: 'Email Campaigns', desc: 'Design beautiful emails with our drag-and-drop editor. Choose from 330+ ready-made templates.' },
    { icon: '🔄', title: 'Automation Sequences', desc: 'Set up drip campaigns that nurture leads automatically. Trigger based on actions.' },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Track opens, clicks, bounces, and conversions in real-time with detailed reports.' },
    { icon: '🎯', title: 'Contact Segmentation', desc: 'Organize contacts with tags and segments. Send targeted messages to the right people.' },
    { icon: '📝', title: '330+ Templates', desc: 'Festival greetings, business updates, product launches — templates for every occasion.' },
    { icon: '🔗', title: 'Cloudflare Integration', desc: 'One-click DNS setup for domain authentication. Improve deliverability instantly.' },
  ];

  const stats = [
    { number: '332', label: 'Templates' },
    { number: '99.9%', label: 'Uptime' },
    { number: '500+', label: 'Businesses' },
    { number: '24/7', label: 'Support' },
  ];

  const steps = [
    { num: '1', title: 'Import Your Contacts', desc: 'Upload a CSV or add contacts manually. We handle deduplication automatically.' },
    { num: '2', title: 'Pick a Template', desc: 'Choose from 330+ professionally designed templates or create your own from scratch.' },
    { num: '3', title: 'Send & Track Results', desc: 'Schedule or send immediately. Watch real-time analytics as your campaign performs.' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '₹1,999',
      period: '/mo',
      desc: 'Up to 2,500 subscribers',
      features: ['5,000 emails/month', 'Email campaigns', '50+ templates', 'Basic analytics', 'Email support'],
      popular: false,
    },
    {
      name: 'Growth',
      price: '₹5,499',
      period: '/mo',
      desc: 'Up to 10,000 subscribers',
      features: ['50,000 emails/month', 'Automation sequences', '330+ templates', 'Advanced analytics', 'Priority support'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '₹14,999',
      period: '/mo',
      desc: 'Up to 25,000 subscribers',
      features: ['150,000 emails/month', 'Custom integrations', 'All templates', 'Dedicated IP', '24/7 phone support'],
      popular: false,
    },
  ];

  const testimonials = [
    {
      quote: 'Bestemail transformed our Diwali campaigns. We saw 3x more engagement compared to our previous tool.',
      name: 'Priya Sharma',
      company: 'Founder at ShopKart',
      initials: 'PS',
    },
    {
      quote: 'The automation sequences saved us 10+ hours every week. Best investment for our growing startup.',
      name: 'Rahul Mehta',
      company: 'CEO at TechBridge Solutions',
      initials: 'RM',
    },
    {
      quote: 'Finally, an email platform that understands Indian businesses. The festival templates are a game-changer.',
      name: 'Anita Desai',
      company: 'Marketing Head at FreshBasket',
      initials: 'AD',
    },
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
      color: '#ffffff',
    }}>
      <Navigation />

      {/* Hero Section */}
      <section style={{
        background: 'radial-gradient(ellipse at center, rgba(0,180,216,0.15) 0%, #0f0f1a 70%)',
        padding: isMobile ? '80px 0 60px' : '120px 0 80px',
        textAlign: 'center',
      }}>
        <div style={containerStyle}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid #00B4D8',
            padding: '8px 20px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '32px',
            color: '#E0F7FA',
            backgroundColor: 'rgba(0,180,216,0.1)',
          }}>
            🇮🇳 Built for Indian Businesses
          </div>

          <h1 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '700',
            color: '#ffffff',
            lineHeight: '1.15',
            marginBottom: '24px',
            maxWidth: '800px',
            margin: '0 auto 24px',
            letterSpacing: '-0.5px',
          }}>
            Email Marketing That Actually Delivers
          </h1>

          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            color: '#8b8ba7',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            Send beautiful campaigns, automate follow-ups, and grow your audience — all from one powerful platform.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            marginBottom: '32px',
          }}>
            <Link href="/signup" style={{
              backgroundColor: '#00B4D8',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              display: 'inline-block',
              transition: 'background-color 0.2s',
            }}>
              Start Free — No Credit Card
            </Link>
            <a href="#how-it-works" style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              display: 'inline-block',
              backgroundColor: 'transparent',
              transition: 'border-color 0.2s',
            }}>
              See How It Works
            </a>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#8b8ba7',
            margin: 0,
          }}>
            <span style={{ color: '#f59e0b', letterSpacing: '2px', marginRight: '8px' }}>★★★★★</span>
            Trusted by 500+ businesses across India
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: isMobile ? '60px 0' : '100px 0',
        backgroundColor: '#0f0f1a',
      }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '64px' }}>
            <h2 style={sectionTitleStyle}>Everything You Need to Grow</h2>
            <p style={sectionSubtitleStyle}>Powerful features to create, send, and optimize your email campaigns</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {features.map((feature, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#1a1a2e',
                  border: `1px solid ${hoveredCard === i ? '#00B4D8' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '16px',
                  padding: isMobile ? '24px' : '32px',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0,180,216,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>{feature.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#8b8ba7', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{
        backgroundColor: '#1a1a2e',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 0',
      }}>
        <div style={containerStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap' as const,
            gap: isMobile ? '32px' : '0',
            textAlign: 'center',
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ flex: isMobile ? '1 1 40%' : '1 1 auto' }}>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>{stat.number}</div>
                <div style={{ fontSize: '14px', color: '#8b8ba7' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: isMobile ? '60px 0' : '100px 0',
        backgroundColor: '#0f0f1a',
      }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '64px' }}>
            <h2 style={sectionTitleStyle}>How It Works</h2>
            <p style={sectionSubtitleStyle}>Get started in minutes, not hours</p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: 'center',
            gap: isMobile ? '40px' : '0',
            position: 'relative' as const,
          }}>
            {/* Connecting line on desktop */}
            {!isMobile && (
              <div style={{
                position: 'absolute',
                top: '24px',
                left: '20%',
                right: '20%',
                height: '2px',
                borderTop: '2px dashed rgba(0,180,216,0.4)',
                zIndex: 0,
              }} />
            )}

            {steps.map((step, i) => (
              <div key={i} style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative' as const,
                zIndex: 1,
                padding: '0 20px',
                maxWidth: isMobile ? '320px' : 'none',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#00B4D8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 auto 20px',
                }}>
                  {step.num}
                </div>
                <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>{step.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#8b8ba7', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section style={{
        padding: isMobile ? '60px 0' : '100px 0',
        backgroundColor: '#0f0f1a',
      }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
            <h2 style={sectionTitleStyle}>Simple, Transparent Pricing</h2>
            <p style={sectionSubtitleStyle}>No hidden fees. Cancel anytime.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '24px',
            maxWidth: '960px',
            margin: '0 auto',
          }}>
            {plans.map((plan, i) => (
              <div key={i} style={{
                backgroundColor: '#1a1a2e',
                padding: isMobile ? '28px 24px' : '36px 32px',
                borderRadius: '16px',
                border: plan.popular ? '2px solid #00B4D8' : '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
                position: 'relative' as const,
              }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#00B4D8',
                    color: '#ffffff',
                    padding: '4px 16px',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap' as const,
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: '700', color: '#ffffff' }}>{plan.name}</h3>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '36px', fontWeight: '700', color: '#ffffff' }}>{plan.price}</span>
                  <span style={{ fontSize: '16px', color: '#8b8ba7' }}>{plan.period}</span>
                </div>
                <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#8b8ba7' }}>{plan.desc}</p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 24px',
                  textAlign: 'left',
                }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{
                      padding: '8px 0',
                      fontSize: '14px',
                      color: '#8b8ba7',
                      borderBottom: j < plan.features.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}>
                      <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" style={{
                  display: 'block',
                  padding: '12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.2s',
                  ...(plan.popular ? {
                    backgroundColor: '#00B4D8',
                    color: '#ffffff',
                  } : {
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }),
                }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/pricing" style={{
              color: '#00B4D8',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
            }}>
              View full pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: isMobile ? '60px 0' : '100px 0',
        backgroundColor: '#0f0f1a',
      }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}>
            <h2 style={sectionTitleStyle}>Loved by Indian Businesses</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '24px',
          }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: isMobile ? '24px' : '32px',
              }}>
                <p style={{
                  margin: '0 0 24px',
                  fontSize: '15px',
                  color: '#ffffff',
                  fontStyle: 'italic',
                  lineHeight: '1.7',
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#00B4D8',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    flexShrink: 0,
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>{t.name}</div>
                    <div style={{ fontSize: '13px', color: '#8b8ba7' }}>{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: isMobile ? '60px 0' : '100px 0',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
        textAlign: 'center',
        position: 'relative' as const,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0,180,216,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ ...containerStyle, position: 'relative' as const, zIndex: 1 }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
            lineHeight: '1.2',
          }}>
            Ready to Grow Your Email List?
          </h2>
          <p style={{
            fontSize: isMobile ? '15px' : '18px',
            color: '#8b8ba7',
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px',
          }}>
            Join 500+ Indian businesses already using Bestemail
          </p>
          <Link href="/signup" style={{
            backgroundColor: '#00B4D8',
            color: '#ffffff',
            padding: '18px 40px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '17px',
            display: 'inline-block',
            transition: 'background-color 0.2s',
          }}>
            Start Free — No Credit Card
          </Link>
          <p style={{
            fontSize: '13px',
            color: '#8b8ba7',
            marginTop: '20px',
          }}>
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
