'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

type TagInfo = {
  id: string;
  name: string;
  color: string;
  description?: string;
};

type SubscriberTag = {
  tag_id: string;
  tags: TagInfo;
};

type SubscriberEvent = {
  id: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  source?: string;
  created_at: string;
};

type SequenceEnrollment = {
  id: string;
  status: string;
  current_step?: number;
  enrolled_at?: string;
  sequences?: {
    id: string;
    name: string;
    status: string;
  };
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
  ip_address?: string;
  custom_fields?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  subscriber_tags?: SubscriberTag[];
  events?: SubscriberEvent[];
  sequence_enrollments?: SequenceEnrollment[];
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  active: { bg: '#dcfce7', color: '#16a34a' },
  unsubscribed: { bg: '#fee2e2', color: '#dc2626' },
  bounced: { bg: '#fef3c7', color: '#d97706' },
  complained: { bg: '#fce4ec', color: '#c62828' },
};

const EVENT_ICONS: Record<string, string> = {
  email_sent: 'M',
  email_opened: 'O',
  email_clicked: 'C',
  tag_added: 'T+',
  tag_removed: 'T-',
  subscribed: 'S',
  unsubscribed: 'U',
  form_submitted: 'F',
  page_viewed: 'P',
};

const EVENT_COLORS: Record<string, { bg: string; color: string }> = {
  email_sent: { bg: '#E0F7FA', color: '#00B4D8' },
  email_opened: { bg: '#dcfce7', color: '#16a34a' },
  email_clicked: { bg: '#dbeafe', color: '#2563eb' },
  tag_added: { bg: '#fef3c7', color: '#d97706' },
  tag_removed: { bg: '#fee2e2', color: '#dc2626' },
  subscribed: { bg: '#dcfce7', color: '#16a34a' },
  unsubscribed: { bg: '#fee2e2', color: '#dc2626' },
  form_submitted: { bg: '#E0F7FA', color: '#00B4D8' },
  page_viewed: { bg: '#F3F4F6', color: '#6B7280' },
};

function getInitials(firstName?: string, lastName?: string, email?: string) {
  if (firstName && lastName) return (firstName[0] + lastName[0]).toUpperCase();
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  return (email || '?')[0].toUpperCase();
}

function getAvatarColor(email: string) {
  const hue = (email.charCodeAt(0) * 37) % 360;
  return {
    bg: `hsl(${hue}, 60%, 88%)`,
    color: `hsl(${hue}, 60%, 30%)`,
  };
}

export default function SubscriberProfilePage() {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [allTags, setAllTags] = useState<TagInfo[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const router = useRouter();
  const params = useParams();
  const isMobile = useIsMobile();
  const subscriberId = params.id as string;

  const loadSubscriber = async () => {
    try {
      const res = await fetch(`/api/subscribers/${subscriberId}`);
      if (res.ok) {
        const d = await res.json();
        setSubscriber(d.data || null);
      } else {
        toast.error('Subscriber not found');
        router.push('/dashboard/subscribers');
      }
    } catch (e) {
      console.error('Failed to load subscriber:', e);
      toast.error('Failed to load subscriber');
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
    } catch { /* skip */ }
  };

  useEffect(() => {
    loadSubscriber();
    loadTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriberId]);

  const startEdit = () => {
    if (!subscriber) return;
    setEditData({
      first_name: subscriber.first_name || '',
      last_name: subscriber.last_name || '',
      company: subscriber.company || '',
      phone: subscriber.phone || '',
      source: subscriber.source || '',
      source_url: subscriber.source_url || '',
      status: subscriber.status,
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/subscribers/${subscriberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        toast.success('Subscriber updated');
        setEditing(false);
        loadSubscriber();
      } else {
        const d = await res.json();
        toast.error(d.error || 'Failed to update');
      }
    } catch {
      toast.error('Failed to update subscriber');
    } finally {
      setSaving(false);
    }
  };

  const addTag = async (tagId: string) => {
    try {
      const res = await fetch(`/api/subscribers/${subscriberId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: tagId }),
      });
      if (res.ok) {
        toast.success('Tag added');
        setShowTagPicker(false);
        loadSubscriber();
      } else {
        toast.error('Failed to add tag');
      }
    } catch {
      toast.error('Failed to add tag');
    }
  };

  const removeTag = async (tagId: string) => {
    try {
      const res = await fetch(`/api/subscribers/${subscriberId}/tags`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: tagId }),
      });
      if (res.ok) {
        toast.success('Tag removed');
        loadSubscriber();
      }
    } catch {
      toast.error('Failed to remove tag');
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
        Loading subscriber...
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        Subscriber not found.
      </div>
    );
  }

  const avatar = getAvatarColor(subscriber.email);
  const tags = (subscriber.subscriber_tags || []).map(st => st.tags).filter(Boolean);
  const existingTagIds = new Set(tags.map(t => t.id));
  const availableTags = allTags.filter(t => !existingTagIds.has(t.id));
  const statusStyle = STATUS_STYLES[subscriber.status] || STATUS_STYLES.active;
  const name = [subscriber.first_name, subscriber.last_name].filter(Boolean).join(' ');
  const events = subscriber.events || [];
  const enrollments = subscriber.sequence_enrollments || [];
  const campaignEvents = events.filter(e => e.event_type === 'email_sent');

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 900, margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard/subscribers')}
        style={{
          borderRadius: 8, background: 'transparent', border: '1px solid #E0F7FA',
          padding: '8px 16px', fontSize: 13, fontWeight: 600, color: '#64648b',
          cursor: 'pointer', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6,
          minHeight: 36,
        }}
      >
        &larr; Back to Subscribers
      </button>

      {/* Header Card */}
      <div style={{ ...cardStyle, padding: isMobile ? 20 : 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Large Avatar */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            background: avatar.bg,
            color: avatar.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 24,
            flexShrink: 0,
          }}>
            {getInitials(subscriber.first_name, subscriber.last_name, subscriber.email)}
          </div>

          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 4 }}>First Name</label>
                  <input type="text" value={editData.first_name || ''} onChange={e => setEditData({ ...editData, first_name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 4 }}>Last Name</label>
                  <input type="text" value={editData.last_name || ''} onChange={e => setEditData({ ...editData, last_name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 4 }}>Company</label>
                  <input type="text" value={editData.company || ''} onChange={e => setEditData({ ...editData, company: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 4 }}>Phone</label>
                  <input type="text" value={editData.phone || ''} onChange={e => setEditData({ ...editData, phone: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 4 }}>Source</label>
                  <input type="text" value={editData.source || ''} onChange={e => setEditData({ ...editData, source: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 4 }}>Source URL</label>
                  <input type="text" value={editData.source_url || ''} onChange={e => setEditData({ ...editData, source_url: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#8b8ba7', display: 'block', marginBottom: 4 }}>Status</label>
                  <select value={editData.status || 'active'} onChange={e => setEditData({ ...editData, status: e.target.value })} style={inputStyle}>
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                    <option value="complained">Complained</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <button onClick={saveEdit} disabled={saving} style={{
                    borderRadius: 8, background: '#00B4D8', color: '#fff', border: 'none',
                    padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 40,
                    opacity: saving ? 0.6 : 1,
                  }}>{saving ? 'Saving...' : 'Save'}</button>
                  <button onClick={() => setEditing(false)} style={{
                    borderRadius: 8, background: '#fff', color: '#64648b', border: '1px solid #E0F7FA',
                    padding: '10px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', minHeight: 40,
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
                    {name || subscriber.email}
                  </h2>
                  <span style={{
                    padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                    background: statusStyle.bg, color: statusStyle.color,
                    textTransform: 'capitalize' as const,
                  }}>{subscriber.status}</span>
                </div>
                <div style={{ color: '#64648b', fontSize: 14, marginTop: 6 }}>{subscriber.email}</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, fontSize: 13, color: '#8b8ba7' }}>
                  {subscriber.company && <span>Company: <strong style={{ color: '#1a1a2e' }}>{subscriber.company}</strong></span>}
                  {subscriber.phone && <span>Phone: <strong style={{ color: '#1a1a2e' }}>{subscriber.phone}</strong></span>}
                  {subscriber.source && <span>Source: <strong style={{ color: '#1a1a2e' }}>{subscriber.source}</strong></span>}
                  {subscriber.source_url && <span>URL: <strong style={{ color: '#1a1a2e' }}>{subscriber.source_url}</strong></span>}
                  {subscriber.lead_score !== undefined && subscriber.lead_score !== null && (
                    <span>Lead Score: <strong style={{ color: '#00B4D8' }}>{subscriber.lead_score}</strong></span>
                  )}
                </div>
                <button onClick={startEdit} style={{
                  marginTop: 12, borderRadius: 8, background: '#E0F7FA', color: '#00B4D8', border: 'none',
                  padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 36,
                }}>Edit</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: 0 }}>Tags</h3>
          <button
            onClick={() => setShowTagPicker(!showTagPicker)}
            style={{
              borderRadius: 8, background: '#E0F7FA', color: '#00B4D8', border: 'none',
              padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 32,
            }}
          >+ Add Tag</button>
        </div>

        {showTagPicker && (
          <div style={{
            marginBottom: 14, padding: 12, background: '#F8F9FF', borderRadius: 10,
            display: 'flex', flexWrap: 'wrap', gap: 8,
          }}>
            {availableTags.length === 0 ? (
              <span style={{ fontSize: 13, color: '#8b8ba7' }}>No more tags available. Create new tags in the Tags page.</span>
            ) : availableTags.map(t => (
              <button
                key={t.id}
                onClick={() => addTag(t.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: '#fff', color: '#1a1a2e', border: '1px solid #E0F7FA',
                  cursor: 'pointer', minHeight: 32,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 4, background: t.color || '#00B4D8' }} />
                {t.name}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {tags.length === 0 ? (
            <span style={{ fontSize: 13, color: '#8b8ba7' }}>No tags assigned.</span>
          ) : tags.map(t => (
            <span
              key={t.id}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                background: '#E0F7FA', color: '#00B4D8',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 4, background: t.color || '#00B4D8' }} />
              {t.name}
              <button
                onClick={() => removeTag(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e',
                  fontSize: 14, fontWeight: 700, padding: '0 2px', lineHeight: 1,
                }}
              >x</button>
            </span>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Activity Timeline</h3>
        {events.length === 0 ? (
          <p style={{ color: '#8b8ba7', fontSize: 13 }}>No activity recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: 0 }}>
            {events.map((event, i) => {
              const evStyle = EVENT_COLORS[event.event_type] || { bg: '#F3F4F6', color: '#6B7280' };
              const icon = EVENT_ICONS[event.event_type] || '?';
              return (
                <div key={event.id} style={{
                  display: 'flex', gap: 12, position: 'relative',
                  paddingBottom: i < events.length - 1 ? 20 : 0,
                }}>
                  {/* Timeline line */}
                  {i < events.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 15, top: 32, width: 2, bottom: 0,
                      background: '#E0F7FA',
                    }} />
                  )}
                  {/* Icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: evStyle.bg, color: evStyle.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0, zIndex: 1,
                  }}>
                    {icon}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>
                      {event.event_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </div>
                    {event.event_data && Object.keys(event.event_data).length > 0 && (
                      <div style={{ fontSize: 12, color: '#64648b', marginTop: 2 }}>
                        {Object.entries(event.event_data).map(([k, v]) => (
                          <span key={k} style={{ marginRight: 10 }}>{k}: {String(v)}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: '#8b8ba7', marginTop: 2 }}>
                      {new Date(event.created_at).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sequences Section */}
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Sequences</h3>
        {enrollments.length === 0 ? (
          <p style={{ color: '#8b8ba7', fontSize: 13 }}>Not enrolled in any sequences.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {enrollments.map(enrollment => (
              <div key={enrollment.id} style={{
                padding: 14, borderRadius: 10, border: '1px solid #E0F7FA',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
                    {enrollment.sequences?.name || 'Unknown Sequence'}
                  </div>
                  <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 2 }}>
                    Step {enrollment.current_step || 1}
                    {enrollment.enrolled_at && ` | Enrolled ${new Date(enrollment.enrolled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                  background: enrollment.status === 'active' ? '#dcfce7' : '#F3F4F6',
                  color: enrollment.status === 'active' ? '#16a34a' : '#6B7280',
                  textTransform: 'capitalize' as const,
                }}>{enrollment.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Campaigns Section */}
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Campaigns Received</h3>
        {campaignEvents.length === 0 ? (
          <p style={{ color: '#8b8ba7', fontSize: 13 }}>No campaigns sent to this subscriber yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {campaignEvents.map(event => (
              <div key={event.id} style={{
                padding: 14, borderRadius: 10, border: '1px solid #E0F7FA',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
                    {(event.event_data as Record<string, unknown>)?.campaign_name
                      ? String((event.event_data as Record<string, unknown>).campaign_name)
                      : 'Campaign Email'}
                  </div>
                  <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 2 }}>
                    {new Date(event.created_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                  background: '#E0F7FA', color: '#00B4D8',
                }}>Sent</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
