'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import MigrationBanner from '@/components/MigrationBanner';

type ColdCampaign = {
  id: string;
  name: string;
  from_name: string;
  from_email: string;
  status: string;
  daily_limit: number;
  sent_count: number;
  reply_count: number;
  open_count: number;
  created_at: string;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#10b981', bg: '#ecfdf5' },
  paused: { label: 'Paused', color: '#64648b', bg: '#F0F0F8' },
};

export default function ColdOutreachPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<ColdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [creating, setCreating] = useState(false);

  const loadCampaigns = async () => {
    try {
      const res = await fetch('/api/cold-outreach');
      const data = await res.json();
      if (data.migrationRequired) { setMigrationPending(true); setLoading(false); return; }
      if (res.ok) {
        setCampaigns(Array.isArray(data) ? data : data.data || []);
      }
    } catch (e) {
      console.error('Failed to load cold campaigns:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCampaigns(); }, []);

  const createCampaign = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/cold-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Cold Campaign',
          from_name: '',
          from_email: '',
          daily_limit: 50,
          status: 'paused',
        }),
      });
      if (res.ok) {
        const campaign = await res.json();
        toast.success('Campaign created');
        router.push(`/dashboard/cold-outreach/${campaign.id}`);
      } else {
        toast.error('Failed to create campaign');
      }
    } catch {
      toast.error('Failed to create campaign');
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch(`/api/cold-outreach/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        toast.success(newStatus === 'active' ? 'Campaign activated' : 'Campaign paused');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const deleteCampaign = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all steps and prospects.`)) return;
    try {
      const res = await fetch(`/api/cold-outreach/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        toast.success('Campaign deleted');
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: '32px',
    maxWidth: 1100,
    margin: '0 auto',
    background: '#F8F9FF',
    minHeight: '100vh',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 26,
    fontWeight: 700,
    color: '#1a1a2e',
    margin: 0,
  };

  const newBtnStyle: React.CSSProperties = {
    background: '#00B4D8',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 22px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    opacity: creating ? 0.6 : 1,
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #E0F7FA',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 14,
    cursor: 'pointer',
    transition: 'box-shadow 0.15s',
  };

  const statsRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: 24,
    marginTop: 12,
    flexWrap: 'wrap',
  };

  const statStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#64648b',
  };

  const statValueStyle: React.CSSProperties = {
    fontWeight: 700,
    color: '#1a1a2e',
    fontSize: 16,
    marginRight: 4,
  };

  const actionBtnStyle = (color: string): React.CSSProperties => ({
    background: 'none',
    border: `1px solid ${color}`,
    color,
    borderRadius: 8,
    padding: '5px 14px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    marginRight: 8,
  });

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Cold Outreach</h1>
        </div>
        <div style={{ textAlign: 'center', padding: 60, color: '#8b8ba7' }}>Loading campaigns...</div>
      </div>
    );
  }

  if (migrationPending) {
    return <MigrationBanner />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Cold Outreach</h1>
        <button style={newBtnStyle} onClick={createCampaign} disabled={creating}>
          {creating ? 'Creating...' : '+ New Campaign'}
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '1px solid #E0F7FA',
          borderRadius: 16,
          padding: '60px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>No cold campaigns yet</div>
          <div style={{ fontSize: 14, color: '#8b8ba7', marginBottom: 20 }}>Create your first cold outreach campaign to start sending personalized sequences.</div>
          <button style={newBtnStyle} onClick={createCampaign} disabled={creating}>
            + New Campaign
          </button>
        </div>
      ) : (
        campaigns.map(campaign => {
          const sc = statusConfig[campaign.status] || statusConfig.paused;
          const replyRate = campaign.sent_count > 0
            ? ((campaign.reply_count / campaign.sent_count) * 100).toFixed(1)
            : '0.0';

          return (
            <div
              key={campaign.id}
              style={cardStyle}
              onClick={() => router.push(`/dashboard/cold-outreach/${campaign.id}`)}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,180,216,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 17, fontWeight: 600, color: '#1a1a2e' }}>{campaign.name}</span>
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: sc.color,
                      background: sc.bg,
                      padding: '2px 10px',
                      borderRadius: 20,
                    }}>
                      {sc.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: '#8b8ba7' }}>
                    {campaign.from_email || 'No sender set'} &middot; Daily limit: {campaign.daily_limit}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                  <button
                    style={actionBtnStyle(campaign.status === 'active' ? '#d97706' : '#10b981')}
                    onClick={() => toggleStatus(campaign.id, campaign.status)}
                  >
                    {campaign.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    style={actionBtnStyle('#e53e3e')}
                    onClick={() => deleteCampaign(campaign.id, campaign.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={statsRowStyle}>
                <div style={statStyle}>
                  <span style={statValueStyle}>{campaign.sent_count || 0}</span>Sent
                </div>
                <div style={statStyle}>
                  <span style={statValueStyle}>{campaign.reply_count || 0}</span>Replies
                </div>
                <div style={statStyle}>
                  <span style={statValueStyle}>{campaign.open_count || 0}</span>Opens
                </div>
                <div style={statStyle}>
                  <span style={{ ...statValueStyle, color: '#00B4D8' }}>{replyRate}%</span>Reply Rate
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
