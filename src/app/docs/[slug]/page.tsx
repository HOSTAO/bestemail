import Link from 'next/link';
import Navigation from '@/components/Navigation';
import StandardFooter from '@/components/StandardFooter';
import { articleMeta } from '../shared';

function formatTitle(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function DocsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articleMeta[slug] || {
    title: formatTitle(slug),
    description: 'This documentation page is being finalized. Confirm current implementation status before depending on it in production.',
    category: 'Documentation',
    status: 'Draft',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column' }}>
      <Navigation />

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px 56px' }}>
          <Link href="/docs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#00B4D8', textDecoration: 'none' }}>
            <span>←</span>
            <span>Back to documentation</span>
          </Link>

          <article style={{ marginTop: 20, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', background: '#1a1a2e', padding: '24px 20px' }}>
            <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <span style={{ borderRadius: 999, background: 'rgba(0,180,216,0.15)', padding: '6px 12px', fontWeight: 600, color: '#48CAE4' }}>
                {article.category}
              </span>
              {article.status && (
                <span style={{ borderRadius: 999, background: 'rgba(245,158,11,0.15)', padding: '6px 12px', fontWeight: 600, color: '#f59e0b' }}>
                  {article.status}
                </span>
              )}
            </div>

            <h1 style={{ margin: 0, fontSize: 'clamp(34px, 8vw, 52px)', lineHeight: 1.05, fontWeight: 800, color: '#ffffff' }}>{article.title}</h1>
            <p style={{ margin: '16px 0 0', fontSize: 18, lineHeight: 1.7, color: '#8b8ba7' }}>{article.description}</p>

            <div style={{ marginTop: 24, borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#0f0f1a', padding: '16px 18px', color: '#8b8ba7' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#ffffff' }}>Reality check</p>
              <p style={{ margin: '10px 0 0', lineHeight: 1.7 }}>
                Bestemail is launchable for its core paths only after environment configuration, delivery setup validation,
                and real smoke testing are complete. For anything beyond those core paths, verify current product truth
                before treating the feature as production-ready.
              </p>
            </div>

            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/dashboard/quick-start" style={{ borderRadius: 12, background: '#00B4D8', padding: '12px 18px', fontWeight: 600, color: '#ffffff', textDecoration: 'none' }}>
                Open Quick Start
              </Link>
              <Link href="/dashboard/settings" style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', padding: '12px 18px', fontWeight: 600, color: '#ffffff', textDecoration: 'none' }}>
                Review Settings
              </Link>
            </div>
          </article>
        </div>
      </main>

      <StandardFooter />
    </div>
  );
}
