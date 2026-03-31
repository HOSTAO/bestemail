'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';
import MigrationBanner from '@/components/MigrationBanner';

type Tag = {
  id: string;
  name: string;
  color: string;
  description?: string;
  subscriber_count?: number;
  created_at?: string;
};

const PRESET_COLORS = [
  '#00B4D8', '#2563eb', '#7c3aed', '#db2777', '#e53e3e',
  '#d97706', '#f59e0b', '#16a34a', '#10b981', '#0891b2',
  '#64748b', '#1a1a2e',
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState('#00B4D8');
  const [formDescription, setFormDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const loadTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const d = await res.json();
      if (d.migrationRequired) { setMigrationPending(true); setLoading(false); return; }
      if (res.ok) {
        setTags(d.data || []);
      }
    } catch (e) {
      console.error('Failed to load tags:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTags(); }, []);

  const openCreate = () => {
    setEditingTag(null);
    setFormName('');
    setFormColor('#00B4D8');
    setFormDescription('');
    setShowModal(true);
  };

  const openEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormName(tag.name);
    setFormColor(tag.color || '#00B4D8');
    setFormDescription(tag.description || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTag(null);
  };

  const saveTag = async () => {
    if (!formName.trim()) {
      toast.error('Tag name is required');
      return;
    }
    setSaving(true);
    try {
      const body = { name: formName.trim(), color: formColor, description: formDescription.trim() };
      const url = editingTag ? `/api/tags/${editingTag.id}` : '/api/tags';
      const method = editingTag ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingTag ? 'Tag updated' : 'Tag created');
        closeModal();
        loadTags();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to save tag');
      }
    } catch {
      toast.error('Failed to save tag');
    } finally {
      setSaving(false);
    }
  };

  const deleteTag = async (tag: Tag) => {
    if (!confirm(`Delete tag "${tag.name}"? This will remove it from all subscribers.`)) return;
    try {
      const res = await fetch(`/api/tags/${tag.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Tag deleted');
        loadTags();
      } else {
        toast.error('Failed to delete tag');
      }
    } catch {
      toast.error('Failed to delete tag');
    }
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

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        Loading tags...
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
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Tags</h1>
          <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 14 }}>{tags.length} tags created</p>
        </div>
        <button
          onClick={openCreate}
          style={{
            borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
            padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
          }}
        >+ Create Tag</button>
      </div>

      {/* Tags Grid */}
      {tags.length === 0 ? (
        <div style={{ ...cardStyle, padding: '48px 20px', textAlign: 'center' }}>
          <p style={{ color: '#8b8ba7', fontSize: 15, marginBottom: 16 }}>No tags yet. Create your first tag to organize subscribers.</p>
          <button onClick={openCreate} style={{
            borderRadius: 12, background: '#00B4D8', color: '#fff', border: 'none',
            padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
          }}>Create Your First Tag</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {tags.map(tag => (
            <div key={tag.id} style={{ ...cardStyle, padding: 20 }}>
              {/* Tag Name with Color Dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 7,
                  background: tag.color || '#00B4D8', flexShrink: 0,
                }} />
                <span
                  onClick={() => router.push(`/dashboard/subscribers?tag_id=${tag.id}`)}
                  style={{
                    fontSize: 18, fontWeight: 700, color: '#1a1a2e', cursor: 'pointer',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {tag.name}
                </span>
              </div>

              {/* Description */}
              {tag.description && (
                <p style={{ fontSize: 13, color: '#64648b', margin: '0 0 10px', lineHeight: 1.5 }}>
                  {tag.description}
                </p>
              )}

              {/* Stats Row */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 13, color: '#8b8ba7' }}>
                <span>
                  <strong style={{ color: '#1a1a2e' }}>{tag.subscriber_count ?? 0}</strong> subscribers
                </span>
                {tag.created_at && (
                  <span>
                    Created {new Date(tag.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(tag)} style={{
                  borderRadius: 8, border: '1px solid #E0F7FA', background: '#fff',
                  padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#00B4D8',
                  cursor: 'pointer', minHeight: 32,
                }}>Edit</button>
                <button onClick={() => deleteTag(tag)} style={{
                  borderRadius: 8, border: '1px solid #FFD5D5', background: '#FFF0F0',
                  padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#e53e3e',
                  cursor: 'pointer', minHeight: 32,
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: 20,
        }} onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={{
            ...cardStyle,
            padding: isMobile ? 20 : 28,
            width: '100%',
            maxWidth: 480,
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' }}>
              {editingTag ? 'Edit Tag' : 'Create Tag'}
            </h2>

            <div style={{ display: 'grid', gap: 16 }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 6 }}>Tag Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. VIP, Newsletter, Lead"
                  style={inputStyle}
                  autoFocus
                />
              </div>

              {/* Color Picker */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 6 }}>Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormColor(color)}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: color, border: formColor === color ? '3px solid #1a1a2e' : '2px solid transparent',
                        cursor: 'pointer', transition: 'border 0.15s',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: formColor }} />
                  <span style={{ fontSize: 13, color: '#64648b' }}>{formColor}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 6 }}>Description (optional)</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="What is this tag used for?"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              <button onClick={saveTag} disabled={saving} style={{
                borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
                padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
                opacity: saving ? 0.6 : 1, flex: isMobile ? '1 1 100%' : undefined,
              }}>{saving ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}</button>
              <button onClick={closeModal} style={{
                borderRadius: 10, background: '#fff', color: '#64648b', border: '1px solid #E0F7FA',
                padding: '12px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 44,
                flex: isMobile ? '1 1 100%' : undefined,
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
