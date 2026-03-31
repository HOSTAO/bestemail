'use client';

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select';
  required: boolean;
  options?: string[];
};

type FormItem = {
  id: string;
  name: string;
  type?: string;
  status?: string;
  submissions_count?: number;
  submissions?: number;
  embed_code?: string;
  embedCode?: string;
  fields?: FormField[];
  settings?: {
    type?: string;
    status?: string;
    success_message?: string;
    redirect_url?: string;
    style_preset?: string;
    tag_ids?: string[];
    submitted_contact_tags?: string[];
    sequence_id?: string;
  };
  created_at?: string;
};

type TagItem = {
  id: string;
  name: string;
  color?: string;
};

type SequenceItem = {
  id: string;
  name: string;
  status?: string;
};

const STYLE_PRESETS = [
  { id: 'minimal_white', label: 'Minimal White', desc: 'Clean white background' },
  { id: 'full_width', label: 'Full Width', desc: 'Light purple background, no border' },
  { id: 'dark', label: 'Dark', desc: 'Dark background with purple accents' },
];

const DEFAULT_FIELDS: FormField[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'first_name', label: 'First Name', type: 'text', required: false },
];

const AVAILABLE_FIELD_TYPES: Array<{ name: string; label: string; type: 'text' | 'email' }> = [
  { name: 'first_name', label: 'First Name', type: 'text' },
  { name: 'last_name', label: 'Last Name', type: 'text' },
  { name: 'company', label: 'Company', type: 'text' },
  { name: 'phone', label: 'Phone', type: 'text' },
  { name: 'website', label: 'Website', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
];

const formTemplates = [
  { id: 'newsletter', icon: '📬', name: 'Subscribe to my updates', desc: 'Simple newsletter signup', type: 'embedded' },
  { id: 'loyalty', icon: '⭐', name: 'Join our loyalty program', desc: 'Build a VIP customer list', type: 'embedded' },
  { id: 'offers', icon: '🎁', name: 'Get exclusive offers', desc: 'Special deals for subscribers', type: 'popup' },
  { id: 'event', icon: '🎉', name: 'Event registration', desc: 'Sign up for your next event', type: 'landing' },
];

export default function FormsPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);
  const [editingForm, setEditingForm] = useState<FormItem | null>(null);
  const isMobile = useIsMobile();

  // Create form state
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('embedded');
  const [newStatus, setNewStatus] = useState('active');
  const [newSuccessMessage, setNewSuccessMessage] = useState('Thank you for signing up!');
  const [newRedirectUrl, setNewRedirectUrl] = useState('');
  const [newStylePreset, setNewStylePreset] = useState('minimal_white');
  const [newFields, setNewFields] = useState<FormField[]>([...DEFAULT_FIELDS]);
  const [newSelectedTags, setNewSelectedTags] = useState<string[]>([]);
  const [newSequenceId, setNewSequenceId] = useState('');
  const [newCustomFieldName, setNewCustomFieldName] = useState('');
  const [newCustomFieldLabel, setNewCustomFieldLabel] = useState('');

  // Tags and sequences from API
  const [tags, setTags] = useState<TagItem[]>([]);
  const [sequences, setSequences] = useState<SequenceItem[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const loadForms = useCallback(async () => {
    try {
      const res = await fetch('/api/forms');
      if (res.ok) {
        const d = await res.json();
        setForms(d.forms || d || []);
      }
    } catch (e) {
      console.error('Failed to load forms:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const d = await res.json();
        setTags(d.data || d || []);
      }
    } catch (e) {
      console.error('Failed to load tags:', e);
    }
  }, []);

  const loadSequences = useCallback(async () => {
    try {
      const res = await fetch('/api/sequences');
      if (res.ok) {
        const d = await res.json();
        setSequences(d.data || d || []);
      }
    } catch (e) {
      console.error('Failed to load sequences:', e);
    }
  }, []);

  useEffect(() => {
    loadForms();
    loadTags();
    loadSequences();
  }, [loadForms, loadTags, loadSequences]);

  const resetCreateForm = () => {
    setNewName('');
    setNewType('embedded');
    setNewStatus('active');
    setNewSuccessMessage('Thank you for signing up!');
    setNewRedirectUrl('');
    setNewStylePreset('minimal_white');
    setNewFields([...DEFAULT_FIELDS]);
    setNewSelectedTags([]);
    setNewSequenceId('');
    setNewCustomFieldName('');
    setNewCustomFieldLabel('');
  };

  const createForm = async (templateId?: string) => {
    const template = templateId ? formTemplates.find(t => t.id === templateId) : null;

    const formData = template
      ? {
          name: template.name,
          type: template.type,
          status: 'active',
          fields: DEFAULT_FIELDS,
          settings: {
            success_message: 'Thank you for signing up!',
            style_preset: 'minimal_white',
          },
        }
      : {
          name: newName,
          type: newType,
          status: newStatus,
          fields: newFields,
          settings: {
            success_message: newSuccessMessage,
            redirect_url: newRedirectUrl || undefined,
            style_preset: newStylePreset,
            tag_ids: newSelectedTags.length > 0 ? newSelectedTags : undefined,
            sequence_id: newSequenceId || undefined,
          },
        };

    if (!template && !newName.trim()) {
      toast.error('Please enter a form name');
      return;
    }

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Form created!');
      setShowCreate(false);
      resetCreateForm();
      loadForms();
    } catch {
      toast.error('Failed to create form');
    }
  };

  const addField = (fieldType: { name: string; label: string; type: 'text' | 'email' }) => {
    if (newFields.find(f => f.name === fieldType.name)) {
      toast.error(`${fieldType.label} field already added`);
      return;
    }
    setNewFields(prev => [...prev, { ...fieldType, required: false }]);
  };

  const addCustomField = () => {
    const name = newCustomFieldName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const label = newCustomFieldLabel.trim();
    if (!name || !label) {
      toast.error('Custom field name and label are required');
      return;
    }
    if (newFields.find(f => f.name === name)) {
      toast.error('Field with this name already exists');
      return;
    }
    setNewFields(prev => [...prev, { name, label, type: 'text', required: false }]);
    setNewCustomFieldName('');
    setNewCustomFieldLabel('');
  };

  const removeField = (fieldName: string) => {
    if (fieldName === 'email') {
      toast.error('Email field is required');
      return;
    }
    setNewFields(prev => prev.filter(f => f.name !== fieldName));
  };

  const toggleFieldRequired = (fieldName: string) => {
    if (fieldName === 'email') return;
    setNewFields(prev => prev.map(f =>
      f.name === fieldName ? { ...f, required: !f.required } : f
    ));
  };

  const toggleTag = (tagId: string) => {
    setNewSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const copyEmbedCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Embed code copied!');
  };

  const getEmbedCode = (form: FormItem) => {
    return form.embed_code || form.embedCode || `<script async src="${typeof window !== 'undefined' ? window.location.origin : 'https://bestemail.in'}/api/embed/${form.id}.js"></script><div id="bestemail-${form.id}"></div>`;
  };

  const getPublicUrl = (form: FormItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bestemail.in';
    return `${origin}/f/${form.id}`;
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
    color: '#1a1a2e',
  };

  const labelStyle = {
    display: 'block' as const,
    fontSize: 13,
    fontWeight: 600 as const,
    color: '#1a1a2e',
    marginBottom: 4,
  };

  const sectionTitle = {
    fontSize: 14,
    fontWeight: 600 as const,
    color: '#1a1a2e',
    marginBottom: 8,
    marginTop: 20,
  };

  const smallBtn = (active?: boolean) => ({
    borderRadius: 8,
    background: active ? '#00B4D8' : '#F8F9FF',
    color: active ? '#fff' : '#64648b',
    border: active ? '1px solid #00B4D8' : '1px solid #E0F7FA',
    padding: '6px 12px',
    fontSize: 12,
    fontWeight: 600 as const,
    cursor: 'pointer' as const,
    minHeight: 32,
  });

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>Loading forms...</div>;
  }

  const activeCount = forms.filter(f => (f.status || f.settings?.status) === 'active').length;
  const totalSubmissions = forms.reduce((sum, f) => sum + (f.submissions_count || f.submissions || 0), 0);

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Forms</h1>
          <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 15 }}>Build forms, capture subscribers, and grow your audience</p>
        </div>
        <button onClick={() => { resetCreateForm(); setShowCreate(true); setEditingForm(null); }} style={{
          borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
          padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          minHeight: 44, width: isMobile ? '100%' : 'auto',
        }}>+ Create Form</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Forms', value: forms.length },
          { label: 'Active', value: activeCount },
          { label: 'Total Signups', value: totalSubmissions },
        ].map(s => (
          <div key={s.label} style={{ ...cardStyle, padding: isMobile ? 16 : '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#8b8ba7' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginTop: 4 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Templates */}
      {!showCreate && forms.length < 4 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 12 }}>Quick Start: Pick a template</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {formTemplates.map(t => (
              <button key={t.id} onClick={() => createForm(t.id)} style={{
                ...cardStyle, padding: 16, cursor: 'pointer', textAlign: 'left' as const, minHeight: 44,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 4 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Form */}
      {showCreate && (
        <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#1a1a2e' }}>
            {editingForm ? 'Edit Form' : 'Create a New Form'}
          </h3>

          {/* Basic Settings */}
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={labelStyle}>Form Name *</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g., Newsletter Signup"
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Form Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)} style={inputStyle}>
                  <option value="embedded">Embedded on your website</option>
                  <option value="popup">Popup on your website</option>
                  <option value="landing">Standalone landing page</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={inputStyle}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fields Builder */}
          <div style={sectionTitle}>Form Fields</div>
          <div style={{ background: '#F8F9FF', borderRadius: 10, padding: 14, border: '1px solid #E0F7FA' }}>
            {newFields.map((field, i) => (
              <div key={field.name} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0',
                borderTop: i > 0 ? '1px solid #E0F7FA' : 'none',
                flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{field.label}</span>
                  <span style={{ fontSize: 12, color: '#8b8ba7', marginLeft: 6 }}>({field.type})</span>
                </div>
                <button
                  onClick={() => toggleFieldRequired(field.name)}
                  style={smallBtn(field.required)}
                >
                  {field.required ? 'Required' : 'Optional'}
                </button>
                {field.name !== 'email' && (
                  <button
                    onClick={() => removeField(field.name)}
                    style={{ ...smallBtn(), color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Add standard fields */}
            <div style={{ marginTop: 12, borderTop: '1px solid #E0F7FA', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 8 }}>Add a field:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {AVAILABLE_FIELD_TYPES.filter(ft => !newFields.find(f => f.name === ft.name)).map(ft => (
                  <button key={ft.name} onClick={() => addField(ft)} style={smallBtn()}>
                    + {ft.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom field */}
            <div style={{ marginTop: 12, borderTop: '1px solid #E0F7FA', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 8 }}>Add custom field:</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={newCustomFieldLabel}
                  onChange={e => {
                    setNewCustomFieldLabel(e.target.value);
                    setNewCustomFieldName(e.target.value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
                  }}
                  placeholder="Label (e.g., Job Title)"
                  style={{ ...inputStyle, flex: 1, minWidth: 140 }}
                />
                <button onClick={addCustomField} style={smallBtn(true)}>+ Add</button>
              </div>
              {newCustomFieldName && (
                <div style={{ fontSize: 11, color: '#8b8ba7', marginTop: 4 }}>Field name: {newCustomFieldName}</div>
              )}
            </div>
          </div>

          {/* Tags to Apply */}
          <div style={sectionTitle}>Tags to Apply on Submit</div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              style={{
                ...inputStyle,
                textAlign: 'left' as const,
                cursor: 'pointer',
                background: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: newSelectedTags.length > 0 ? '#1a1a2e' : '#8b8ba7' }}>
                {newSelectedTags.length > 0
                  ? `${newSelectedTags.length} tag${newSelectedTags.length > 1 ? 's' : ''} selected`
                  : 'Select tags to apply...'}
              </span>
              <span style={{ fontSize: 10, color: '#8b8ba7' }}>{showTagDropdown ? '▲' : '▼'}</span>
            </button>

            {showTagDropdown && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                background: '#fff', border: '1px solid #E0F7FA', borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto' as const,
                marginTop: 4,
              }}>
                {tags.length === 0 ? (
                  <div style={{ padding: 12, fontSize: 13, color: '#8b8ba7', textAlign: 'center' as const }}>
                    No tags available. Create tags first.
                  </div>
                ) : (
                  tags.map(tag => (
                    <div
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', cursor: 'pointer',
                        background: newSelectedTags.includes(tag.id) ? '#E0F7FA' : 'transparent',
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: 4,
                        border: newSelectedTags.includes(tag.id) ? '2px solid #00B4D8' : '2px solid #E0F7FA',
                        background: newSelectedTags.includes(tag.id) ? '#00B4D8' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: '#fff', flexShrink: 0,
                      }}>
                        {newSelectedTags.includes(tag.id) ? '✓' : ''}
                      </div>
                      {tag.color && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: tag.color, flexShrink: 0 }} />
                      )}
                      <span style={{ fontSize: 13, color: '#1a1a2e' }}>{tag.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {newSelectedTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {newSelectedTags.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <span key={tagId} style={{
                    background: '#E0F7FA', color: '#00B4D8', borderRadius: 20,
                    padding: '3px 10px', fontSize: 12, fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    {tag.name}
                    <button onClick={() => toggleTag(tagId)} style={{
                      background: 'none', border: 'none', color: '#00B4D8', cursor: 'pointer',
                      fontSize: 14, padding: 0, lineHeight: 1,
                    }}>x</button>
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Sequence Enrollment */}
          <div style={sectionTitle}>Enroll in Sequence on Submit</div>
          <select value={newSequenceId} onChange={e => setNewSequenceId(e.target.value)} style={inputStyle}>
            <option value="">No sequence enrollment</option>
            {sequences.map(seq => (
              <option key={seq.id} value={seq.id}>{seq.name}{seq.status ? ` (${seq.status})` : ''}</option>
            ))}
          </select>

          {/* Success Settings */}
          <div style={sectionTitle}>After Submission</div>
          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={labelStyle}>Success Message</label>
              <input
                type="text"
                value={newSuccessMessage}
                onChange={e => setNewSuccessMessage(e.target.value)}
                placeholder="Thank you for signing up!"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Redirect URL (optional)</label>
              <input
                type="url"
                value={newRedirectUrl}
                onChange={e => setNewRedirectUrl(e.target.value)}
                placeholder="https://example.com/thank-you"
                style={inputStyle}
              />
              <div style={{ fontSize: 11, color: '#8b8ba7', marginTop: 4 }}>
                Leave blank to show the success message. If set, redirects after brief delay.
              </div>
            </div>
          </div>

          {/* Style Preset */}
          <div style={sectionTitle}>Style Preset</div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 10 }}>
            {STYLE_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => setNewStylePreset(preset.id)}
                style={{
                  ...cardStyle,
                  padding: 14,
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  border: newStylePreset === preset.id ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                  background: newStylePreset === preset.id ? '#E0F7FA' : '#fff',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{preset.label}</div>
                <div style={{ fontSize: 11, color: '#8b8ba7', marginTop: 2 }}>{preset.desc}</div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
            <button onClick={() => createForm()} style={{
              borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
              padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              minHeight: 44, width: isMobile ? '100%' : 'auto',
            }}>
              {editingForm ? 'Save Changes' : 'Create Form'}
            </button>
            <button onClick={() => { setShowCreate(false); setEditingForm(null); }} style={{
              borderRadius: 10, background: '#fff', color: '#64648b', border: '1px solid #E0F7FA',
              padding: '10px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              minHeight: 44, width: isMobile ? '100%' : 'auto',
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Forms List */}
      <div style={cardStyle}>
        {forms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p style={{ color: '#8b8ba7', fontSize: 15, marginBottom: 16 }}>No forms yet. Create your first one above!</p>
          </div>
        ) : (
          <div>
            {forms.map((form, i) => {
              const status = form.status || form.settings?.status || 'draft';
              const formType = form.type || form.settings?.type || 'embedded';
              const subs = form.submissions_count || form.submissions || 0;
              const embedCode = getEmbedCode(form);
              const publicUrl = getPublicUrl(form);
              const isSelected = selectedForm?.id === form.id;

              return (
                <div key={form.id}>
                  <div
                    onClick={() => setSelectedForm(isSelected ? null : form)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: isMobile ? '14px 16px' : '16px 20px',
                      borderTop: i > 0 ? '1px solid #F0F0F8' : 'none',
                      cursor: 'pointer',
                      background: isSelected ? '#F8F9FF' : 'transparent',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{form.name}</div>
                      <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 2 }}>
                        {formType} &middot; {subs} signup{subs !== 1 ? 's' : ''}
                        {form.fields && form.fields.length > 0 && (
                          <span> &middot; {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: status === 'active' ? '#dcfce7' : '#E0F7FA',
                      color: status === 'active' ? '#16a34a' : '#00B4D8',
                    }}>{status === 'active' ? 'Active' : 'Draft'}</span>
                  </div>

                  {isSelected && (
                    <div style={{ padding: isMobile ? '0 16px 16px' : '0 20px 20px', background: '#F8F9FF' }}>
                      {/* Embed Code Section */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 6 }}>Embed Code</div>
                        <div style={{
                          background: '#fff', border: '1px solid #E0F7FA', borderRadius: 8,
                          padding: 12, fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all' as const,
                          color: '#64648b', overflowWrap: 'break-word' as const,
                        }}>
                          {embedCode}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                          <button onClick={() => copyEmbedCode(embedCode)} style={{
                            borderRadius: 8, background: '#00B4D8', color: '#fff',
                            border: 'none', padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            minHeight: 36,
                          }}>Copy Embed Code</button>
                          <button onClick={() => copyEmbedCode(publicUrl)} style={{
                            borderRadius: 8, background: '#E0F7FA', color: '#00B4D8',
                            border: '1px solid #E0F7FA', padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            minHeight: 36,
                          }}>Copy Public URL</button>
                        </div>
                      </div>

                      {/* Public URL */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Public Form Page</div>
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 13, color: '#00B4D8', fontWeight: 500, textDecoration: 'none', wordBreak: 'break-all' as const }}
                        >
                          {publicUrl}
                        </a>
                      </div>

                      {/* Tracking Pixel */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Website Tracking Pixel</div>
                        <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 6 }}>
                          Add this image tag to track page visits for a subscriber:
                        </div>
                        <div style={{
                          background: '#fff', border: '1px solid #E0F7FA', borderRadius: 8,
                          padding: 10, fontFamily: 'monospace', fontSize: 11,
                          color: '#64648b', wordBreak: 'break-all' as const,
                        }}>
                          {`<img src="${typeof window !== 'undefined' ? window.location.origin : 'https://bestemail.in'}/api/track/pixel.gif?uid=SUBSCRIBER_ID&page={{page_url}}" width="1" height="1" style="display:none" />`}
                        </div>
                      </div>

                      {/* Event Tracking Snippet */}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Event Tracking Script</div>
                        <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 6 }}>
                          Track custom events from your website:
                        </div>
                        <div style={{
                          background: '#fff', border: '1px solid #E0F7FA', borderRadius: 8,
                          padding: 10, fontFamily: 'monospace', fontSize: 11,
                          color: '#64648b', wordBreak: 'break-all' as const,
                          whiteSpace: 'pre-wrap' as const,
                        }}>
{`fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://bestemail.in'}/api/track/event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'subscriber@example.com',
    event_type: 'page_view',
    data: { page: window.location.href },
    source: 'website'
  })
});`}
                        </div>
                        <button
                          onClick={() => copyEmbedCode(`fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://bestemail.in'}/api/track/event', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    email: 'subscriber@example.com',\n    event_type: 'page_view',\n    data: { page: window.location.href },\n    source: 'website'\n  })\n});`)}
                          style={{
                            borderRadius: 8, background: '#E0F7FA', color: '#00B4D8',
                            border: '1px solid #E0F7FA', padding: '6px 12px', fontSize: 11, fontWeight: 600,
                            cursor: 'pointer', marginTop: 8, minHeight: 32,
                          }}
                        >Copy Event Script</button>
                      </div>

                      {/* Form Settings Summary */}
                      {form.settings && (
                        <div style={{ marginTop: 16, borderTop: '1px solid #E0F7FA', paddingTop: 12 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>Settings</div>
                          <div style={{ fontSize: 12, color: '#64648b', display: 'grid', gap: 4 }}>
                            {form.settings.success_message && (
                              <div>Success message: <span style={{ color: '#1a1a2e' }}>{form.settings.success_message}</span></div>
                            )}
                            {form.settings.redirect_url && (
                              <div>Redirect URL: <span style={{ color: '#00B4D8' }}>{form.settings.redirect_url}</span></div>
                            )}
                            {form.settings.style_preset && (
                              <div>Style: <span style={{ color: '#1a1a2e' }}>{STYLE_PRESETS.find(p => p.id === form.settings?.style_preset)?.label || form.settings.style_preset}</span></div>
                            )}
                            {form.settings.tag_ids && form.settings.tag_ids.length > 0 && (
                              <div>Tags: <span style={{ color: '#1a1a2e' }}>{form.settings.tag_ids.length} tag{form.settings.tag_ids.length > 1 ? 's' : ''} applied</span></div>
                            )}
                            {form.settings.sequence_id && (
                              <div>Sequence: <span style={{ color: '#1a1a2e' }}>{sequences.find(s => s.id === form.settings?.sequence_id)?.name || 'Linked'}</span></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
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
