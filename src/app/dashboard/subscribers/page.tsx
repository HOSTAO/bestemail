'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';
import MigrationBanner from '@/components/MigrationBanner';

type TagInfo = {
  id: string;
  name: string;
  color: string;
};

type SubscriberTag = {
  tag_id: string;
  tags: TagInfo;
};

type Subscriber = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  phone?: string;
  source?: string;
  source_url?: string;
  status: string;
  lead_score?: number;
  created_at?: string;
  updated_at?: string;
  subscriber_tags?: SubscriberTag[];
};

type StatusFilter = 'all' | 'active' | 'unsubscribed' | 'bounced' | 'cold';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  active: { bg: '#dcfce7', color: '#16a34a' },
  unsubscribed: { bg: '#fee2e2', color: '#dc2626' },
  bounced: { bg: '#fef3c7', color: '#d97706' },
  complained: { bg: '#fce4ec', color: '#c62828' },
  cold: { bg: '#F3F4F6', color: '#6B7280' },
};

function getInitials(firstName?: string, lastName?: string, email?: string) {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  return (email || '?')[0].toUpperCase();
}

function getAvatarColor(email: string) {
  const hue = (email.charCodeAt(0) * 37) % 360;
  return {
    bg: `hsl(${hue}, 60%, 92%)`,
    color: `hsl(${hue}, 60%, 35%)`,
  };
}

function LeadScoreBar({ score }: { score: number }) {
  const maxScore = 100;
  const pct = Math.min((score / maxScore) * 100, 100);
  const barColor = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#e53e3e';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 60, height: 6, borderRadius: 3, background: '#E0F7FA', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: barColor, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: barColor }}>{score}</span>
    </div>
  );
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sourceFilter, setSourceFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [migrationPending, setMigrationPending] = useState(false);
  const [allTags, setAllTags] = useState<TagInfo[]>([]);
  const [bulkTagId, setBulkTagId] = useState('');
  const router = useRouter();
  const isMobile = useIsMobile();

  const loadSubscribers = async () => {
    try {
      const res = await fetch('/api/subscribers?limit=1000');
      const d = await res.json();
      if (d.migrationRequired) { setMigrationPending(true); setLoading(false); return; }
      if (res.ok) {
        setSubscribers(d.data || []);
      }
    } catch (e) {
      console.error('Failed to load subscribers:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const d = await res.json();
        setAllTags(d.data || []);
      }
    } catch (e) {
      console.error('Failed to load tags:', e);
    }
  };

  useEffect(() => {
    loadSubscribers();
    loadTags();
  }, []);

  const uniqueSources = useMemo(() => {
    const sources = new Set<string>();
    subscribers.forEach(s => { if (s.source) sources.add(s.source); });
    return Array.from(sources).sort();
  }, [subscribers]);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        s.email.toLowerCase().includes(q) ||
        (s.first_name || '').toLowerCase().includes(q) ||
        (s.last_name || '').toLowerCase().includes(q);

      let matchStatus = true;
      if (statusFilter === 'cold') {
        matchStatus = (s.lead_score ?? 0) < 20;
      } else if (statusFilter !== 'all') {
        matchStatus = s.status === statusFilter;
      }

      const matchSource = !sourceFilter || s.source === sourceFilter;

      const matchTag = !tagFilter || (s.subscriber_tags || []).some(st => st.tag_id === tagFilter);

      return matchSearch && matchStatus && matchSource && matchTag;
    });
  }, [subscribers, search, statusFilter, sourceFilter, tagFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: subscribers.length, active: 0, unsubscribed: 0, bounced: 0, cold: 0 };
    subscribers.forEach(s => {
      if (s.status === 'active') counts.active++;
      if (s.status === 'unsubscribed') counts.unsubscribed++;
      if (s.status === 'bounced') counts.bounced++;
      if ((s.lead_score ?? 0) < 20) counts.cold++;
    });
    return counts;
  }, [subscribers]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubscribers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubscribers.map(s => s.id)));
    }
  };

  const bulkAddTag = async () => {
    if (!bulkTagId) { toast.error('Select a tag first'); return; }
    let count = 0;
    for (const sid of selectedIds) {
      try {
        const res = await fetch(`/api/subscribers/${sid}/tags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag_id: bulkTagId }),
        });
        if (res.ok) count++;
      } catch { /* skip */ }
    }
    toast.success(`Tag added to ${count} subscribers`);
    setSelectedIds(new Set());
    setBulkTagId('');
    loadSubscribers();
  };

  const bulkRemoveTag = async () => {
    if (!bulkTagId) { toast.error('Select a tag first'); return; }
    let count = 0;
    for (const sid of selectedIds) {
      try {
        const res = await fetch(`/api/subscribers/${sid}/tags`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tag_id: bulkTagId }),
        });
        if (res.ok) count++;
      } catch { /* skip */ }
    }
    toast.success(`Tag removed from ${count} subscribers`);
    setSelectedIds(new Set());
    setBulkTagId('');
    loadSubscribers();
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} subscribers? This cannot be undone.`)) return;
    let count = 0;
    for (const sid of selectedIds) {
      try {
        const res = await fetch(`/api/subscribers/${sid}`, { method: 'DELETE' });
        if (res.ok) count++;
      } catch { /* skip */ }
    }
    toast.success(`${count} subscribers deleted`);
    setSelectedIds(new Set());
    loadSubscribers();
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
  };

  const inputStyle = {
    width: '100%',
    borderRadius: 8,
    border: '1px solid #E0F7FA',
    padding: '10px 14px',
    fontSize: 14,
    boxSizing: 'border-box' as const,
    outline: 'none',
  };

  const statusTabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'active', label: 'Active', count: statusCounts.active },
    { key: 'unsubscribed', label: 'Unsubscribed', count: statusCounts.unsubscribed },
    { key: 'bounced', label: 'Bounced', count: statusCounts.bounced },
    { key: 'cold', label: 'Cold', count: statusCounts.cold },
  ];

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        Loading subscribers...
      </div>
    );
  }

  if (migrationPending) {
    return <MigrationBanner />;
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Subscribers</h1>
          <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 14 }}>{subscribers.length} total subscribers</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/subscribers/new')}
          style={{
            borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
            padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
          }}
        >
          + Add Subscriber
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{ ...inputStyle, maxWidth: isMobile ? '100%' : 400 }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {statusTabs.map(tab => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                borderRadius: 10,
                border: isActive ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                background: isActive ? '#E0F7FA' : '#fff',
                color: isActive ? '#00B4D8' : '#64648b',
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                minHeight: 40,
              }}
            >
              {tab.label}
              <span style={{
                background: isActive ? '#00B4D8' : '#E0F7FA',
                color: isActive ? '#fff' : '#64648b',
                borderRadius: 8,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 700,
              }}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Source & Tag Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexDirection: isMobile ? 'column' : 'row' }}>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} style={{ ...inputStyle, width: isMobile ? '100%' : 'auto', minWidth: 180 }}>
          <option value="">All sources</option>
          {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)} style={{ ...inputStyle, width: isMobile ? '100%' : 'auto', minWidth: 180 }}>
          <option value="">All tags</option>
          {allTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div style={{
          ...cardStyle,
          padding: '12px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          background: '#E0F7FA',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#00B4D8' }}>
            {selectedIds.size} selected
          </span>
          <select value={bulkTagId} onChange={e => setBulkTagId(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 160, padding: '6px 10px', fontSize: 13 }}>
            <option value="">Select tag...</option>
            {allTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button onClick={bulkAddTag} style={{
            borderRadius: 8, background: '#00B4D8', color: '#fff', border: 'none',
            padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 32,
          }}>Add Tag</button>
          <button onClick={bulkRemoveTag} style={{
            borderRadius: 8, background: '#fff', color: '#00B4D8', border: '1px solid #00B4D8',
            padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 32,
          }}>Remove Tag</button>
          <button onClick={bulkDelete} style={{
            borderRadius: 8, background: '#FFF0F0', color: '#e53e3e', border: '1px solid #FFD5D5',
            padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 32,
          }}>Delete</button>
          <button onClick={() => setSelectedIds(new Set())} style={{
            borderRadius: 8, background: 'transparent', color: '#8b8ba7', border: 'none',
            padding: '6px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>Clear</button>
        </div>
      )}

      {/* Subscribers Table */}
      <div style={cardStyle}>
        {filteredSubscribers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <p style={{ color: '#8b8ba7', fontSize: 15, marginBottom: 8 }}>
              {subscribers.length === 0 ? 'No subscribers yet.' : 'No subscribers match your filters.'}
            </p>
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
                <div style={{ width: 36 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div style={{ width: 44 }} />
                <div style={{ flex: 2, minWidth: 120 }}>Email</div>
                <div style={{ flex: 1.5, minWidth: 100 }}>Name</div>
                <div style={{ flex: 1, minWidth: 80 }}>Company</div>
                <div style={{ flex: 1, minWidth: 70 }}>Source</div>
                <div style={{ flex: 1, minWidth: 80 }}>Lead Score</div>
                <div style={{ flex: 0.7, minWidth: 70 }}>Status</div>
                <div style={{ flex: 1, minWidth: 80 }}>Tags</div>
                <div style={{ flex: 1, minWidth: 80 }}>Last Activity</div>
              </div>
            )}
            {filteredSubscribers.map((sub, i) => {
              const avatar = getAvatarColor(sub.email);
              const tags = (sub.subscriber_tags || []).map(st => st.tags).filter(Boolean);
              const statusStyle = STATUS_STYLES[sub.status] || STATUS_STYLES.active;
              const name = [sub.first_name, sub.last_name].filter(Boolean).join(' ');
              const lastActivity = sub.updated_at || sub.created_at;

              return (
                <div
                  key={sub.id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName === 'INPUT') return;
                    router.push(`/dashboard/subscribers/${sub.id}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    gap: isMobile ? 10 : 0,
                    padding: isMobile ? '14px 16px' : '12px 20px',
                    borderTop: i > 0 ? '1px solid #F0F0F8' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8F9FF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Checkbox */}
                  <div style={{ width: isMobile ? 'auto' : 36, flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sub.id)}
                      onChange={() => toggleSelect(sub.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: avatar.bg,
                    color: avatar.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                  }}>
                    {getInitials(sub.first_name, sub.last_name, sub.email)}
                  </div>

                  {isMobile ? (
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {name || sub.email}
                      </div>
                      <div style={{ fontSize: 12, color: '#8b8ba7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.email}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                          background: statusStyle.bg, color: statusStyle.color,
                        }}>{sub.status}</span>
                        {tags.map(t => (
                          <span key={t.id} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500,
                            background: '#E0F7FA', color: '#00B4D8',
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: 3, background: t.color || '#00B4D8' }} />
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Email */}
                      <div style={{ flex: 2, minWidth: 120, fontSize: 13, color: '#1a1a2e', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                        {sub.email}
                      </div>
                      {/* Name */}
                      <div style={{ flex: 1.5, minWidth: 100, fontSize: 13, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                        {name || '--'}
                      </div>
                      {/* Company */}
                      <div style={{ flex: 1, minWidth: 80, fontSize: 13, color: '#64648b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                        {sub.company || '--'}
                      </div>
                      {/* Source */}
                      <div style={{ flex: 1, minWidth: 70, fontSize: 12, color: '#64648b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                        {sub.source || '--'}
                      </div>
                      {/* Lead Score */}
                      <div style={{ flex: 1, minWidth: 80, paddingRight: 8 }}>
                        <LeadScoreBar score={sub.lead_score ?? 0} />
                      </div>
                      {/* Status */}
                      <div style={{ flex: 0.7, minWidth: 70, paddingRight: 8 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                          background: statusStyle.bg, color: statusStyle.color,
                          textTransform: 'capitalize' as const,
                        }}>{sub.status}</span>
                      </div>
                      {/* Tags */}
                      <div style={{ flex: 1, minWidth: 80, display: 'flex', gap: 4, flexWrap: 'wrap', paddingRight: 8 }}>
                        {tags.length === 0 ? (
                          <span style={{ fontSize: 12, color: '#8b8ba7' }}>--</span>
                        ) : tags.map(t => (
                          <span key={t.id} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500,
                            background: '#E0F7FA', color: '#00B4D8',
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: 3, background: t.color || '#00B4D8' }} />
                            {t.name}
                          </span>
                        ))}
                      </div>
                      {/* Last Activity */}
                      <div style={{ flex: 1, minWidth: 80, fontSize: 12, color: '#8b8ba7' }}>
                        {lastActivity ? new Date(lastActivity).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '--'}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
