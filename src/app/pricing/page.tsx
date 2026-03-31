'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [windowWidth, setWindowWidth] = useState(1200);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const plans = [
    {
      name: 'Starter',
      tagline: 'Perfect for small businesses getting started',
      monthlyPrice: 1999,
      annualPrice: 1599,
      annualTotal: '19,188',
      popular: false,
      features: [
        'Up to 2,500 subscribers',
        '10,000 emails/month',
        'Email campaigns',
        'Basic templates',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      name: 'Growth',
      tagline: 'For growing businesses that need more power',
      monthlyPrice: 5499,
      annualPrice: 4399,
      annualTotal: '52,788',
      popular: true,
      features: [
        'Up to 10,000 subscribers',
        '50,000 emails/month',
        'Everything in Starter',
        'Automation sequences',
        'Advanced analytics',
        'Priority support',
        'A/B testing',
        'Custom templates',
      ],
    },
    {
      name: 'Enterprise',
      tagline: 'For large teams with advanced needs',
      monthlyPrice: 14999,
      annualPrice: 11999,
      annualTotal: '1,43,988',
      popular: false,
      features: [
        'Up to 25,000 subscribers',
        '150,000 emails/month',
        'Everything in Growth',
        'Cold outreach',
        'Dedicated IP',
        'Team management',
        'API access',
        'Custom integrations',
        'Phone support',
      ],
    },
  ];

  const featureComparison = [
    { category: 'Email', features: [
      { name: 'Email campaigns', starter: true, growth: true, enterprise: true },
      { name: 'Subscribers', starter: '2,500', growth: '10,000', enterprise: '25,000' },
      { name: 'Emails per month', starter: '10,000', growth: '50,000', enterprise: '150,000' },
      { name: 'Basic templates', starter: true, growth: true, enterprise: true },
      { name: 'Custom templates', starter: false, growth: true, enterprise: true },
      { name: 'Email scheduling', starter: true, growth: true, enterprise: true },
    ]},
    { category: 'Automation', features: [
      { name: 'Automation sequences', starter: false, growth: true, enterprise: true },
      { name: 'Cold outreach', starter: false, growth: false, enterprise: true },
      { name: 'A/B testing', starter: false, growth: true, enterprise: true },
      { name: 'Drip campaigns', starter: false, growth: true, enterprise: true },
    ]},
    { category: 'Analytics', features: [
      { name: 'Basic analytics', starter: true, growth: true, enterprise: true },
      { name: 'Advanced analytics', starter: false, growth: true, enterprise: true },
      { name: 'Custom reports', starter: false, growth: false, enterprise: true },
    ]},
    { category: 'Support', features: [
      { name: 'Email support', starter: true, growth: true, enterprise: true },
      { name: 'Priority support', starter: false, growth: true, enterprise: true },
      { name: 'Phone support', starter: false, growth: false, enterprise: true },
      { name: 'Dedicated account manager', starter: false, growth: false, enterprise: true },
    ]},
    { category: 'Advanced', features: [
      { name: 'API access', starter: false, growth: false, enterprise: true },
      { name: 'Custom integrations', starter: false, growth: false, enterprise: true },
      { name: 'Dedicated IP', starter: false, growth: false, enterprise: true },
      { name: 'Team management', starter: false, growth: false, enterprise: true },
    ]},
  ];

  const faqs = [
    { question: 'Can I try before I buy?', answer: 'Yes, all plans come with a 14-day free trial. No credit card required.' },
    { question: 'How does billing work?', answer: 'We bill monthly or annually via Razorpay. You can pay with UPI, cards, net banking, or wallets.' },
    { question: 'Can I change my plan later?', answer: 'Yes, upgrade or downgrade anytime. Changes take effect on your next billing cycle.' },
    { question: 'What happens when I exceed my subscriber limit?', answer: "We'll notify you and suggest upgrading. Your campaigns won't be interrupted immediately." },
    { question: 'Do you offer refunds?', answer: 'Yes, we offer a 7-day money-back guarantee for new subscribers. See our refund policy for details.' },
    { question: 'Is there a setup fee?', answer: 'No. Zero setup fees, zero hidden charges.' },
    { question: 'Do you charge GST?', answer: 'Yes, 18% GST is applicable on all plans as per Indian tax regulations.' },
    { question: 'Can I cancel anytime?', answer: 'Yes, cancel from your dashboard anytime. Access continues until the end of your billing period.' },
  ];

  const formatPrice = (price: number) => {
    return '\u20B9' + price.toLocaleString('en-IN');
  };

  const renderCellValue = (value: boolean | string) => {
    if (typeof value === 'string') {
      return <span style={{ color: '#ffffff', fontSize: '14px' }}>{value}</span>;
    }
    if (value) {
      return <span style={{ color: '#10b981', fontSize: '18px', fontWeight: '700' }}>&#10003;</span>;
    }
    return <span style={{ color: '#8b8ba7', fontSize: '18px' }}>&mdash;</span>;
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      display: 'flex',
      flexDirection: 'column' as const,
      color: '#ffffff',
    }}>
      <Navigation />

      {/* Hero */}
      <section style={{
        padding: isMobile ? '80px 0 40px' : '120px 0 60px',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{
            fontSize: isMobile ? '32px' : '42px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
            lineHeight: '1.2',
          }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            color: '#8b8ba7',
            marginBottom: '40px',
            maxWidth: '500px',
            margin: '0 auto 40px',
          }}>
            No hidden fees. Start free, upgrade when you&apos;re ready.
          </p>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <span style={{
              fontSize: '15px',
              color: billingCycle === 'monthly' ? '#ffffff' : '#8b8ba7',
              fontWeight: billingCycle === 'monthly' ? '600' : '400',
            }}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              style={{
                width: '56px',
                height: '30px',
                borderRadius: '15px',
                border: 'none',
                backgroundColor: billingCycle === 'annual' ? '#00B4D8' : '#333',
                position: 'relative' as const,
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                padding: 0,
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute' as const,
                top: '3px',
                left: billingCycle === 'annual' ? '29px' : '3px',
                transition: 'left 0.3s',
              }} />
            </button>
            <span style={{
              fontSize: '15px',
              color: billingCycle === 'annual' ? '#ffffff' : '#8b8ba7',
              fontWeight: billingCycle === 'annual' ? '600' : '400',
            }}>Annual</span>
          </div>

          {billingCycle === 'annual' && (
            <p style={{
              fontSize: '14px',
              color: '#10b981',
              marginTop: '12px',
              fontWeight: '500',
            }}>
              Save 20% with annual billing
            </p>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section style={{
        padding: isMobile ? '20px 0 60px' : '20px 0 80px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '24px' : '28px',
            maxWidth: isMobile ? '420px' : 'none',
            margin: '0 auto',
          }}>
            {plans.map((plan, index) => {
              const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={index}
                  style={{
                    position: 'relative' as const,
                    backgroundColor: '#1a1a2e',
                    borderRadius: '16px',
                    padding: isMobile ? '32px 24px' : '40px',
                    border: plan.popular
                      ? '2px solid #00B4D8'
                      : '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 0.3s',
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute' as const,
                      top: '-14px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#00B4D8',
                      color: '#ffffff',
                      padding: '5px 18px',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap' as const,
                    }}>
                      Most Popular
                    </div>
                  )}

                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}>{plan.name}</h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#8b8ba7',
                    marginBottom: '24px',
                    lineHeight: '1.5',
                  }}>{plan.tagline}</p>

                  <div style={{ marginBottom: '8px' }}>
                    {billingCycle === 'annual' && (
                      <span style={{
                        fontSize: '18px',
                        color: '#8b8ba7',
                        textDecoration: 'line-through',
                        marginRight: '10px',
                      }}>
                        {formatPrice(plan.monthlyPrice)}
                      </span>
                    )}
                  </div>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'baseline' }}>
                    <span style={{
                      fontSize: isMobile ? '40px' : '48px',
                      fontWeight: '700',
                      color: '#ffffff',
                      lineHeight: '1',
                    }}>
                      {formatPrice(price)}
                    </span>
                    <span style={{
                      fontSize: '16px',
                      color: '#8b8ba7',
                      marginLeft: '6px',
                    }}>/mo</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p style={{
                      fontSize: '13px',
                      color: '#8b8ba7',
                      marginBottom: '28px',
                      marginTop: '4px',
                    }}>
                      Billed annually at &#8377;{plan.annualTotal}/yr
                    </p>
                  )}
                  {billingCycle === 'monthly' && (
                    <div style={{ marginBottom: '28px', marginTop: '4px' }} />
                  )}

                  <Link
                    href="/signup"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center' as const,
                      padding: '14px 24px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '15px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginBottom: '28px',
                      boxSizing: 'border-box' as const,
                      ...(plan.popular ? {
                        backgroundColor: '#00B4D8',
                        color: '#ffffff',
                      } : {
                        backgroundColor: 'transparent',
                        color: '#00B4D8',
                        border: '1px solid #00B4D8',
                      }),
                    }}
                  >
                    Start Free Trial
                  </Link>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {plan.features.map((feature, i) => (
                      <li key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '14px',
                        color: '#ffffff',
                        fontSize: '14px',
                      }}>
                        <span style={{
                          color: '#10b981',
                          marginRight: '12px',
                          fontSize: '16px',
                          fontWeight: '700',
                          flexShrink: 0,
                        }}>&#10003;</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p style={{
            textAlign: 'center' as const,
            color: '#8b8ba7',
            fontSize: '14px',
            marginTop: '32px',
          }}>
            All plans include 14-day free trial
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={{
        padding: isMobile ? '40px 0' : '80px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center' as const,
            marginBottom: isMobile ? '32px' : '48px',
          }}>
            Feature Comparison
          </h2>

          <div style={{ overflowX: 'auto' as const }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse' as const,
              minWidth: '600px',
            }}>
              <thead>
                <tr>
                  <th style={{
                    textAlign: 'left' as const,
                    padding: '16px 20px',
                    color: '#8b8ba7',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    width: '40%',
                  }}>Feature</th>
                  <th style={{
                    textAlign: 'center' as const,
                    padding: '16px 20px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    width: '20%',
                  }}>Starter</th>
                  <th style={{
                    textAlign: 'center' as const,
                    padding: '16px 20px',
                    color: '#00B4D8',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    width: '20%',
                  }}>Growth</th>
                  <th style={{
                    textAlign: 'center' as const,
                    padding: '16px 20px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    width: '20%',
                  }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((cat) => (
                  <>
                    <tr key={`cat-${cat.category}`}>
                      <td colSpan={4} style={{
                        padding: '16px 20px 8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '700',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '1px',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                      }}>{cat.category}</td>
                    </tr>
                    {cat.features.map((feature, fi) => (
                      <tr key={`${cat.category}-${fi}`} style={{
                        backgroundColor: fi % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      }}>
                        <td style={{
                          padding: '14px 20px',
                          color: '#8b8ba7',
                          fontSize: '14px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}>{feature.name}</td>
                        <td style={{
                          padding: '14px 20px',
                          textAlign: 'center' as const,
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}>{renderCellValue(feature.starter)}</td>
                        <td style={{
                          padding: '14px 20px',
                          textAlign: 'center' as const,
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}>{renderCellValue(feature.growth)}</td>
                        <td style={{
                          padding: '14px 20px',
                          textAlign: 'center' as const,
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}>{renderCellValue(feature.enterprise)}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section style={{
        padding: isMobile ? '40px 0' : '60px 0',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            color: '#8b8ba7',
            marginBottom: '28px',
          }}>
            Secure payments powered by Razorpay
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '12px' : '20px',
            flexWrap: 'wrap' as const,
            marginBottom: '24px',
          }}>
            {['UPI', 'Credit/Debit Cards', 'Net Banking', 'Wallets'].map((method) => (
              <div key={method} style={{
                backgroundColor: '#1a1a2e',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: isMobile ? '10px 16px' : '12px 24px',
                fontSize: isMobile ? '13px' : '14px',
                color: '#ffffff',
                fontWeight: '500',
              }}>
                {method}
              </div>
            ))}
          </div>

          <p style={{
            fontSize: '13px',
            color: '#8b8ba7',
            marginBottom: '16px',
          }}>
            PCI DSS Compliant &middot; 256-bit SSL Encryption
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            padding: '8px 18px',
            fontSize: '13px',
            color: '#8b8ba7',
          }}>
            <span style={{ fontSize: '16px' }}>&#x1f6e1;</span>
            Powered by Razorpay
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: isMobile ? '40px 0 60px' : '80px 0',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center' as const,
            marginBottom: isMobile ? '32px' : '48px',
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '12px' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    padding: isMobile ? '18px 20px' : '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                  }}
                >
                  <span style={{
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    paddingRight: '16px',
                  }}>{faq.question}</span>
                  <span style={{
                    fontSize: '20px',
                    color: '#00B4D8',
                    fontWeight: '300',
                    flexShrink: 0,
                    transform: openFaq === index ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                    lineHeight: '1',
                  }}>+</span>
                </button>
                <div style={{
                  maxHeight: openFaq === index ? '200px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}>
                  <p style={{
                    padding: isMobile ? '0 20px 18px' : '0 24px 20px',
                    fontSize: isMobile ? '14px' : '15px',
                    color: '#8b8ba7',
                    lineHeight: '1.7',
                    margin: 0,
                  }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: isMobile ? '48px 0' : '64px 0',
        textAlign: 'center' as const,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{
            fontSize: isMobile ? '24px' : '30px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16px',
          }}>
            Still have questions?
          </h2>
          <Link href="/contact" style={{
            display: 'inline-block',
            backgroundColor: '#00B4D8',
            color: '#ffffff',
            padding: '14px 36px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'background-color 0.2s',
          }}>
            Talk to our team
          </Link>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
