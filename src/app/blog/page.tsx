'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const categories = ['All', 'Email Marketing', 'Automation', 'Deliverability', 'Templates', 'Growth', 'Indian Business'];

const blogPosts = [
  {
    title: '10 Email Marketing Tips for Indian E-commerce',
    excerpt: 'Discover the top strategies that Indian e-commerce businesses are using to boost their email marketing ROI and drive more conversions.',
    category: 'Email Marketing',
    readTime: '5 min read',
    date: 'March 14, 2026',
  },
  {
    title: 'How to Set Up DKIM/SPF for Better Deliverability',
    excerpt: 'A step-by-step guide to configuring DKIM, SPF, and DMARC records to ensure your emails land in the inbox every time.',
    category: 'Deliverability',
    readTime: '8 min read',
    date: 'March 12, 2026',
  },
  {
    title: 'Diwali Email Campaign Ideas for 2026',
    excerpt: 'Get inspired with creative Diwali email campaign ideas that will help you stand out during the festive season and drive sales.',
    category: 'Templates',
    readTime: '4 min read',
    date: 'March 10, 2026',
  },
  {
    title: 'Getting Started with Email Automation',
    excerpt: 'Learn how to set up your first email automation sequence and start nurturing leads on autopilot from day one.',
    category: 'Automation',
    readTime: '6 min read',
    date: 'March 8, 2026',
  },
  {
    title: 'Why Indian Businesses Need Email Marketing',
    excerpt: 'Email marketing delivers the highest ROI of any digital channel. Here is why Indian businesses should prioritize it in their strategy.',
    category: 'Indian Business',
    readTime: '5 min read',
    date: 'March 6, 2026',
  },
  {
    title: 'A/B Testing: The Complete Guide',
    excerpt: 'Master A/B testing for email campaigns. Learn what to test, how to measure results, and how to apply findings for growth.',
    category: 'Growth',
    readTime: '7 min read',
    date: 'March 5, 2026',
  },
  {
    title: 'Email List Building Strategies That Work',
    excerpt: 'Proven tactics to grow your email list organically. From lead magnets to referral programs, these strategies deliver real results.',
    category: 'Growth',
    readTime: '6 min read',
    date: 'March 4, 2026',
  },
  {
    title: 'Understanding Email Analytics',
    excerpt: 'Learn how to read and interpret your email analytics dashboard. Understand open rates, click rates, and what they mean for your business.',
    category: 'Email Marketing',
    readTime: '5 min read',
    date: 'March 3, 2026',
  },
  {
    title: 'Republic Day Email Templates and Ideas',
    excerpt: 'Celebrate Republic Day with patriotic email templates and campaign ideas that resonate with your Indian audience.',
    category: 'Templates',
    readTime: '4 min read',
    date: 'March 2, 2026',
  },
  {
    title: 'Cold Email Outreach Best Practices',
    excerpt: 'Everything you need to know about cold email outreach — from writing compelling subject lines to following up effectively.',
    category: 'Email Marketing',
    readTime: '8 min read',
    date: 'March 1, 2026',
  },
  {
    title: 'GDPR and Indian Email Marketing Laws',
    excerpt: 'Navigate the legal landscape of email marketing in India. Understand compliance requirements and protect your business.',
    category: 'Deliverability',
    readTime: '7 min read',
    date: 'February 28, 2026',
  },
  {
    title: 'Automation Sequences for SaaS Onboarding',
    excerpt: 'Build effective onboarding email sequences for your SaaS product. Convert trial users into paying customers with automated flows.',
    category: 'Automation',
    readTime: '6 min read',
    date: 'February 26, 2026',
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((post) => post.category === activeCategory);

  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
      <Navigation />

      {/* Hero */}
      <section style={{
        padding: isMobile ? '80px 0 50px' : '120px 0 80px',
        textAlign: 'center',
        background: '#0f0f1a',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{
            margin: '0 0 20px',
            fontSize: isMobile ? '32px' : '42px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
          }}>
            Blog
          </h1>
          <p style={{
            margin: '0 auto',
            maxWidth: 640,
            fontSize: isMobile ? '16px' : '18px',
            color: '#8b8ba7',
            lineHeight: 1.7,
          }}>
            Tips, guides, and insights on email marketing for Indian businesses
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{
        padding: '0 0 40px',
        background: '#0f0f1a',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: 10,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch' as any,
          paddingBottom: 8,
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: activeCategory === cat ? '#00B4D8' : 'transparent',
                color: activeCategory === cat ? '#ffffff' : '#8b8ba7',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section style={{
        padding: isMobile ? '0 0 60px' : '0 0 80px',
        background: '#0f0f1a',
        flexGrow: 1,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: 24,
          }}>
            {filteredPosts.map((post, idx) => (
              <a
                key={idx}
                href="#"
                style={{ textDecoration: 'none', color: 'inherit' }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget.firstElementChild as HTMLElement;
                  if (card) card.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget.firstElementChild as HTMLElement;
                  if (card) card.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 24,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                }}>
                  {/* Category badge */}
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 999,
                    background: 'rgba(0, 180, 216, 0.15)',
                    color: '#48CAE4',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: 16,
                    alignSelf: 'flex-start',
                  }}>
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    margin: '0 0 10px',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.4,
                  }}>
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p style={{
                    margin: '0 0 20px',
                    fontSize: '14px',
                    color: '#8b8ba7',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flexGrow: 1,
                  }}>
                    {post.excerpt}
                  </p>

                  {/* Bottom row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: 16,
                  }}>
                    <span style={{ fontSize: '13px', color: '#8b8ba7' }}>
                      {post.date} {'\u00B7'} {post.readTime}
                    </span>
                    <span style={{ fontSize: '14px', color: '#00B4D8', fontWeight: 600 }}>
                      Read more {'\u2192'}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '16px', color: '#8b8ba7' }}>No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
