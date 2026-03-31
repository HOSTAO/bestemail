'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';
import MigrationBanner from '@/components/MigrationBanner';

type Webhook = {
  id: string;
  url: string;
  events: string[];
  secret_key: string;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
};

const ALL_EVENTS = [
  'email.delivered',
  'email.opened',
  'email.clicked',
  'email.bounced',
  'email.spam',
  'email.unsubscribed',
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const loadWebhooks = async () => {
    try {
      const res = await fetch('/api/webhooks');
      const d = await res.json();
      if (d.migrationRequired) { setMigrationPending(true); setLoading(false); return; }
      if (res.ok) {
        setWebhooks(d.data || []);
      }
    } catch (e) {
      console.error('Failed to load webhooks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWebhooks(); }, []);

  const toggleEvent = (event: string) => {
    setFormEvents(prev =>
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    );
  };

  const resetForm = () => {
    setFormUrl('');
    setFormEvents([]);
    setShowForm(false);
  };

  const saveWebhook = async () => {
    if (!formUrl.trim()) {
      toast.error('Webhook URL is required');
      return;
    }
    try {
      new URL(formUrl.trim());
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }
    if (formEvents.length === 0) {
      toast.error('Select at least one event');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formUrl.trim(), events: formEvents }),
      });
      if (res.ok) {
        toast.success('Webhook created');
        resetForm();
        loadWebhooks();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to create webhook');
      }
    } catch {
      toast.error('Failed to create webhook');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (webhook: Webhook) => {
    try {
      const res = await fetch('/api/webhooks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: webhook.id, is_active: !webhook.is_active }),
      });
      if (res.ok) {
        toast.success(webhook.is_active ? 'Webhook deactivated' : 'Webhook activated');
        loadWebhooks();
      } else {
        toast.error('Failed to update webhook');
      }
    } catch {
      toast.error('Failed to update webhook');
    }
  };

  const deleteWebhook = async (webhook: Webhook) => {
    if (!confirm('Delete this webhook? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/webhooks?id=${webhook.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Webhook deleted');
        loadWebhooks();
      } else {
        toast.error('Failed to delete webhook');
      }
    } catch {
      toast.error('Failed to delete webhook');
    }
  };

  const testWebhook = async (webhook: Webhook) => {
    setTestingId(webhook.id);
    try {
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook_id: webhook.id }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Test sent successfully (${d.status})`);
        loadWebhooks();
      } else {
        toast.error(d.error || 'Test failed');
        loadWebhooks();
      }
    } catch {
      toast.error('Failed to send test');
    } finally {
      setTestingId(null);
    }
  };

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: 8,
    border: '1px solid #E0F7FA',
    padding: '10px 14px',
    fontSize: 16,
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        Loading webhooks...
      </div>
    );
  }

  if (migrationPending) {
    return <MigrationBanner />;
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Webhooks</h1>
          <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 14 }}>{webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
            padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
          }}
        >{showForm ? 'Cancel' : '+ Add Webhook'}</button>
      </div>

      {/* Add Webhook Form */}
      {showForm && (
        <div style={{ ...cardStyle, padding: isMobile ? 20 : 28, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' }}>New Webhook</h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 6 }}>Endpoint URL</label>
            <input
              type="url"
              value={formUrl}
              onChange={e => setFormUrl(e.target.value)}
              placeholder="https://your-server.com/webhook"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 10 }}>Events</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_EVENTS.map(event => {
                const selected = formEvents.includes(event);
                return (
                  <button
                    key={event}
                    onClick={() => toggleEvent(event)}
                    style={{
                      borderRadius: 20,
                      border: selected ? '1px solid #00B4D8' : '1px solid #E0F7FA',
                      background: selected ? '#00B4D8' : '#F8F9FF',
                      color: selected ? '#fff' : '#64648b',
                      padding: '6px 14px',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {event}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={saveWebhook}
              disabled={saving}
              style={{
                borderRadius: 12, background: '#00B4D8', color: '#fff', border: 'none',
                padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                opacity: saving ? 0.6 : 1, minHeight: 44,
              }}
            >{saving ? 'Saving...' : 'Save Webhook'}</button>
            <button
              onClick={resetForm}
              style={{
                borderRadius: 12, background: '#fff', color: '#64648b', border: '1px solid #E0F7FA',
                padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 44,
              }}
            >Cancel</button>
          </div>
        </div>
      )}

      {/* Webhooks List */}
      {webhooks.length === 0 ? (
        <div style={{ ...cardStyle, padding: '48px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔗</div>
          <p style={{ color: '#1a1a2e', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>No webhooks yet</p>
          <p style={{ color: '#8b8ba7', fontSize: 14, marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            Set up webhooks to receive real-time notifications when email events occur.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              borderRadius: 12, background: '#00B4D8', color: '#fff', border: 'none',
              padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
            }}
          >Add Your First Webhook</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {webhooks.map(webhook => (
            <div key={webhook.id} style={{ ...cardStyle, padding: 20 }}>
              {/* URL and Status Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div style={{
                  width: 10, height: 10, borderRadius: 5,
                  background: webhook.is_active ? '#16a34a' : '#8b8ba7',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 15, fontWeight: 600, color: '#1a1a2e',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  flex: 1, minWidth: 0,
                }}>
                  {webhook.url.length > (isMobile ? 40 : 70) ? webhook.url.slice(0, isMobile ? 40 : 70) + '...' : webhook.url}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 500, color: webhook.is_active ? '#16a34a' : '#8b8ba7',
                  flexShrink: 0,
                }}>
                  {webhook.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Events Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {webhook.events.map(event => (
                  <span key={event} style={{
                    borderRadius: 12,
                    background: '#F0EDFF',
                    color: '#00B4D8',
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 500,
                  }}>
                    {event}
                  </span>
                ))}
              </div>

              {/* Secret Key */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13 }}>
                <span style={{ color: '#8b8ba7', fontWeight: 500 }}>Secret:</span>
                <code style={{
                  background: '#F8F9FF', padding: '2px 8px', borderRadius: 6,
                  fontSize: 12, color: '#1a1a2e', fontFamily: 'monospace',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: isMobile ? 160 : 320,
                }}>
                  {visibleSecrets[webhook.id] ? webhook.secret_key : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                </code>
                <button
                  onClick={() => toggleSecretVisibility(webhook.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#00B4D8', fontSize: 12, fontWeight: 500, padding: '2px 4px',
                  }}
                >{visibleSecrets[webhook.id] ? 'Hide' : 'Show'}</button>
              </div>

              {/* Last Triggered */}
              <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 14 }}>
                Last triggered: {webhook.last_triggered_at
                  ? new Date(webhook.last_triggered_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Never'}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => toggleActive(webhook)}
                  style={{
                    borderRadius: 8, border: '1px solid #E0F7FA', background: '#fff',
                    padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#00B4D8',
                    cursor: 'pointer', minHeight: 32,
                  }}
                >{webhook.is_active ? 'Deactivate' : 'Activate'}</button>
                <button
                  onClick={() => testWebhook(webhook)}
                  disabled={testingId === webhook.id}
                  style={{
                    borderRadius: 8, border: '1px solid #E0F7FA', background: '#F8F9FF',
                    padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#1a1a2e',
                    cursor: 'pointer', minHeight: 32,
                    opacity: testingId === webhook.id ? 0.6 : 1,
                  }}
                >{testingId === webhook.id ? 'Sending...' : 'Test'}</button>
                <button
                  onClick={() => deleteWebhook(webhook)}
                  style={{
                    borderRadius: 8, border: '1px solid #FFD5D5', background: '#FFF0F0',
                    padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#e53e3e',
                    cursor: 'pointer', minHeight: 32,
                  }}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
