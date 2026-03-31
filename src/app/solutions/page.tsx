'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

export default function SolutionsPage() {
  const pageStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const
  };

  const solutions = [
    {
      industry: 'E-commerce',
      icon: '🛍️',
      title: 'Useful email building blocks for online stores',
      description: 'Plan cart reminders, follow-up campaigns, and customer segments with a simpler sending workflow.',
      stats: [
        { metric: 'Common', label: 'cart reminder use case' },
        { metric: 'Core', label: 'campaign workflow focus' },
        { metric: 'Early', label: 'product stage' }
      ],
      features: [
        'Campaign drafting',
        'Contact organization',
        'Basic audience grouping',
        'Reliable email delivery',
        'Follow-up workflow planning',
        'Template-driven outreach'
      ],
      caseStudy: {
        company: 'Illustrative store workflow',
        result: 'Example setup, not a published metric',
        quote: 'This section describes the kind of store workflow a team may want to build. It is not a verified customer case study.'
      }
    },
    {
      industry: 'SaaS',
      icon: '💻',
      title: 'Lifecycle messaging for product-led teams',
      description: 'Use campaigns and contact organization to support onboarding, activation, and product updates.',
      stats: [
        { metric: 'Useful', label: 'for onboarding ideas' },
        { metric: 'Core', label: 'email and contact basics' },
        { metric: 'Planned', label: 'broader automation depth' }
      ],
      features: [
        'Welcome email planning',
        'Campaign scheduling',
        'Contact segmentation basics',
        'Template reuse',
        'Audience cleanup workflows',
        'Dependable delivery workflow'
      ],
      caseStudy: {
        company: 'Illustrative SaaS workflow',
        result: 'Representative scenario only',
        quote: 'Bestemail can be positioned for onboarding and lifecycle email, but this page intentionally avoids inventing customer performance numbers.'
      }
    },
    {
      industry: 'Agencies',
      icon: '🚀',
      title: 'A simpler base for client email operations',
      description: 'Useful for agencies that want cleaner campaign operations, especially where dependable delivery matters.',
      stats: [
        { metric: 'Lean', label: 'workflow positioning' },
        { metric: 'Partial', label: 'advanced features today' },
        { metric: 'Planned', label: 'broader agency tooling' }
      ],
      features: [
        'Campaign management basics',
        'Contact import and organization',
        'Reusable templates',
        'Settings and account controls',
        'Delivery setup support',
        'Early white-label direction'
      ],
      caseStudy: {
        company: 'Illustrative agency setup',
        result: 'Roadmap-oriented positioning',
        quote: 'Agency use cases are part of the direction, but team workflows and white-label depth should still be treated as in progress.'
      }
    },
    {
      industry: 'Creators & newsletters',
      icon: '✨',
      title: 'Straightforward sending for audience updates',
      description: 'Draft newsletters, manage contacts, and send through a simpler interface without pretending to be a giant media platform.',
      stats: [
        { metric: 'Simple', label: 'sending-focused fit' },
        { metric: 'Good', label: 'for early newsletter ops' },
        { metric: 'Planned', label: 'advanced growth tooling' }
      ],
      features: [
        'Newsletter drafting',
        'Contact import',
        'List management basics',
        'Template reuse',
        'Campaign scheduling',
        'Early analytics surfaces'
      ],
      caseStudy: {
        company: 'Illustrative newsletter workflow',
        result: 'Example planning scenario',
        quote: 'This is a realistic fit example, not a promise of monetization outcomes or subscriber growth benchmarks.'
      }
    }
  ];

  return (
    <div style={pageStyle}>
      <Navigation />

      <section style={{
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
        padding: '120px 0 80px',
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
            <span style={{ width: '8px', height: '8px', backgroundColor: '#00B4D8', borderRadius: '50%', display: 'inline-block' }}></span>
            Example solution positioning
          </div>

          <h1 style={{
            fontSize: '72px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1',
            letterSpacing: '-2px'
          }}>
            Email workflows that can
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>fit your business</span>
          </h1>
          <p style={{
            fontSize: '22px',
            color: '#8b8ba7',
            maxWidth: '760px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            These are realistic examples of how Bestemail may fit different teams.
            They are not promises of proven results across thousands of customers.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 0', backgroundColor: '#0f0f1a', flexGrow: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          {solutions.map((solution, index) => (
            <div key={index} style={{ marginBottom: '120px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '80px' }}>
                <div style={{ order: index % 2 === 0 ? 1 : 2 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '48px' }}>{solution.icon}</span>
                    <span style={{ fontSize: '18px', fontWeight: '600', color: '#48CAE4' }}>{solution.industry}</span>
                  </div>

                  <h2 style={{ fontSize: '48px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', lineHeight: '1.1', letterSpacing: '-1px' }}>
                    {solution.title}
                  </h2>

                  <p style={{ fontSize: '18px', color: '#8b8ba7', marginBottom: '32px', lineHeight: '1.6' }}>
                    {solution.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                    {solution.stats.map((stat, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: '#00B4D8', marginBottom: '4px' }}>{stat.metric}</div>
                        <div style={{ fontSize: '14px', color: '#8b8ba7' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Link href="/signup" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)',
                    color: '#ffffff',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 14px 0 rgba(0, 180, 216, 0.3)'
                  }}>
                    Try the Current Build
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>

                <div style={{ order: index % 2 === 0 ? 2 : 1 }}>
                  <div style={{ backgroundColor: '#1a1a2e', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '24px' }}>Current-fit capabilities</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {solution.features.map((feature, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '16px', color: '#8b8ba7' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '12px' }}>
                            <path d="M7 10L9 12L13 8" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="10" cy="10" r="8" stroke="rgba(0,180,216,0.3)" strokeWidth="2"/>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#1a1a2e', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#48CAE4', marginBottom: '8px' }}>ILLUSTRATIVE EXAMPLE</div>
                    <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>{solution.caseStudy.company}</h4>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{solution.caseStudy.result}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '20px', color: '#8b8ba7', fontStyle: 'italic', lineHeight: '1.6' }}>&quot;{solution.caseStudy.quote}&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ fontSize: '64px', marginBottom: '32px' }}>🏢</div>
          <h2 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '24px', letterSpacing: '-1px', color: '#ffffff' }}>
            Need a clearer fit check?
          </h2>
          <p style={{ fontSize: '20px', marginBottom: '48px', color: '#8b8ba7', lineHeight: '1.6' }}>
            If you have a more complex workflow, talk to us first. Some areas are solid today and others are still on the roadmap.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '48px', textAlign: 'left' }}>
            {[
              { icon: '📧', text: 'Campaign sending and setup basics' },
              { icon: '👥', text: 'Contact management workflows' },
              { icon: '🔌', text: 'Integration requirements review' },
              { icon: '🗺️', text: 'Roadmap and feature status clarity' },
              { icon: '🏷️', text: 'Early white-label direction' },
              { icon: '🛠️', text: 'Custom workflow discussion' }
            ].map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <span style={{ fontSize: '16px', color: '#8b8ba7' }}>{item.text}</span>
              </div>
            ))}
          </div>

          <Link href="/contact" style={{
            backgroundColor: '#00B4D8',
            color: '#ffffff',
            padding: '16px 40px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '18px',
            display: 'inline-block',
            transition: 'all 0.3s'
          }}>
            Talk to Us
          </Link>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
