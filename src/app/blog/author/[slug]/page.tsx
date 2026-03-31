'use client';

import { use, useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';

const AUTHORS = {
  reji:    { name: 'Reji Modiyil',  role: 'Founder & CEO',              initials: 'RM', color: '#4F46E5', slug: 'reji-modiyil',  bio: '25+ years in web tech, hosting, and SaaS. Helping businesses grow with AI, WhatsApp, and email automation.' },
  sherly:  { name: 'Sherly Reji',   role: 'COO & Co-Founder',           initials: 'SR', color: '#f59e0b', slug: 'sherly-reji',   bio: 'Co-founder driving operations and partnerships at Hostao. Passionate about building systems that scale.' },
  vishnu:  { name: 'Vishnu R',      role: 'Managing Director',          initials: 'VR', color: '#6366f1', slug: 'vishnu-r',      bio: 'Managing Director at Hostao with 4K+ LinkedIn followers. Writes about hosting, growth, and digital business.' },
  feby:    { name: 'Feby Hanna',    role: 'Head of Customer Relations', initials: 'FH', color: '#ec4899', slug: 'feby-hanna',    bio: 'Leading customer success at Hostao. Expert in customer experience, retention, and support strategy.' },
  ajith:   { name: 'Ajith T B',     role: 'Tech Enthusiast',            initials: 'AT', color: '#10b981', slug: 'ajith-tb',      bio: 'Problem solver and future-ready tech enthusiast. Writes about hosting infrastructure and technical best practices.' },
  aswathy: { name: 'Aswathy Vikas', role: 'Office Administrator',       initials: 'AV', color: '#14b8a6', slug: 'aswathy-vikas', bio: 'Administrative and HR specialist. Writes about team productivity, business operations, and workplace culture.' },
  athira:  { name: 'Athira S',      role: 'Content Creator',            initials: 'AS', color: '#8b5cf6', slug: 'athira-s',      bio: 'Hosting specialist and WhatsApp marketing content creator. Makes complex topics easy to understand.' },
  anjitha: { name: 'Anjitha Mohan', role: 'Content Specialist',         initials: 'AM', color: '#f97316', slug: 'anjitha-mohan', bio: 'Content specialist covering email marketing, digital tools, and Indian business growth strategies.' },
};

type AuthorKey = keyof typeof AUTHORS;

const POSTS = [
  { slug: '10-email-marketing-tips',    title: '10 Email Marketing Tips for Indian E-commerce',   excerpt: 'Discover the top strategies that Indian e-commerce businesses are using to boost their email marketing ROI and drive more conversions.',                    category: 'Email Marketing', readTime: '5 min read', date: 'March 14, 2026',    author: 'reji'    as AuthorKey, emoji: '🛍️', featured: true },
  { slug: 'dkim-spf-deliverability',    title: 'How to Set Up DKIM/SPF for Better Deliverability', excerpt: 'A step-by-step guide to configuring DKIM, SPF, and DMARC records to ensure your emails land in the inbox every time.',                                 category: 'Deliverability',  readTime: '8 min read', date: 'March 12, 2026',   author: 'vishnu'  as AuthorKey, emoji: '🔒' },
  { slug: 'diwali-email-campaign-ideas',title: 'Diwali Email Campaign Ideas for 2026',             excerpt: 'Get inspired with creative Diwali email campaign ideas that will help you stand out during the festive season and drive sales.',                        category: 'Templates',       readTime: '4 min read', date: 'March 10, 2026',   author: 'athira'  as AuthorKey, emoji: '🪔' },
  { slug: 'getting-started-automation', title: 'Getting Started with Email Automation',             excerpt: 'Learn how to set up your first email automation sequence and start nurturing leads on autopilot from day one.',                                        category: 'Automation',      readTime: '6 min read', date: 'March 8, 2026',    author: 'anjitha' as AuthorKey, emoji: '🔄' },
  { slug: 'indian-businesses-email',    title: 'Why Indian Businesses Need Email Marketing',        excerpt: 'Email marketing delivers the highest ROI of any digital channel. Here is why Indian businesses should prioritize it in their strategy.',               category: 'Indian Business', readTime: '5 min read', date: 'March 6, 2026',    author: 'sherly'  as AuthorKey, emoji: '🇮🇳' },
  { slug: 'ab-testing-guide',           title: 'A/B Testing: The Complete Guide',                  excerpt: 'Master A/B testing for email campaigns. Learn what to test, how to measure results, and how to apply findings for growth.',                              category: 'Growth',          readTime: '7 min read', date: 'March 5, 2026',    author: 'ajith'   as AuthorKey, emoji: '🧪' },
  { slug: 'list-building-strategies',   title: 'Email List Building Strategies That Work',          excerpt: 'Proven tactics to grow your email list organically. From lead magnets to referral programs, these strategies deliver real results.',                    category: 'Growth',          readTime: '6 min read', date: 'March 4, 2026',    author: 'reji'    as AuthorKey, emoji: '📈' },
  { slug: 'understanding-email-analytics',title:'Understanding Email Analytics',                    excerpt: 'Learn how to read and interpret your email analytics dashboard. Understand open rates, click rates, and what they mean for your business.',              category: 'Email Marketing', readTime: '5 min read', date: 'March 3, 2026',    author: 'feby'    as AuthorKey, emoji: '📊' },
  { slug: 'republic-day-templates',     title: 'Republic Day Email Templates and Ideas',            excerpt: 'Celebrate Republic Day with patriotic email templates and campaign ideas that resonate with your Indian audience.',                                      category: 'Templates',       readTime: '4 min read', date: 'March 2, 2026',    author: 'anjitha' as AuthorKey, emoji: '🎉' },
  { slug: 'cold-email-best-practices',  title: 'Cold Email Outreach Best Practices',                excerpt: 'Everything you need to know about cold email outreach — from writing compelling subject lines to following up effectively.',                             category: 'Email Marketing', readTime: '8 min read', date: 'March 1, 2026',    author: 'vishnu'  as AuthorKey, emoji: '📬' },
  { slug: 'gdpr-indian-email-laws',     title: 'GDPR and Indian Email Marketing Laws',              excerpt: 'Navigate the legal landscape of email marketing in India. Understand compliance requirements and protect your business.',                                category: 'Deliverability',  readTime: '7 min read', date: 'February 28, 2026', author: 'aswathy' as AuthorKey, emoji: '⚖️' },
  { slug: 'saas-onboarding-automation', title: 'Automation Sequences for SaaS Onboarding',          excerpt: 'Build effective onboarding email sequences for your SaaS product. Convert trial users into paying customers with automated flows.',                     category: 'Automation',      readTime: '6 min read', date: 'February 26, 2026', author: 'athira'  as AuthorKey, emoji: '🚀' },
];

export default function AuthorPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Find author by slug
  const authorKey = (Object.keys(AUTHORS) as AuthorKey[]).find(
    (k) => AUTHORS[k].slug === params.slug
  );

  if (!authorKey) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', color: '#fff' }}>
        <Navigation />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800 }}>Author not found</h1>
          <a href="/blog" style={{ color: '#4F46E5', textDecoration: 'none', fontSize: '16px' }}>← Back to Blog</a>
        </div>
        <StandardFooter />
      </div>
    );
  }

  const author = AUTHORS[authorKey];
  const authorPosts = POSTS.filter((p) => p.author === authorKey);
  const topics = [...new Set(authorPosts.map((p) => p.category))];
  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column', color: '#fff' }}>
      <Navigation />

      {/* Author Hero */}
      <section style={{ padding: isMobile ? '80px 0 50px' : '120px 0 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Avatar */}
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: author.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            fontWeight: 800,
            color: '#fff',
            margin: '0 auto 20px',
            boxShadow: `0 0 0 4px rgba(255,255,255,0.06), 0 0 32px ${author.color}55`,
          }}>
            {author.initials}
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: isMobile ? '28px' : '36px', fontWeight: 800, lineHeight: 1.2 }}>
            {author.name}
          </h1>
          <p style={{ margin: '0 0 12px', fontSize: '16px', color: '#8b8ba7' }}>{author.role}</p>
          <p style={{ margin: '0 auto 20px', maxWidth: 540, fontSize: '15px', color: '#8b8ba7', lineHeight: 1.7 }}>
            {author.bio}
          </p>
          {/* Social pills */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 999,
                background: 'rgba(29,161,242,0.12)',
                border: '1px solid rgba(29,161,242,0.25)',
                color: '#1da1f2',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              𝕏 Twitter
            </a>
            <a
              href="#"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 18px',
                borderRadius: 999,
                background: 'rgba(10,102,194,0.12)',
                border: '1px solid rgba(10,102,194,0.3)',
                color: '#0a66c2',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              in LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section style={{ padding: '0 0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            gap: 12,
            background: '#1a1a2e',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '16px 24px',
          }}>
            <span style={{ fontSize: '14px', color: '#8b8ba7' }}>
              <strong style={{ color: '#fff', marginRight: 4 }}>{authorPosts.length}</strong>
              articles published
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span style={{ fontSize: '14px', color: '#8b8ba7' }}>
              <strong style={{ color: '#fff', marginRight: 4 }}>Topics:</strong>
              {topics.join(', ')}
            </span>
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section style={{ padding: '0 0 80px', flexGrow: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ margin: '0 0 28px', fontSize: '22px', fontWeight: 700, color: '#fff' }}>
            Articles by {author.name}
          </h2>
          {authorPosts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: gridColumns, gap: 24 }}>
              {authorPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}
                >
                  <div style={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,180,216,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    {/* Emoji header */}
                    <div style={{
                      height: 120,
                      background: 'linear-gradient(135deg, #0d0d1f 0%, #1a1a3e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 48,
                      flexShrink: 0,
                    }}>
                      {post.emoji}
                    </div>
                    {/* Content */}
                    <div style={{ padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 999,
                        background: 'rgba(79,70,229,0.15)',
                        color: '#48CAE4',
                        fontSize: '11px',
                        fontWeight: 600,
                        marginBottom: 12,
                        alignSelf: 'flex-start',
                      }}>
                        {post.category}
                      </span>
                      <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p style={{
                        margin: '0 0 16px',
                        fontSize: '13px',
                        color: '#8b8ba7',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                        flex: 1,
                      }}>
                        {post.excerpt}
                      </p>
                      <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        paddingTop: 12,
                        marginTop: 'auto',
                        fontSize: '12px',
                        color: '#8b8ba7',
                      }}>
                        {post.date} · {post.readTime}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: '#8b8ba7' }}>No articles yet.</p>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #0f1a2e 100%)',
            border: '1px solid rgba(0,180,216,0.2)',
            borderRadius: 20,
            padding: isMobile ? '32px 24px' : '48px',
            textAlign: 'center',
          }}>
            <h2 style={{ margin: '0 0 12px', fontSize: isMobile ? '22px' : '28px', fontWeight: 800 }}>
              Subscribe to get notified of new articles
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: '15px', color: '#8b8ba7' }}>
              Get the latest posts from {author.name} delivered straight to your inbox.
            </p>
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0f0f1a',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                  width: isMobile ? '100%' : 300,
                  boxSizing: 'border-box',
                }}
              />
              <button
                style={{
                  padding: '12px 28px',
                  borderRadius: 12,
                  border: 'none',
                  background: '#4F46E5',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
