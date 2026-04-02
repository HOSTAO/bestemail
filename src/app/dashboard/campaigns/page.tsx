'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

type Campaign = {
  id: string;
  name?: string;
  subject?: string;
  status?: string;
  stats?: { sent?: number; opened?: number; clicked?: number };
  sent_count?: number;
  open_count?: number;
  click_count?: number;
  created_at?: string;
  scheduled_at?: string;
};

type StatusFilter = 'all' | 'draft' | 'sent' | 'scheduled' | 'sending';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#64648b', bg: '#F0F0F8' },
  scheduled: { label: 'Scheduled', color: '#d97706', bg: '#fef3c7' },
  sending: { label: 'Sending', color: '#00B4D8', bg: '#E0F7FA' },
  queued: { label: 'Queued', color: '#00B4D8', bg: '#E0F7FA' },
  sent: { label: 'Sent', color: '#16a34a', bg: '#dcfce7' },
  active: { label: 'Active', color: '#16a34a', bg: '#dcfce7' },
};

export default function CampaignsListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const isMobile = useIsMobile();

  const loadCampaigns = async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const d = await res.json();
        setCampaigns(d.campaigns || d || []);
      }
    } catch (e) {
      console.error('Failed to load campaigns:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCampaigns(); }, []);

  const deleteCampaign = async (id: string, name: string) => {
    if (!confirm(`Delete "${name || 'this email'}"?`)) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        toast.success('Email deleted');
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const duplicateCampaign = async (campaign: Campaign) => {
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (campaign.name || 'Untitled') + ' (Copy)',
          subject: campaign.subject,
          status: 'draft',
        }),
      });
      if (res.ok) {
        toast.success('Email duplicated as draft');
        loadCampaigns();
      }
    } catch {
      toast.error('Failed to duplicate');
    }
  };

  const scheduleCampaign = async () => {
    if (!scheduleId || !scheduleDate || !scheduleTime) return;
    setScheduling(true);
    try {
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      const res = await fetch(`/api/campaigns/${scheduleId}/schedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduled_at: scheduledAt }),
      });
      if (res.ok) {
        toast.success('Campaign scheduled!');
        setScheduleId(null);
        setScheduleDate('');
        setScheduleTime('');
        loadCampaigns();
      } else {
        const j = await res.json();
        toast.error(j.error || 'Failed to schedule');
      }
    } catch {
      toast.error('Failed to schedule');
    }
    setScheduling(false);
  };

  const filtered = campaigns.filter(c => {
    if (filter === 'all') return true;
    const s = (c.status || 'draft').toLowerCase();
    if (filter === 'sent') return s === 'sent' || s === 'active';
    return s === filter;
  });

  const counts = {
    all: campaigns.length,
    draft: campaigns.filter(c => (c.status || 'draft') === 'draft').length,
    sent: campaigns.filter(c => c.status === 'sent' || c.status === 'active').length,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length,
    sending: campaigns.filter(c => c.status === 'sending' || c.status === 'queued').length,
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
  };

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'draft', label: 'Drafts' },
    { key: 'sent', label: 'Sent' },
    { key: 'scheduled', label: 'Scheduled' },
  ];

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #E0F7FA', borderTopColor: '#00B4D8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        Loading your emails...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Your Emails</h1>
          <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 15 }}>{campaigns.length} emails created</p>
        </div>
        <Link href="/dashboard/campaigns/new" style={{
          borderRadius: 12, background: '#00B4D8', color: '#fff', border: 'none',
          padding: '12px 20px', fontSize: 14, fontWeight: 600, textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44,
          width: isMobile ? '100%' : 'auto', justifyContent: 'center',
        }}>
          + Write New Email
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              borderRadius: 10,
              border: filter === tab.key ? '2px solid #00B4D8' : '1px solid #E0F7FA',
              background: filter === tab.key ? '#E0F7FA' : '#fff',
              color: filter === tab.key ? '#00B4D8' : '#64648b',
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              minHeight: 40,
            }}
          >
            {tab.label}
            <span style={{
              background: filter === tab.key ? '#00B4D8' : '#E0F7FA',
              color: filter === tab.key ? '#fff' : '#64648b',
              borderRadius: 8,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
            }}>{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* Campaign List */}
      {filtered.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✉️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
            {campaigns.length === 0 ? 'No emails yet' : 'No emails match this filter'}
          </h2>
          <p style={{ color: '#8b8ba7', fontSize: 15, margin: '0 0 20px' }}>
            {campaigns.length === 0
              ? 'Create your first email to start reaching your customers'
              : 'Try a different filter to find what you are looking for'}
          </p>
          {campaigns.length === 0 && (
            <Link href="/dashboard/campaigns/new" style={{
              display: 'inline-block', borderRadius: 12, background: '#00B4D8', color: '#fff',
              padding: '12px 24px', fontSize: 14, fontWeight: 600, textDecoration: 'none', minHeight: 44,
            }}>
              Write Your First Email
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(campaign => {
            const status = statusConfig[(campaign.status || 'draft').toLowerCase()] || statusConfig.draft;
            const sent = campaign.sent_count ?? campaign.stats?.sent ?? 0;
            const opens = campaign.open_count ?? campaign.stats?.opened ?? 0;
            const clicks = campaign.click_count ?? campaign.stats?.clicked ?? 0;
            const openRate = sent > 0 ? Math.round((opens / sent) * 100) : 0;

            return (
              <div key={campaign.id} style={{ ...cardStyle, padding: isMobile ? 16 : 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 16, color: '#1a1a2e' }}>
                        {campaign.name || campaign.subject || 'Untitled Email'}
                      </span>
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                        background: status.bg, color: status.color,
                      }}>{status.label}</span>
                    </div>
                    {campaign.subject && campaign.subject !== campaign.name && (
                      <div style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 4 }}>
                        Subject: {campaign.subject}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: '#8b8ba7', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      {campaign.scheduled_at && campaign.status === 'scheduled' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#d97706' }}>
                          {' · '}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {new Date(campaign.scheduled_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  {sent > 0 && (
                    <div style={{
                      display: 'flex', gap: isMobile ? 16 : 24, flexShrink: 0,
                      width: isMobile ? '100%' : 'auto', marginTop: isMobile ? 8 : 0,
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>{sent}</div>
                        <div style={{ fontSize: 11, color: '#8b8ba7' }}>Sent</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#00B4D8' }}>{opens}</div>
                        <div style={{ fontSize: 11, color: '#8b8ba7' }}>Opens</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#FF6B6B' }}>{clicks}</div>
                        <div style={{ fontSize: 11, color: '#8b8ba7' }}>Clicks</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: openRate >= 25 ? '#16a34a' : openRate >= 15 ? '#d97706' : '#dc2626' }}>{openRate}%</div>
                        <div style={{ fontSize: 11, color: '#8b8ba7' }}>Open rate</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <Link href={`/dashboard/campaigns/new?id=${campaign.id}`} style={{
                    borderRadius: 8, border: '1px solid #E0F7FA', background: '#fff',
                    padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#00B4D8',
                    textDecoration: 'none', minHeight: 32, display: 'inline-flex', alignItems: 'center',
                  }}>
                    Edit
                  </Link>
                  {(campaign.status === 'draft') && (
                    <button onClick={() => { setScheduleId(campaign.id); setScheduleDate(''); setScheduleTime(''); }} style={{
                      borderRadius: 8, border: '1px solid #fef3c7', background: '#fffbeb',
                      padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#d97706',
                      cursor: 'pointer', minHeight: 32, display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Schedule
                    </button>
                  )}
                  <button onClick={() => duplicateCampaign(campaign)} style={{
                    borderRadius: 8, border: '1px solid #E0F7FA', background: '#fff',
                    padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#64648b',
                    cursor: 'pointer', minHeight: 32,
                  }}>
                    Duplicate
                  </button>
                  <button onClick={() => deleteCampaign(campaign.id, campaign.name || '')} style={{
                    borderRadius: 8, border: '1px solid #FFD5D5', background: '#FFF0F0',
                    padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#e53e3e',
                    cursor: 'pointer', minHeight: 32,
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
        }} onClick={() => setScheduleId(null)}>
          <div style={{
            ...cardStyle, padding: 28, maxWidth: 400, width: '100%',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>Schedule Email</h3>
            <p style={{ fontSize: 13, color: '#8b8ba7', margin: '0 0 20px' }}>
              Choose when to send this email
            </p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Date</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={e => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%', borderRadius: 8, border: '1px solid #E0F7FA',
                  padding: '10px 14px', fontSize: 15, boxSizing: 'border-box', outline: 'none',
                  color: '#1a1a2e', background: '#fff',
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Time</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={e => setScheduleTime(e.target.value)}
                style={{
                  width: '100%', borderRadius: 8, border: '1px solid #E0F7FA',
                  padding: '10px 14px', fontSize: 15, boxSizing: 'border-box', outline: 'none',
                  color: '#1a1a2e', background: '#fff',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={scheduleCampaign}
                disabled={!scheduleDate || !scheduleTime || scheduling}
                style={{
                  flex: 1, borderRadius: 10, background: (!scheduleDate || !scheduleTime) ? '#E0F7FA' : '#00B4D8',
                  color: (!scheduleDate || !scheduleTime) ? '#8b8ba7' : '#fff', border: 'none',
                  padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
                  opacity: scheduling ? 0.6 : 1,
                }}
              >
                {scheduling ? 'Scheduling...' : 'Schedule'}
              </button>
              <button
                onClick={() => setScheduleId(null)}
                style={{
                  borderRadius: 10, background: '#fff', color: '#64648b',
                  border: '1px solid #E0F7FA', padding: '11px 20px', fontSize: 14,
                  fontWeight: 500, cursor: 'pointer', minHeight: 44,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginTop: 24 }}>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Total Emails</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{campaigns.length}</div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#16a34a' }}>Sent</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{counts.sent}</div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#64648b' }}>Drafts</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{counts.draft}</div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706' }}>Scheduled</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{counts.scheduled}</div>
        </div>
      </div>
    </div>
  );
}
