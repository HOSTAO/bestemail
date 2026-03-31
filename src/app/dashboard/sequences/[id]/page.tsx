'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';

type SequenceEmail = {
  id: string;
  sequence_id: string;
  step_number: number;
  subject: string;
  body_html: string;
  delay_days: number;
  delay_hours: number;
  send_time: string | null;
  created_at: string;
};

type EnrollmentStats = {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  unsubscribed: number;
};

type Sequence = {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_config: Record<string, unknown>;
  status: 'draft' | 'active' | 'paused';
  subscriber_count: number;
  emails: SequenceEmail[];
  enrollment_stats: EnrollmentStats;
};

type Tag = { id: string; name: string };
type Form = { id: string; name: string };

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #E0F7FA',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#64648b',
  marginBottom: 6,
};

export default function SequenceDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('manual');
  const [triggerConfig, setTriggerConfig] = useState<Record<string, unknown>>({});

  // Trigger config options
  const [tags, setTags] = useState<Tag[]>([]);
  const [forms, setForms] = useState<Form[]>([]);

  // Email step editing
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [stepSubject, setStepSubject] = useState('');
  const [stepBody, setStepBody] = useState('');
  const [stepDelayDays, setStepDelayDays] = useState(0);
  const [stepDelayHours, setStepDelayHours] = useState(0);
  const [stepSendTime, setStepSendTime] = useState('');

  // Add step
  const [showAddStep, setShowAddStep] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newDelayDays, setNewDelayDays] = useState(1);
  const [newDelayHours, setNewDelayHours] = useState(0);
  const [newSendTime, setNewSendTime] = useState('');
  const [addingStep, setAddingStep] = useState(false);

  const loadSequence = useCallback(async () => {
    try {
      const res = await fetch(`/api/sequences/${id}`);
      if (res.ok) {
        const d = await res.json();
        const seq = d.data;
        setSequence(seq);
        setName(seq.name);
        setDescription(seq.description || '');
        setTriggerType(seq.trigger_type);
        setTriggerConfig(seq.trigger_config || {});
      } else {
        toast.error('Sequence not found');
        router.push('/dashboard/sequences');
      }
    } catch {
      toast.error('Failed to load sequence');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { loadSequence(); }, [loadSequence]);

  // Load tags and forms for trigger config
  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then(d => setTags(d.data || [])).catch(() => {});
    fetch('/api/forms').then(r => r.json()).then(d => setForms(Array.isArray(d) ? d : d.data || [])).catch(() => {});
  }, []);

  const saveSequence = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/sequences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          trigger_type: triggerType,
          trigger_config: triggerConfig,
        }),
      });
      if (res.ok) {
        toast.success('Sequence saved');
        loadSequence();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!sequence) return;
    const nextStatus = sequence.status === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch(`/api/sequences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast.success(`Sequence ${nextStatus}`);
        loadSequence();
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const startEditStep = (step: SequenceEmail) => {
    setEditingStepId(step.id);
    setStepSubject(step.subject);
    setStepBody(step.body_html || '');
    setStepDelayDays(step.delay_days);
    setStepDelayHours(step.delay_hours);
    setStepSendTime(step.send_time || '');
  };

  const cancelEditStep = () => {
    setEditingStepId(null);
  };

  const saveStep = async (emailId: string) => {
    try {
      const res = await fetch(`/api/sequences/${id}/emails/${emailId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: stepSubject,
          body_html: stepBody,
          delay_days: stepDelayDays,
          delay_hours: stepDelayHours,
          send_time: stepSendTime || null,
        }),
      });
      if (res.ok) {
        toast.success('Step updated');
        setEditingStepId(null);
        loadSequence();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update step');
      }
    } catch {
      toast.error('Failed to update step');
    }
  };

  const deleteStep = async (emailId: string) => {
    if (!confirm('Delete this email step?')) return;
    try {
      const res = await fetch(`/api/sequences/${id}/emails/${emailId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Step deleted');
        loadSequence();
      }
    } catch {
      toast.error('Failed to delete step');
    }
  };

  const addStep = async () => {
    if (!newSubject.trim()) {
      toast.error('Subject is required');
      return;
    }
    setAddingStep(true);
    try {
      const res = await fetch(`/api/sequences/${id}/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newSubject.trim(),
          body_html: newBody,
          delay_days: newDelayDays,
          delay_hours: newDelayHours,
          send_time: newSendTime || null,
        }),
      });
      if (res.ok) {
        toast.success('Step added');
        setShowAddStep(false);
        setNewSubject('');
        setNewBody('');
        setNewDelayDays(1);
        setNewDelayHours(0);
        setNewSendTime('');
        loadSequence();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to add step');
      }
    } catch {
      toast.error('Failed to add step');
    } finally {
      setAddingStep(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32, background: '#F8F9FF', minHeight: '100vh' }}>
        <p style={{ color: '#8b8ba7', textAlign: 'center', marginTop: 80 }}>Loading sequence...</p>
      </div>
    );
  }

  if (!sequence) return null;

  const st = STATUS_STYLES[sequence.status] || STATUS_STYLES.draft;
  const stats = sequence.enrollment_stats;

  return (
    <div style={{ padding: 32, background: '#F8F9FF', minHeight: '100vh', maxWidth: 900, margin: '0 auto' }}>
      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard/sequences')}
        style={{
          background: 'none',
          border: 'none',
          color: '#00B4D8',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 20,
          padding: 0,
        }}
      >
        &larr; Back to Sequences
      </button>

      {/* Header Card */}
      <div style={{
        background: '#fff',
        border: '1px solid #E0F7FA',
        borderRadius: 16,
        padding: 28,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#1a1a2e',
                border: 'none',
                borderBottom: '2px solid transparent',
                outline: 'none',
                width: '100%',
                padding: '4px 0',
                background: 'transparent',
              }}
              onFocus={e => (e.target.style.borderBottomColor = '#00B4D8')}
              onBlur={e => (e.target.style.borderBottomColor = 'transparent')}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginLeft: 16 }}>
            <span style={{
              background: st.bg,
              color: st.color,
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: 20,
            }}>
              {st.label}
            </span>
            <button
              onClick={toggleStatus}
              style={{
                background: sequence.status === 'active' ? '#FEF3C7' : '#D1FAE5',
                color: sequence.status === 'active' ? '#92400E' : '#065F46',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {sequence.status === 'active' ? 'Pause' : 'Activate'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe this sequence..."
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* Trigger Section */}
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Trigger Type</label>
          <select
            value={triggerType}
            onChange={e => { setTriggerType(e.target.value); setTriggerConfig({}); }}
            style={{ ...inputStyle, background: '#fff' }}
          >
            <option value="manual">Manual</option>
            <option value="tag_added">Tag Added</option>
            <option value="form_submitted">Form Submitted</option>
            <option value="date_based">Date Based</option>
          </select>
        </div>

        {/* Trigger config pickers */}
        {triggerType === 'tag_added' && (
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Trigger Tag</label>
            <select
              value={(triggerConfig.tag_id as string) || ''}
              onChange={e => setTriggerConfig({ ...triggerConfig, tag_id: e.target.value })}
              style={{ ...inputStyle, background: '#fff' }}
            >
              <option value="">Select a tag...</option>
              {tags.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}

        {triggerType === 'form_submitted' && (
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Trigger Form</label>
            <select
              value={(triggerConfig.form_id as string) || ''}
              onChange={e => setTriggerConfig({ ...triggerConfig, form_id: e.target.value })}
              style={{ ...inputStyle, background: '#fff' }}
            >
              <option value="">Select a form...</option>
              {forms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={saveSequence}
            disabled={saving}
            style={{
              background: '#00B4D8',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Analytics */}
      <div style={{
        background: '#fff',
        border: '1px solid #E0F7FA',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>Enrollment Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
          {[
            { label: 'Enrolled', value: stats.total, color: '#00B4D8' },
            { label: 'Active', value: stats.active, color: '#10b981' },
            { label: 'Completed', value: stats.completed, color: '#2563eb' },
            { label: 'Cancelled', value: stats.cancelled, color: '#8b8ba7' },
            { label: 'Unsubscribed', value: stats.unsubscribed, color: '#e53e3e' },
          ].map(item => (
            <div
              key={item.label}
              style={{
                background: '#F8F9FF',
                borderRadius: 12,
                padding: 16,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Steps */}
      <div style={{
        background: '#fff',
        border: '1px solid #E0F7FA',
        borderRadius: 16,
        padding: 28,
        marginBottom: 24,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' }}>
          Email Steps ({sequence.emails.length})
        </h3>

        {sequence.emails.length === 0 && !showAddStep && (
          <p style={{ color: '#8b8ba7', fontSize: 14, margin: '0 0 16px' }}>
            No email steps yet. Add your first step to start building the drip sequence.
          </p>
        )}

        {/* Steps list with connecting lines */}
        <div style={{ position: 'relative' }}>
          {sequence.emails.map((step, idx) => {
            const isEditing = editingStepId === step.id;
            const isLast = idx === sequence.emails.length - 1;
            const delayText = step.delay_days > 0 || step.delay_hours > 0
              ? `Wait ${step.delay_days > 0 ? `${step.delay_days}d` : ''}${step.delay_days > 0 && step.delay_hours > 0 ? ' ' : ''}${step.delay_hours > 0 ? `${step.delay_hours}h` : ''}${step.send_time ? `, send at ${step.send_time}` : ''}`
              : step.send_time
                ? `Send at ${step.send_time}`
                : 'Send immediately';

            return (
              <div key={step.id} style={{ display: 'flex', gap: 16, marginBottom: isLast && !showAddStep ? 0 : 0 }}>
                {/* Step indicator + connecting line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#E0F7FA',
                    color: '#00B4D8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {step.step_number}
                  </div>
                  {(!isLast || showAddStep) && (
                    <div style={{ width: 2, background: '#E0F7FA', flex: 1, minHeight: 24 }} />
                  )}
                </div>

                {/* Step content */}
                <div style={{
                  flex: 1,
                  background: isEditing ? '#F8F9FF' : '#fff',
                  border: '1px solid #E0F7FA',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}>
                  {!isEditing ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>
                            {step.subject}
                          </div>
                          <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 8 }}>
                            {delayText}
                          </div>
                          {step.body_html && (
                            <div style={{
                              fontSize: 12,
                              color: '#64648b',
                              lineHeight: 1.4,
                              maxHeight: 40,
                              overflow: 'hidden',
                            }}>
                              {step.body_html.replace(/<[^>]*>/g, '').slice(0, 120)}
                              {step.body_html.replace(/<[^>]*>/g, '').length > 120 ? '...' : ''}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginLeft: 12, flexShrink: 0 }}>
                          <button
                            onClick={() => startEditStep(step)}
                            style={{
                              background: '#E0F7FA',
                              color: '#00B4D8',
                              border: 'none',
                              borderRadius: 6,
                              padding: '5px 12px',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteStep(step.id)}
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
                    </>
                  ) : (
                    <>
                      <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Subject</label>
                        <input
                          type="text"
                          value={stepSubject}
                          onChange={e => setStepSubject(e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <label style={labelStyle}>Body (HTML)</label>
                        <textarea
                          value={stepBody}
                          onChange={e => setStepBody(e.target.value)}
                          rows={6}
                          style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={labelStyle}>Delay (days)</label>
                          <input
                            type="number"
                            min={0}
                            value={stepDelayDays}
                            onChange={e => setStepDelayDays(parseInt(e.target.value) || 0)}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Delay (hours)</label>
                          <input
                            type="number"
                            min={0}
                            value={stepDelayHours}
                            onChange={e => setStepDelayHours(parseInt(e.target.value) || 0)}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Send Time</label>
                          <input
                            type="time"
                            value={stepSendTime}
                            onChange={e => setStepSendTime(e.target.value)}
                            style={inputStyle}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={cancelEditStep}
                          style={{
                            background: '#F8F9FF',
                            color: '#64648b',
                            border: '1px solid #E0F7FA',
                            borderRadius: 6,
                            padding: '6px 16px',
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveStep(step.id)}
                          style={{
                            background: '#00B4D8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 16px',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Save Step
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Step Form */}
          {showAddStep && (
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#00B4D8',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  +
                </div>
              </div>
              <div style={{
                flex: 1,
                background: '#F8F9FF',
                border: '1px solid #E0F7FA',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: '0 0 12px' }}>
                  New Email Step (Step {(sequence.emails.length || 0) + 1})
                </h4>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    placeholder="e.g., Welcome to our community!"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={labelStyle}>Body (HTML)</label>
                  <textarea
                    value={newBody}
                    onChange={e => setNewBody(e.target.value)}
                    rows={6}
                    placeholder="<p>Hi {{name}},</p><p>Welcome aboard!</p>"
                    style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Delay (days)</label>
                    <input
                      type="number"
                      min={0}
                      value={newDelayDays}
                      onChange={e => setNewDelayDays(parseInt(e.target.value) || 0)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Delay (hours)</label>
                    <input
                      type="number"
                      min={0}
                      value={newDelayHours}
                      onChange={e => setNewDelayHours(parseInt(e.target.value) || 0)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Send Time</label>
                    <input
                      type="time"
                      value={newSendTime}
                      onChange={e => setNewSendTime(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => { setShowAddStep(false); setNewSubject(''); setNewBody(''); }}
                    style={{
                      background: '#F8F9FF',
                      color: '#64648b',
                      border: '1px solid #E0F7FA',
                      borderRadius: 6,
                      padding: '6px 16px',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addStep}
                    disabled={addingStep}
                    style={{
                      background: '#00B4D8',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 16px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: addingStep ? 'not-allowed' : 'pointer',
                      opacity: addingStep ? 0.6 : 1,
                    }}
                  >
                    {addingStep ? 'Adding...' : 'Add Step'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!showAddStep && (
          <button
            onClick={() => setShowAddStep(true)}
            style={{
              background: '#E0F7FA',
              color: '#00B4D8',
              border: '1px dashed #00B4D8',
              borderRadius: 10,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
              marginTop: sequence.emails.length > 0 ? 16 : 0,
            }}
          >
            + Add Email Step
          </button>
        )}
      </div>
    </div>
  );
}
