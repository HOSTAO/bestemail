'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import MigrationBanner from '@/components/MigrationBanner';

type Sequence = {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  status: 'draft' | 'active' | 'paused';
  subscriber_count: number;
  created_at: string;
};

const TRIGGER_LABELS: Record<string, string> = {
  tag_added: 'Tag Added',
  form_submitted: 'Form Submitted',
  manual: 'Manual',
  date_based: 'Date Based',
};

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  draft: { bg: '#E5E7EB', color: '#374151', label: 'Draft' },
  active: { bg: '#D1FAE5', color: '#065F46', label: 'Active' },
  paused: { bg: '#FEF3C7', color: '#92400E', label: 'Paused' },
};

export default function SequencesPage() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createTrigger, setCreateTrigger] = useState('manual');
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const loadSequences = async () => {
    try {
      const res = await fetch('/api/sequences');
      const d = await res.json();
      if (d.migrationRequired) { setMigrationPending(true); setLoading(false); return; }
      if (res.ok) {
        setSequences(d.data || []);
      }
    } catch (e) {
      console.error('Failed to load sequences:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSequences(); }, []);

  const createSequence = async () => {
    if (!createName.trim()) {
      toast.error('Sequence name is required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/sequences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName.trim(),
          description: createDescription.trim(),
          trigger_type: createTrigger,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        toast.success('Sequence created');
        setShowCreateModal(false);
        setCreateName('');
        setCreateDescription('');
        setCreateTrigger('manual');
        router.push(`/dashboard/sequences/${d.data.id}`);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create sequence');
      }
    } catch {
      toast.error('Failed to create sequence');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/sequences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Sequence ${status}`);
        loadSequences();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  const deleteSequence = async (id: string, name: string) => {
    if (!confirm(`Delete sequence "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/sequences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Sequence deleted');
        loadSequences();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32, background: '#F8F9FF', minHeight: '100vh' }}>
        <p style={{ color: '#8b8ba7', textAlign: 'center', marginTop: 80 }}>Loading sequences...</p>
      </div>
    );
  }

  if (migrationPending) {
    return <MigrationBanner />;
  }

  return (
    <div style={{ padding: 32, background: '#F8F9FF', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Sequences</h1>
          <p style={{ color: '#8b8ba7', margin: '4px 0 0', fontSize: 14 }}>
            Automate email drip campaigns to nurture your subscribers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: '#00B4D8',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Create Sequence
        </button>
      </div>

      {/* Sequences Grid */}
      {sequences.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '1px solid #E0F7FA',
          borderRadius: 16,
          padding: 64,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 18, color: '#1a1a2e', fontWeight: 600, margin: '0 0 8px' }}>No sequences yet</p>
          <p style={{ color: '#8b8ba7', margin: '0 0 24px', fontSize: 14 }}>
            Create your first email sequence to start automating subscriber engagement.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: '#00B4D8',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Create Sequence
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {sequences.map(seq => {
            const st = STATUS_STYLES[seq.status] || STATUS_STYLES.draft;
            return (
              <div
                key={seq.id}
                style={{
                  background: '#fff',
                  border: '1px solid #E0F7FA',
                  borderRadius: 16,
                  padding: 24,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() => router.push(`/dashboard/sequences/${seq.id}`)}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,180,216,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: 0, flex: 1 }}>{seq.name}</h3>
                  <span style={{
                    background: st.bg,
                    color: st.color,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 20,
                    marginLeft: 8,
                  }}>
                    {st.label}
                  </span>
                </div>

                {seq.description && (
                  <p style={{ color: '#64648b', fontSize: 13, margin: '0 0 12px', lineHeight: 1.4 }}>
                    {seq.description.length > 80 ? seq.description.slice(0, 80) + '...' : seq.description}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: '#8b8ba7' }}>
                    Trigger: <strong style={{ color: '#64648b' }}>{TRIGGER_LABELS[seq.trigger_type] || seq.trigger_type}</strong>
                  </span>
                  <span style={{ fontSize: 12, color: '#8b8ba7' }}>
                    Subscribers: <strong style={{ color: '#64648b' }}>{seq.subscriber_count || 0}</strong>
                  </span>
                </div>

                {/* Quick actions */}
                <div
                  style={{ display: 'flex', gap: 8, borderTop: '1px solid #E0F7FA', paddingTop: 12 }}
                  onClick={e => e.stopPropagation()}
                >
                  {seq.status !== 'active' && (
                    <button
                      onClick={() => updateStatus(seq.id, 'active')}
                      style={{
                        background: '#D1FAE5',
                        color: '#065F46',
                        border: 'none',
                        borderRadius: 6,
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Activate
                    </button>
                  )}
                  {seq.status === 'active' && (
                    <button
                      onClick={() => updateStatus(seq.id, 'paused')}
                      style={{
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: 'none',
                        borderRadius: 6,
                        padding: '5px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={() => deleteSequence(seq.id, seq.name)}
                    style={{
                      background: '#FEE2E2',
                      color: '#e53e3e',
                      border: 'none',
                      borderRadius: 6,
                      padding: '5px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 24px' }}>Create Sequence</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64648b', marginBottom: 6 }}>
                Sequence Name
              </label>
              <input
                type="text"
                value={createName}
                onChange={e => setCreateName(e.target.value)}
                placeholder="e.g., Welcome Series"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #E0F7FA',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64648b', marginBottom: 6 }}>
                Description (optional)
              </label>
              <textarea
                value={createDescription}
                onChange={e => setCreateDescription(e.target.value)}
                placeholder="What does this sequence do?"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #E0F7FA',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64648b', marginBottom: 6 }}>
                Trigger Type
              </label>
              <select
                value={createTrigger}
                onChange={e => setCreateTrigger(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #E0F7FA',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="manual">Manual</option>
                <option value="tag_added">Tag Added</option>
                <option value="form_submitted">Form Submitted</option>
                <option value="date_based">Date Based</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowCreateModal(false); setCreateName(''); setCreateDescription(''); }}
                style={{
                  background: '#F8F9FF',
                  color: '#64648b',
                  border: '1px solid #E0F7FA',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={createSequence}
                disabled={creating}
                style={{
                  background: '#00B4D8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: creating ? 'not-allowed' : 'pointer',
                  opacity: creating ? 0.6 : 1,
                }}
              >
                {creating ? 'Creating...' : 'Create Sequence'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
