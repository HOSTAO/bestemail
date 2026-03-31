'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function CustomersPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
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

  const caseStudies = [
    {
      company: 'Sample SaaS Onboarding Flow',
      industry: 'saas',
      logo: '🚀',
      challenge: 'Turning trial signups into active users with limited marketing bandwidth',
      solution: 'Use onboarding sequences, follow-up reminders, and clearer lifecycle messaging',
      results: [
        'Example lifecycle sequence for trial activation',
        'Example onboarding reminders and re-engagement emails',
        'Example internal KPI tracking template',
        'Useful starting point for SaaS teams testing email workflows'
      ],
      quote: 'This page currently uses representative examples to show how a SaaS workflow could be structured inside Bestemail.',
      author: 'Illustrative scenario',
      title: 'Not a published customer quote',
      size: 'Example use case',
      location: 'Demo content'
    },
    {
      company: 'Sample E-commerce Recovery Flow',
      industry: 'ecommerce',
      logo: '🛍️',
      challenge: 'Following up on abandoned carts and repeat-purchase opportunities',
      solution: 'Set up reminder campaigns, post-purchase follow-ups, and simple customer segments',
      results: [
        'Example abandoned-cart sequence structure',
        'Example post-purchase messaging flow',
        'Example audience grouping ideas',
        'Practical reference for store owners testing email basics'
      ],
      quote: 'Think of these examples as templates for what a team might build, not verified performance claims from a live customer base.',
      author: 'Illustrative scenario',
      title: 'Sample workflow',
      size: 'Example use case',
      location: 'Demo content'
    },
    {
      company: 'Sample Services Business Follow-up',
      industry: 'education',
      logo: '📬',
      challenge: 'Staying in touch with leads, customers, or members after signup',
      solution: 'Use scheduled follow-ups, contact segmentation, and basic reporting to keep communication organized',
      results: [
        'Example welcome series outline',
        'Example nurture campaign structure',
        'Example contact tagging approach',
        'Useful reference for service-led teams'
      ],
      quote: 'Bestemail is still early, so this page focuses on realistic workflow examples rather than inflated customer success numbers.',
      author: 'Illustrative scenario',
      title: 'Planning example',
      size: 'Example use case',
      location: 'Demo content'
    }
  ];

  const industries = [
    { id: 'all', label: 'All Examples' },
    { id: 'saas', label: 'SaaS & Software' },
    { id: 'ecommerce', label: 'E-commerce' },
    { id: 'education', label: 'Services & Education' }
  ];

  const filteredCaseStudies = selectedIndustry === 'all'
    ? caseStudies
    : caseStudies.filter((study) => study.industry === selectedIndustry);

  return (
    <div style={pageStyle}>
      <Navigation />

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
            Example workflows, not verified case studies
          </div>

          <h1 style={{
            fontSize: isMobile ? '36px' : '64px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1.1',
            letterSpacing: '-1px'
          }}>
            Example ways teams might use
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Bestemail</span>
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '22px',
            color: '#8b8ba7',
            maxWidth: '760px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            This page currently shows representative scenarios and planning examples.
            It is not intended to imply a large published customer base or verified outcome metrics.
          </p>
        </div>
      </section>

      <section style={{
        padding: '40px 0',
        backgroundColor: '#1a1a2e',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '24px',
            textAlign: 'center'
          }}>
            {[
              { metric: 'Core', desc: 'campaign and contact workflows available' },
              { metric: 'Early', desc: 'public product stage' },
              { metric: 'Planned', desc: 'broader proof and customer stories later' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: '700',
                  marginBottom: '4px',
                  color: '#00B4D8'
                }}>{stat.metric}</div>
                <div style={{
                  fontSize: '14px',
                  color: '#8b8ba7'
                }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0', backgroundColor: '#0f0f1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '8px',
            WebkitOverflowScrolling: 'touch'
          }}>
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelectedIndustry(industry.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '100px',
                  border: selectedIndustry === industry.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: selectedIndustry === industry.id ? '#00B4D8' : 'transparent',
                  color: selectedIndustry === industry.id ? '#ffffff' : '#8b8ba7',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap' as const,
                  flexShrink: 0
                }}
              >
                {industry.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '60px 0' : '100px 0', backgroundColor: '#0f0f1a' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '48px'
          }}>
            {filteredCaseStudies.map((study, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '24px',
                  padding: isMobile ? '32px' : '48px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '48px'
                }}>
                  <div>
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '48px' }}>{study.logo}</span>
                        <div>
                          <h3 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#ffffff',
                            marginBottom: '4px'
                          }}>{study.company}</h3>
                          <p style={{
                            fontSize: '16px',
                            color: '#8b8ba7'
                          }}>{study.size} • {study.location}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#ffffff',
                        marginBottom: '12px'
                      }}>Challenge</h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#8b8ba7',
                        lineHeight: '1.6'
                      }}>{study.challenge}</p>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#ffffff',
                        marginBottom: '12px'
                      }}>Potential Approach</h4>
                      <p style={{
                        fontSize: '16px',
                        color: '#8b8ba7',
                        lineHeight: '1.6'
                      }}>{study.solution}</p>
                    </div>

                    <blockquote style={{
                      borderLeft: '4px solid #00B4D8',
                      paddingLeft: '24px',
                      margin: '0 0 24px 0'
                    }}>
                      <p style={{
                        fontSize: '18px',
                        color: '#ffffff',
                        fontStyle: 'italic',
                        marginBottom: '16px',
                        lineHeight: '1.6',
                        opacity: 0.9
                      }}>&quot;{study.quote}&quot;</p>
                      <footer style={{
                        fontSize: '16px',
                        color: '#8b8ba7'
                      }}>
                        — {study.author}, {study.title}
                      </footer>
                    </blockquote>
                  </div>

                  <div>
                    <div style={{
                      backgroundColor: '#0f0f1a',
                      borderRadius: '16px',
                      padding: '32px',
                      height: '100%',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <h4 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '32px',
                        textAlign: 'center'
                      }}>What this example shows</h4>

                      {study.results.map((result, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '20px',
                            marginBottom: '16px',
                            backgroundColor: 'rgba(0, 180, 216, 0.1)',
                            borderRadius: '12px',
                            borderLeft: '2px solid #00B4D8'
                          }}
                        >
                          <p style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>{result}</p>
                        </div>
                      ))}

                      <div style={{
                        marginTop: '32px',
                        padding: '14px 20px',
                        backgroundColor: 'rgba(0, 180, 216, 0.15)',
                        color: '#48CAE4',
                        textAlign: 'center',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '15px'
                      }}>
                        Customer story pages are not published yet.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
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
            Want to see where the product is today?
          </h2>
          <p style={{
            fontSize: isMobile ? '16px' : '20px',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Try the current product, or get in touch if you want to understand which areas are live and which are still planned.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              backgroundColor: '#ffffff',
              color: '#0077B6',
              padding: isMobile ? '14px 28px' : '16px 32px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              display: 'inline-block',
              transition: 'all 0.3s'
            }}>
              Start Your Free Trial
            </Link>
            <Link href="/contact" style={{
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
            }}>
              Ask About Fit
            </Link>
          </div>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
