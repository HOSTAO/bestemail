'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';
import MigrationBanner from '@/components/MigrationBanner';

/* ─── types ─── */
interface Automation {
  id: string;
  name: string;
  status: 'active' | 'paused';
  trigger_type: string;
  trigger_config: Record<string, unknown>;
  action_type: string;
  action_config: Record<string, unknown>;
  run_count: number;
  created_at: string;
  updated_at: string;
}

interface TagOption { id: string; name: string; color?: string }
interface FormOption { id: string; name: string }
interface SequenceOption { id: string; name: string }

type TriggerType = 'tag_added' | 'form_submitted' | 'subscriber_created' | 'lead_score_threshold';
type ActionType = 'add_tag' | 'remove_tag' | 'enroll_sequence' | 'send_email' | 'update_score';

const TRIGGER_LABELS: Record<TriggerType, string> = {
  tag_added: 'Tag Added',
  form_submitted: 'Form Submitted',
  subscriber_created: 'Subscriber Created',
  lead_score_threshold: 'Lead Score Threshold',
};

const ACTION_LABELS: Record<ActionType, string> = {
  add_tag: 'Add Tag',
  remove_tag: 'Remove Tag',
  enroll_sequence: 'Enroll in Sequence',
  send_email: 'Send Email',
  update_score: 'Update Score',
};

/* ─── styles ─── */
const cardStyle: React.CSSProperties = {
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
  fontSize: 15,
  boxSizing: 'border-box',
  outline: 'none',
  color: '#1a1a2e',
  background: '#fff',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%238b8ba7\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: 36,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: '#1a1a2e',
  display: 'block',
  marginBottom: 6,
};

const btnPrimary: React.CSSProperties = {
  borderRadius: 10,
  background: '#00B4D8',
  color: '#fff',
  border: 'none',
  padding: '11px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  minHeight: 44,
};

const btnSecondary: React.CSSProperties = {
  borderRadius: 10,
  background: '#fff',
  color: '#64648b',
  border: '1px solid #E0F7FA',
  padding: '11px 20px',
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  minHeight: 44,
};

/* ─── helpers ─── */
function describeTrigger(type: string, config: Record<string, unknown>, tags: TagOption[], forms: FormOption[]): string {
  switch (type) {
    case 'tag_added': {
      const tag = tags.find(t => t.id === config.tag_id);
      return tag ? `Tag "${tag.name}" added` : 'Any tag added';
    }
    case 'form_submitted': {
      const form = forms.find(f => f.id === config.form_id);
      return form ? `Form "${form.name}" submitted` : 'Any form submitted';
    }
    case 'subscriber_created':
      return 'New subscriber created';
    case 'lead_score_threshold':
      return config.threshold !== undefined ? `Lead score reaches ${config.threshold}` : 'Lead score threshold met';
    default:
      return type;
  }
}

function describeAction(type: string, config: Record<string, unknown>, tags: TagOption[], sequences: SequenceOption[]): string {
  switch (type) {
    case 'add_tag': {
      const tag = tags.find(t => t.id === config.tag_id);
      return tag ? `Add tag "${tag.name}"` : 'Add tag';
    }
    case 'remove_tag': {
      const tag = tags.find(t => t.id === config.tag_id);
      return tag ? `Remove tag "${tag.name}"` : 'Remove tag';
    }
    case 'enroll_sequence': {
      const seq = sequences.find(s => s.id === config.sequence_id);
      return seq ? `Enroll in "${seq.name}"` : 'Enroll in sequence';
    }
    case 'send_email':
      return config.subject ? `Send email: "${config.subject}"` : 'Send email';
    case 'update_score': {
      const delta = Number(config.score_delta) || 0;
      return delta >= 0 ? `Increase score by +${delta}` : `Decrease score by ${delta}`;
    }
    default:
      return type;
  }
}

/* ─── component ─── */
export default function AutomationPage() {
  const isMobile = useIsMobile();

  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrationPending, setMigrationPending] = useState(false);
  const [saving, setSaving] = useState(false);

  // Options for pickers
  const [tags, setTags] = useState<TagOption[]>([]);
  const [forms, setForms] = useState<FormOption[]>([]);
  const [sequences, setSequences] = useState<SequenceOption[]>([]);

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formTriggerType, setFormTriggerType] = useState<TriggerType>('subscriber_created');
  const [formTriggerConfig, setFormTriggerConfig] = useState<Record<string, unknown>>({});
  const [formActionType, setFormActionType] = useState<ActionType>('add_tag');
  const [formActionConfig, setFormActionConfig] = useState<Record<string, unknown>>({});
  const [formStatus, setFormStatus] = useState<'active' | 'paused'>('active');

  /* ─── data loading ─── */
  const fetchAutomations = useCallback(async () => {
    try {
      const res = await fetch('/api/automations');
      const json = await res.json();
      if (json.migrationRequired) { setMigrationPending(true); setLoading(false); return; }
      if (res.ok) setAutomations(json.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const fetchOptions = useCallback(async () => {
    const [tagsRes, formsRes, seqRes] = await Promise.allSettled([
      fetch('/api/tags').then(r => r.json()),
      fetch('/api/forms').then(r => r.json()),
      fetch('/api/sequences').then(r => r.json()),
    ]);
    if (tagsRes.status === 'fulfilled') setTags(tagsRes.value.data || []);
    if (formsRes.status === 'fulfilled') setForms(formsRes.value.data || []);
    if (seqRes.status === 'fulfilled') setSequences(seqRes.value.data || []);
  }, []);

  useEffect(() => { fetchAutomations(); fetchOptions(); }, [fetchAutomations, fetchOptions]);

  /* ─── editor helpers ─── */
  function resetEditor() {
    setEditId(null);
    setFormName('');
    setFormTriggerType('subscriber_created');
    setFormTriggerConfig({});
    setFormActionType('add_tag');
    setFormActionConfig({});
    setFormStatus('active');
  }

  function openCreate() {
    resetEditor();
    setShowEditor(true);
  }

  function openEdit(a: Automation) {
    setEditId(a.id);
    setFormName(a.name);
    setFormTriggerType(a.trigger_type as TriggerType);
    setFormTriggerConfig(a.trigger_config || {});
    setFormActionType(a.action_type as ActionType);
    setFormActionConfig(a.action_config || {});
    setFormStatus(a.status);
    setShowEditor(true);
  }

  /* ─── CRUD ─── */
  async function handleSave() {
    if (!formName.trim()) { toast.error('Please enter a name'); return; }
    setSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        trigger_type: formTriggerType,
        trigger_config: formTriggerConfig,
        action_type: formActionType,
        action_config: formActionConfig,
        status: formStatus,
      };
      const url = editId ? `/api/automations/${editId}` : '/api/automations';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');
      toast.success(editId ? 'Automation updated' : 'Automation created');
      setShowEditor(false);
      resetEditor();
      fetchAutomations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this automation?')) return;
    try {
      const res = await fetch(`/api/automations/${id}`, { method: 'DELETE' });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error); }
      toast.success('Automation deleted');
      fetchAutomations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  }

  async function handleToggleStatus(a: Automation) {
    const newStatus = a.status === 'active' ? 'paused' : 'active';
    try {
      const res = await fetch(`/api/automations/${a.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error); }
      toast.success(newStatus === 'active' ? 'Automation activated' : 'Automation paused');
      fetchAutomations();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    }
  }

  /* ─── trigger config UI ─── */
  function renderTriggerConfig() {
    switch (formTriggerType) {
      case 'tag_added':
        return (
          <div>
            <label style={labelStyle}>Which tag?</label>
            <select
              style={selectStyle}
              value={(formTriggerConfig.tag_id as string) || ''}
              onChange={e => setFormTriggerConfig({ tag_id: e.target.value || undefined })}
            >
              <option value="">Any tag</option>
              {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        );
      case 'form_submitted':
        return (
          <div>
            <label style={labelStyle}>Which form?</label>
            <select
              style={selectStyle}
              value={(formTriggerConfig.form_id as string) || ''}
              onChange={e => setFormTriggerConfig({ form_id: e.target.value || undefined })}
            >
              <option value="">Any form</option>
              {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        );
      case 'subscriber_created':
        return (
          <div style={{ padding: '10px 14px', background: '#E0F7FA', borderRadius: 8, fontSize: 13, color: '#00B4D8' }}>
            Triggers when any new subscriber is created. No additional configuration needed.
          </div>
        );
      case 'lead_score_threshold':
        return (
          <div>
            <label style={labelStyle}>Score threshold (trigger when score reaches this value)</label>
            <input
              type="number"
              style={inputStyle}
              value={(formTriggerConfig.threshold as number) || ''}
              onChange={e => setFormTriggerConfig({ threshold: Number(e.target.value) || 0 })}
              placeholder="e.g. 50"
            />
          </div>
        );
      default:
        return null;
    }
  }

  /* ─── action config UI ─── */
  function renderActionConfig() {
    switch (formActionType) {
      case 'add_tag':
      case 'remove_tag':
        return (
          <div>
            <label style={labelStyle}>Select tag</label>
            <select
              style={selectStyle}
              value={(formActionConfig.tag_id as string) || ''}
              onChange={e => setFormActionConfig({ tag_id: e.target.value })}
            >
              <option value="">-- Select a tag --</option>
              {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        );
      case 'enroll_sequence':
        return (
          <div>
            <label style={labelStyle}>Select sequence</label>
            <select
              style={selectStyle}
              value={(formActionConfig.sequence_id as string) || ''}
              onChange={e => setFormActionConfig({ sequence_id: e.target.value })}
            >
              <option value="">-- Select a sequence --</option>
              {sequences.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        );
      case 'send_email':
        return (
          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <label style={labelStyle}>Email subject</label>
              <input
                type="text"
                style={inputStyle}
                value={(formActionConfig.subject as string) || ''}
                onChange={e => setFormActionConfig({ ...formActionConfig, subject: e.target.value })}
                placeholder="Welcome to our list!"
              />
            </div>
            <div>
              <label style={labelStyle}>Email body</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical', fontFamily: 'inherit' }}
                value={(formActionConfig.body as string) || ''}
                onChange={e => setFormActionConfig({ ...formActionConfig, body: e.target.value })}
                placeholder="Write your email content here..."
              />
            </div>
          </div>
        );
      case 'update_score':
        return (
          <div>
            <label style={labelStyle}>Score change (+/-)</label>
            <input
              type="number"
              style={inputStyle}
              value={(formActionConfig.score_delta as number) ?? ''}
              onChange={e => setFormActionConfig({ score_delta: Number(e.target.value) })}
              placeholder="e.g. 10 or -5"
            />
          </div>
        );
      default:
        return null;
    }
  }

  /* ─── render ─── */
  if (migrationPending) return <MigrationBanner />;

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto', background: '#F8F9FF', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Automations</h1>
          <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 15, margin: 0 }}>
            Create IF/THEN rules to automate your email marketing
          </p>
        </div>
        {!showEditor && (
          <button onClick={openCreate} style={btnPrimary}>
            + Create Automation
          </button>
        )}
      </div>

      {/* Editor */}
      {showEditor && (
        <div style={{ ...cardStyle, padding: isMobile ? 16 : 28, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px 0' }}>
            {editId ? 'Edit Automation' : 'Create Automation'}
          </h2>

          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Automation Name</label>
            <input
              type="text"
              style={inputStyle}
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="e.g., Tag VIP on high score"
            />
          </div>

          {/* IF / THEN visual */}
          <div style={{ display: 'grid', gap: 0, marginBottom: 20 }}>
            {/* IF section */}
            <div style={{ padding: isMobile ? 16 : 20, background: '#E0F7FA', borderRadius: '12px 12px 0 0', border: '2px solid #00B4D8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 8, background: '#00B4D8', color: '#fff',
                  fontSize: 12, fontWeight: 700,
                }}>IF</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>When this happens...</span>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Trigger type</label>
                  <select
                    style={selectStyle}
                    value={formTriggerType}
                    onChange={e => { setFormTriggerType(e.target.value as TriggerType); setFormTriggerConfig({}); }}
                  >
                    {(Object.keys(TRIGGER_LABELS) as TriggerType[]).map(k => (
                      <option key={k} value={k}>{TRIGGER_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
                {renderTriggerConfig()}
              </div>
            </div>

            {/* Arrow connector */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '4px 0', background: '#F8F9FF',
            }}>
              <div style={{ width: 2, height: 16, background: '#00B4D8' }} />
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: '#00B4D8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 18, fontWeight: 700,
              }}>
                &#8595;
              </div>
              <div style={{ width: 2, height: 16, background: '#00B4D8' }} />
            </div>

            {/* THEN section */}
            <div style={{ padding: isMobile ? 16 : 20, background: '#F0FDF4', borderRadius: '0 0 12px 12px', border: '2px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 38, height: 28, borderRadius: 8, background: '#10b981', color: '#fff',
                  fontSize: 12, fontWeight: 700,
                }}>THEN</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>Do this action...</span>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Action type</label>
                  <select
                    style={selectStyle}
                    value={formActionType}
                    onChange={e => { setFormActionType(e.target.value as ActionType); setFormActionConfig({}); }}
                  >
                    {(Object.keys(ACTION_LABELS) as ActionType[]).map(k => (
                      <option key={k} value={k}>{ACTION_LABELS[k]}</option>
                    ))}
                  </select>
                </div>
                {renderActionConfig()}
              </div>
            </div>
          </div>

          {/* Status toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Status:</label>
            <button
              onClick={() => setFormStatus(formStatus === 'active' ? 'paused' : 'active')}
              style={{
                width: 48, height: 26, borderRadius: 13, border: 'none',
                background: formStatus === 'active' ? '#00B4D8' : '#E0F7FA',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 10, background: '#fff',
                position: 'absolute', top: 3,
                left: formStatus === 'active' ? 25 : 3,
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }} />
            </button>
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: formStatus === 'active' ? '#10b981' : '#8b8ba7',
            }}>
              {formStatus === 'active' ? 'Active' : 'Paused'}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={handleSave} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
              {saving ? 'Saving...' : editId ? 'Update Automation' : 'Create Automation'}
            </button>
            <button onClick={() => { setShowEditor(false); resetEditor(); }} style={btnSecondary}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Automations List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#8b8ba7' }}>Loading automations...</div>
      ) : automations.length === 0 && !showEditor ? (
        <div style={{ ...cardStyle, padding: isMobile ? 24 : 48, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#9889;</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px 0' }}>No automations yet</h2>
          <p style={{ color: '#8b8ba7', fontSize: 15, margin: '0 0 20px 0' }}>
            Create your first IF/THEN automation to start automating your email marketing.
          </p>
          <button onClick={openCreate} style={btnPrimary}>
            + Create Your First Automation
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {automations.map(a => (
            <div key={a.id} style={{ ...cardStyle, padding: isMobile ? 16 : 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                {/* Left: info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{a.name}</span>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: a.status === 'active' ? '#ECFDF5' : '#F8F9FF',
                      color: a.status === 'active' ? '#10b981' : '#8b8ba7',
                    }}>
                      {a.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                  </div>

                  {/* IF -> THEN visual */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8,
                      background: '#E0F7FA', color: '#00B4D8', fontSize: 13, fontWeight: 600,
                    }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 22, height: 22, borderRadius: 6, background: '#00B4D8', color: '#fff',
                        fontSize: 10, fontWeight: 700,
                      }}>IF</span>
                      {describeTrigger(a.trigger_type, a.trigger_config, tags, forms)}
                    </span>

                    <span style={{ color: '#00B4D8', fontSize: 18, fontWeight: 700 }}>&#8594;</span>

                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8,
                      background: '#F0FDF4', color: '#10b981', fontSize: 13, fontWeight: 600,
                    }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 32, height: 22, borderRadius: 6, background: '#10b981', color: '#fff',
                        fontSize: 10, fontWeight: 700,
                      }}>THEN</span>
                      {describeAction(a.action_type, a.action_config, tags, sequences)}
                    </span>
                  </div>

                  {/* Run count */}
                  <div style={{ marginTop: 10, fontSize: 13, color: '#64648b' }}>
                    Executed {a.run_count || 0} time{(a.run_count || 0) !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Right: actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleStatus(a)}
                    title={a.status === 'active' ? 'Pause' : 'Activate'}
                    style={{
                      width: 48, height: 26, borderRadius: 13, border: 'none',
                      background: a.status === 'active' ? '#00B4D8' : '#E0F7FA',
                      position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 10, background: '#fff',
                      position: 'absolute', top: 3,
                      left: a.status === 'active' ? 25 : 3,
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }} />
                  </button>

                  <button
                    onClick={() => openEdit(a)}
                    style={{
                      padding: '7px 14px', borderRadius: 8, border: '1px solid #E0F7FA',
                      background: '#fff', color: '#00B4D8', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', minHeight: 36,
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    style={{
                      padding: '7px 14px', borderRadius: 8, border: '1px solid #E0F7FA',
                      background: '#fff', color: '#e53e3e', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', minHeight: 36,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
