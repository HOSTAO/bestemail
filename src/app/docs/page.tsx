'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';
import { documentation, popularArticles } from './shared';

type DocArticleWithCategory = {
  slug: string;
  title: string;
  time: string;
  desc: string;
  category?: string;
  categoryKey?: string;
};

export default function DocumentationPage() {
  const [selectedCategory, setSelectedCategory] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');
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

  const allArticles = Object.entries(documentation).flatMap(([category, data]) =>
    data.articles.map((article) => ({
      ...article,
      category: data.title,
      categoryKey: category
    }))
  );

  const filteredArticles: DocArticleWithCategory[] = searchTerm
    ? allArticles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.desc.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : (documentation[selectedCategory as keyof typeof documentation]?.articles || []);

  const popularArticleCards = popularArticles
    .map((slug) => allArticles.find((article) => article.slug === slug))
    .filter(Boolean) as DocArticleWithCategory[];

  return (
    <div style={pageStyle}>
      <Navigation />

      <section style={{
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
        padding: isMobile ? '60px 0 40px' : '100px 0 60px',
        color: '#ffffff'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: isMobile ? '36px' : '56px', fontWeight: '700', marginBottom: '24px', lineHeight: '1.1', letterSpacing: '-1px', textAlign: 'center', color: '#ffffff' }}>
            Documentation
          </h1>
          <p style={{ fontSize: isMobile ? '16px' : '20px', maxWidth: '760px', margin: '0 auto 40px', textAlign: 'center', color: '#8b8ba7' }}>
            A guide to the current build, with clearer notes on what is available now versus what is still planned or partial.
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 48px 16px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                backdropFilter: 'blur(10px)'
              }}
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#8b8ba7' }}>
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {!searchTerm && selectedCategory === 'getting-started' && (
        <section style={{ padding: '40px 0', backgroundColor: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' }}>Start Here</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {popularArticleCards.map((article) => (
                <Link
                  key={article.slug}
                  href={`/docs/${article.slug}`}
                  style={{
                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: '1px solid rgba(0, 180, 216, 0.3)',
                    color: '#48CAE4',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📄</span>
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: isMobile ? '40px 0' : '60px 0', backgroundColor: '#0f0f1a', flexGrow: 1 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: isMobile ? '24px' : '48px' }}>
            {!isMobile && (
              <div>
                <nav>
                  {Object.entries(documentation).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 16px',
                        marginBottom: '4px',
                        backgroundColor: selectedCategory === key ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        color: selectedCategory === key ? '#48CAE4' : '#8b8ba7',
                        fontSize: '15px',
                        fontWeight: selectedCategory === key ? '600' : '500',
                        textAlign: 'left' as const,
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{category.icon}</span>
                      {category.title}
                    </button>
                  ))}
                </nav>
              </div>
            )}

            {isMobile && !searchTerm && (
              <div>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '16px', backgroundColor: '#1a1a2e', color: '#ffffff', cursor: 'pointer' }}>
                  {Object.entries(documentation).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              {searchTerm && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>Search Results</h2>
                  <p style={{ fontSize: '16px', color: '#8b8ba7' }}>
                    Found {filteredArticles.length} articles matching &quot;{searchTerm}&quot;
                  </p>
                </div>
              )}

              {!searchTerm && (
                <h2 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#ffffff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: isMobile ? '28px' : '32px' }}>{documentation[selectedCategory as keyof typeof documentation]?.icon}</span>
                  {documentation[selectedCategory as keyof typeof documentation]?.title}
                </h2>
              )}

              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/docs/${article.slug}`}
                    style={{
                      backgroundColor: '#1a1a2e',
                      borderRadius: '16px',
                      padding: isMobile ? '18px' : '24px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textDecoration: 'none',
                      display: 'block',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>{article.title}</h3>
                        <p style={{ fontSize: '15px', color: '#8b8ba7', lineHeight: '1.6' }}>{article.desc}</p>
                        {searchTerm && article.category && (
                          <p style={{ fontSize: '14px', color: '#8b8ba7', marginTop: '8px', opacity: 0.7 }}>in {article.category}</p>
                        )}
                      </div>
                      <div style={{ fontSize: '14px', color: '#8b8ba7', flexShrink: 0 }}>{article.time}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredArticles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8b8ba7' }}>
                  <p>No articles found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: isMobile ? '60px 0' : '80px 0', backgroundColor: '#1a1a2e', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
          <h2 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }}>
            Need clarification on what is live?
          </h2>
          <p style={{ fontSize: isMobile ? '16px' : '18px', color: '#8b8ba7', marginBottom: '32px' }}>
            Ask before relying on roadmap-style areas for production use.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ padding: isMobile ? '14px 28px' : '16px 32px', backgroundColor: '#00B4D8', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '16px', display: 'inline-block' }}>
              Contact Support
            </Link>
            <Link href="/integrations" style={{ padding: isMobile ? '12px 26px' : '14px 30px', backgroundColor: 'transparent', border: '2px solid #00B4D8', color: '#48CAE4', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '16px', display: 'inline-block' }}>
              View Integration Status
            </Link>
          </div>
        </div>
      </section>

      <StandardFooter />
    </div>
  );
}
