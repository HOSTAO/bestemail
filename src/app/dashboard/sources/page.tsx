'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import MigrationBanner from '@/components/MigrationBanner';

type SourceData = {
  source: string;
  subscriber_count: number;
  recent_tags: string[];
  last_capture_at: string | null;
};

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const loadSources = async () => {
    try {
      const res = await fetch('/api/sources');
      const d = await res.json();
      if (d.migrationRequired) { setMigrationPending(true); setLoading(false); return; }
      if (res.ok) {
        setSources(d.data || []);
      }
    } catch (e) {
      console.error('Failed to load sources:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSources(); }, []);

  const totalSources = sources.length;
  const totalSubscribers = sources.reduce((sum, s) => sum + s.subscriber_count, 0);
  const mostActive = sources.length > 0
    ? sources.reduce((max, s) => s.subscriber_count > max.subscriber_count ? s : max, sources[0])
    : null;

  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        Loading sources...
      </div>
    );
  }

  if (migrationPending) {
    return <MigrationBanner />;
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Sources</h1>
        <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 14 }}>Track where your subscribers come from</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ ...cardStyle, padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7', fontWeight: 500 }}>Total Sources</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginTop: 4 }}>{totalSources}</div>
        </div>
        <div style={{ ...cardStyle, padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7', fontWeight: 500 }}>Total Subscribers</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#00B4D8', marginTop: 4 }}>{totalSubscribers}</div>
        </div>
        <div style={{ ...cardStyle, padding: '18px 20px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7', fontWeight: 500 }}>Most Active Source</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {mostActive ? mostActive.source : '--'}
          </div>
          {mostActive && (
            <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 2 }}>{mostActive.subscriber_count} subscribers</div>
          )}
        </div>
      </div>

      {/* Sources Table */}
      <div style={cardStyle}>
        {sources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <p style={{ color: '#8b8ba7', fontSize: 15 }}>No sources tracked yet. Subscribers will appear here once they are added with a source.</p>
          </div>
        ) : (
          <div>
            {/* Table Header */}
            {!isMobile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                borderBottom: '1px solid #E0F7FA',
                background: '#F8F9FF',
                borderRadius: '16px 16px 0 0',
                fontSize: 11,
                fontWeight: 700,
                color: '#8b8ba7',
                textTransform: 'uppercase' as const,
                letterSpacing: 0.5,
              }}>
                <div style={{ flex: 2, minWidth: 140 }}>Source Domain</div>
                <div style={{ flex: 1, minWidth: 100, textAlign: 'center' }}>Subscribers</div>
                <div style={{ flex: 2, minWidth: 140 }}>Most Common Tags</div>
                <div style={{ flex: 1, minWidth: 120 }}>Last Capture</div>
              </div>
            )}

            {sources.map((source, i) => (
              <div
                key={source.source}
                onClick={() => router.push(`/dashboard/subscribers?source=${encodeURIComponent(source.source)}`)}
                style={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? 8 : 0,
                  padding: isMobile ? '14px 16px' : '14px 20px',
                  borderTop: i > 0 ? '1px solid #F0F0F8' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  flexDirection: isMobile ? 'column' : 'row',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F8F9FF')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {isMobile ? (
                  <>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#00B4D8' }}>{source.source}</div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 13, color: '#8b8ba7', marginTop: 4 }}>
                      <span><strong style={{ color: '#1a1a2e' }}>{source.subscriber_count}</strong> subscribers</span>
                      {source.last_capture_at && (
                        <span>Last: {new Date(source.last_capture_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      )}
                    </div>
                    {source.recent_tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        {source.recent_tags.map(tag => (
                          <span key={tag} style={{
                            padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 500,
                            background: '#E0F7FA', color: '#00B4D8',
                          }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Source Domain */}
                    <div style={{ flex: 2, minWidth: 140, fontSize: 14, fontWeight: 600, color: '#00B4D8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                      {source.source}
                    </div>
                    {/* Subscribers Count */}
                    <div style={{ flex: 1, minWidth: 100, textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                        background: '#E0F7FA', color: '#00B4D8',
                      }}>{source.subscriber_count}</span>
                    </div>
                    {/* Tags */}
                    <div style={{ flex: 2, minWidth: 140, display: 'flex', gap: 6, flexWrap: 'wrap', paddingRight: 12 }}>
                      {source.recent_tags.length === 0 ? (
                        <span style={{ fontSize: 12, color: '#8b8ba7' }}>--</span>
                      ) : source.recent_tags.map(tag => (
                        <span key={tag} style={{
                          padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 500,
                          background: '#E0F7FA', color: '#00B4D8',
                        }}>{tag}</span>
                      ))}
                    </div>
                    {/* Last Capture */}
                    <div style={{ flex: 1, minWidth: 120, fontSize: 13, color: '#8b8ba7' }}>
                      {source.last_capture_at
                        ? new Date(source.last_capture_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '--'}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
