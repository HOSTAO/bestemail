'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import toast from 'react-hot-toast';

interface SenderID {
  id: string;
  from_name: string;
  from_email: string;
  reply_to: string;
  is_default: boolean;
  created_at: string;
}

export default function SenderIDsPage() {
  const isMobile = useIsMobile();
  const [senders, setSenders] = useState<SenderID[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [replyTo, setReplyTo] = useState('');

  const fetchSenders = useCallback(async () => {
    try {
      const res = await fetch('/api/sender-ids');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSenders(data.senderIds || []);
    } catch {
      toast.error('Failed to load sender identities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSenders();
  }, [fetchSenders]);

  const handleSave = async () => {
    if (!fromName.trim() || !fromEmail.trim()) {
      toast.error('From Name and From Email are required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/sender-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: fromName.trim(),
          from_email: fromEmail.trim(),
          reply_to: replyTo.trim() || fromEmail.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create');
      }
      toast.success('Sender identity created');
      setFromName('');
      setFromEmail('');
      setReplyTo('');
      setShowForm(false);
      fetchSenders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create sender identity');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await fetch('/api/sender-ids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_default: true }),
      });
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Default sender updated');
      fetchSenders();
    } catch {
      toast.error('Failed to set default');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sender identity?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/sender-ids?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Sender identity deleted');
      fetchSenders();
    } catch {
      toast.error('Failed to delete sender identity');
    } finally {
      setDeletingId(null);
    }
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

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a2e',
    display: 'block',
    marginBottom: 6,
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    padding: 20,
  };

  const primaryBtn: React.CSSProperties = {
    background: '#00B4D8',
    color: '#fff',
    borderRadius: 12,
    border: 'none',
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };

  if (loading) {
    return (
      <div style={{ padding: isMobile ? 16 : 32, background: '#F8F9FF', minHeight: '100vh' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 15, color: '#64648b' }}>Loading sender identities...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? 16 : 32, background: '#F8F9FF', minHeight: '100vh' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
              Sender Identities
            </h1>
            <p style={{ fontSize: 14, color: '#64648b', margin: '4px 0 0' }}>
              Manage the identities used to send your emails
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              ...primaryBtn,
              opacity: showForm ? 0.7 : 1,
            }}
          >
            {showForm ? 'Cancel' : '+ Add Sender'}
          </button>
        </div>

        {/* Inline Add Form */}
        {showForm && (
          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>
              New Sender Identity
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>From Name</label>
                <input
                  style={inputStyle}
                  placeholder="John Smith"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>From Email</label>
                <input
                  style={inputStyle}
                  placeholder="john@company.com"
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Reply-To Email</label>
                <input
                  style={inputStyle}
                  placeholder="reply@company.com"
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                />
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ ...primaryBtn, opacity: saving ? 0.6 : 1 }}
              >
                {saving ? 'Saving...' : 'Save Sender'}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {senders.length === 0 && (
          <div style={{ ...cardStyle, textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8b8ba7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 6 }}>
              No sender identities yet
            </div>
            <div style={{ fontSize: 14, color: '#8b8ba7', marginBottom: 20 }}>
              Add a sender identity to start sending emails
            </div>
            <button onClick={() => setShowForm(true)} style={primaryBtn}>
              + Add Your First Sender
            </button>
          </div>
        )}

        {/* Desktop Table */}
        {senders.length > 0 && !isMobile && (
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E0F7FA' }}>
                  {['From Name', 'From Email', 'Reply-To', 'Default', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '14px 20px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#8b8ba7',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {senders.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #E0F7FA' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>
                      {s.from_name}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#64648b' }}>
                      {s.from_email}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: '#64648b' }}>
                      {s.reply_to}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {s.is_default ? (
                        <span
                          style={{
                            background: '#F0EDFF',
                            color: '#00B4D8',
                            fontSize: 12,
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 6,
                          }}
                        >
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(s.id)}
                          disabled={togglingId === s.id}
                          style={{
                            background: 'none',
                            border: '1px solid #E0F7FA',
                            borderRadius: 6,
                            padding: '4px 10px',
                            fontSize: 12,
                            color: '#8b8ba7',
                            cursor: 'pointer',
                            fontWeight: 500,
                          }}
                        >
                          {togglingId === s.id ? '...' : 'Set Default'}
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FF6B6B',
                          cursor: 'pointer',
                          fontSize: 13,
                          fontWeight: 500,
                          opacity: deletingId === s.id ? 0.5 : 1,
                        }}
                      >
                        {deletingId === s.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {senders.length > 0 && isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {senders.map((s) => (
              <div key={s.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{s.from_name}</div>
                  {s.is_default && (
                    <span
                      style={{
                        background: '#F0EDFF',
                        color: '#00B4D8',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: 6,
                      }}
                    >
                      Default
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, color: '#64648b', marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: '#8b8ba7' }}>From:</span> {s.from_email}
                </div>
                <div style={{ fontSize: 13, color: '#64648b', marginBottom: 14 }}>
                  <span style={{ fontWeight: 500, color: '#8b8ba7' }}>Reply-To:</span> {s.reply_to}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!s.is_default && (
                    <button
                      onClick={() => handleSetDefault(s.id)}
                      disabled={togglingId === s.id}
                      style={{
                        background: 'none',
                        border: '1px solid #E0F7FA',
                        borderRadius: 8,
                        padding: '8px 14px',
                        fontSize: 13,
                        color: '#00B4D8',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      {togglingId === s.id ? '...' : 'Set Default'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    style={{
                      background: 'none',
                      border: '1px solid #FFE0E0',
                      borderRadius: 8,
                      padding: '8px 14px',
                      fontSize: 13,
                      color: '#FF6B6B',
                      cursor: 'pointer',
                      fontWeight: 500,
                      opacity: deletingId === s.id ? 0.5 : 1,
                    }}
                  >
                    {deletingId === s.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
