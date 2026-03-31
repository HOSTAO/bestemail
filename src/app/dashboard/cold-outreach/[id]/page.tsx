'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Step = {
  id: string;
  step_number: number;
  subject: string;
  body_html: string;
  delay_days: number;
  stop_on_reply: boolean;
};

type Prospect = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  status: string;
  current_step: number;
  next_send_at: string | null;
  custom_vars: Record<string, string>;
};

type Campaign = {
  id: string;
  name: string;
  from_name: string;
  from_email: string;
  reply_to: string;
  daily_limit: number;
  status: string;
  sent_count: number;
  reply_count: number;
  open_count: number;
  steps: Step[];
  prospect_stats: Record<string, number>;
};

const PERSONALIZATION_TOKENS = [
  { token: '{{first_name}}', label: 'First Name' },
  { token: '{{last_name}}', label: 'Last Name' },
  { token: '{{company}}', label: 'Company' },
  { token: '{{icebreaker}}', label: 'Icebreaker' },
  { token: '{{email}}', label: 'Email' },
];

const DAILY_LIMITS = [50, 100, 200, 500];

const prospectStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#64648b', bg: '#F0F0F8' },
  active: { label: 'Active', color: '#00B4D8', bg: '#E0F7FA' },
  replied: { label: 'Replied', color: '#10b981', bg: '#ecfdf5' },
  bounced: { label: 'Bounced', color: '#e53e3e', bg: '#fef2f2' },
  completed: { label: 'Completed', color: '#2563eb', bg: '#eff6ff' },
};

export default function ColdCampaignEditorPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prospectFilter, setProspectFilter] = useState('all');

  // Editable campaign fields
  const [name, setName] = useState('');
  const [fromName, setFromName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [dailyLimit, setDailyLimit] = useState(50);
  const [status, setStatus] = useState('paused');

  // Steps editing
  const [steps, setSteps] = useState<Step[]>([]);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editDelay, setEditDelay] = useState(1);
  const [editStopOnReply, setEditStopOnReply] = useState(true);

  // CSV upload
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvPreview, setCsvPreview] = useState<Array<Record<string, string>>>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  const loadCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}`);
      if (!res.ok) {
        toast.error('Campaign not found');
        router.push('/dashboard/cold-outreach');
        return;
      }
      const data = await res.json();
      setCampaign(data);
      setName(data.name || '');
      setFromName(data.from_name || '');
      setFromEmail(data.from_email || '');
      setReplyTo(data.reply_to || '');
      setDailyLimit(data.daily_limit || 50);
      setStatus(data.status || 'paused');
      setSteps(data.steps || []);
    } catch {
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }, [campaignId, router]);

  const loadProspects = useCallback(async () => {
    try {
      const url = prospectFilter !== 'all'
        ? `/api/cold-outreach/${campaignId}/prospects?status=${prospectFilter}`
        : `/api/cold-outreach/${campaignId}/prospects`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProspects(data || []);
      }
    } catch (e) {
      console.error('Failed to load prospects:', e);
    }
  }, [campaignId, prospectFilter]);

  useEffect(() => { loadCampaign(); }, [loadCampaign]);
  useEffect(() => { if (!loading) loadProspects(); }, [loading, loadProspects]);

  const saveCampaign = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, from_name: fromName, from_email: fromEmail, reply_to: replyTo, daily_limit: dailyLimit, status }),
      });
      if (res.ok) {
        toast.success('Campaign saved');
        const data = await res.json();
        setCampaign(prev => prev ? { ...prev, ...data } : prev);
      } else {
        toast.error('Failed to save');
      }
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    setStatus(newStatus);
    try {
      await fetch(`/api/cold-outreach/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(newStatus === 'active' ? 'Campaign activated' : 'Campaign paused');
    } catch {
      setStatus(status);
      toast.error('Failed to update status');
    }
  };

  // Steps
  const addStep = async () => {
    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'New Step',
          body_html: '<p>Hello {{first_name}},</p><p></p><p>Best regards</p>',
          delay_days: steps.length === 0 ? 0 : 2,
          stop_on_reply: true,
        }),
      });
      if (res.ok) {
        const step = await res.json();
        setSteps(prev => [...prev, step]);
        setEditingStepId(step.id);
        setEditSubject(step.subject);
        setEditBody(step.body_html);
        setEditDelay(step.delay_days);
        setEditStopOnReply(step.stop_on_reply);
        toast.success('Step added');
      }
    } catch {
      toast.error('Failed to add step');
    }
  };

  const startEditStep = (step: Step) => {
    setEditingStepId(step.id);
    setEditSubject(step.subject);
    setEditBody(step.body_html);
    setEditDelay(step.delay_days);
    setEditStopOnReply(step.stop_on_reply);
  };

  const saveStep = async () => {
    if (!editingStepId) return;
    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}/steps/${editingStepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: editSubject, body_html: editBody, delay_days: editDelay, stop_on_reply: editStopOnReply }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSteps(prev => prev.map(s => s.id === editingStepId ? updated : s));
        setEditingStepId(null);
        toast.success('Step saved');
      }
    } catch {
      toast.error('Failed to save step');
    }
  };

  const deleteStep = async (stepId: string) => {
    if (!confirm('Delete this step?')) return;
    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}/steps/${stepId}`, { method: 'DELETE' });
      if (res.ok) {
        setSteps(prev => {
          const filtered = prev.filter(s => s.id !== stepId);
          return filtered.map((s, i) => ({ ...s, step_number: i + 1 }));
        });
        if (editingStepId === stepId) setEditingStepId(null);
        toast.success('Step deleted');
      }
    } catch {
      toast.error('Failed to delete step');
    }
  };

  const insertToken = (token: string) => {
    if (bodyTextareaRef.current) {
      const ta = bodyTextareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = editBody.substring(0, start) + token + editBody.substring(end);
      setEditBody(newVal);
      setTimeout(() => {
        ta.focus();
        ta.selectionStart = ta.selectionEnd = start + token.length;
      }, 0);
    } else {
      setEditBody(prev => prev + token);
    }
  };

  // CSV Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length < 2) {
        toast.error('CSV must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      setCsvHeaders(headers);

      const rows: Array<Record<string, string>> = [];
      for (let i = 1; i < Math.min(lines.length, 101); i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
        rows.push(row);
      }

      setCsvPreview(rows);
      setShowCsvUpload(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const importCsv = async () => {
    if (csvPreview.length === 0) return;
    setImporting(true);

    const emailCol = csvHeaders.find(h => h.toLowerCase().includes('email')) || csvHeaders[0];
    const firstNameCol = csvHeaders.find(h => h.toLowerCase().includes('first') && h.toLowerCase().includes('name'));
    const lastNameCol = csvHeaders.find(h => h.toLowerCase().includes('last') && h.toLowerCase().includes('name'));
    const companyCol = csvHeaders.find(h => h.toLowerCase().includes('company') || h.toLowerCase().includes('organization'));

    const standardFields = [emailCol, firstNameCol, lastNameCol, companyCol].filter(Boolean);

    const prospects = csvPreview.map(row => {
      const customVars: Record<string, string> = {};
      csvHeaders.forEach(h => {
        if (!standardFields.includes(h) && row[h]) {
          customVars[h.toLowerCase().replace(/\s+/g, '_')] = row[h];
        }
      });

      return {
        email: row[emailCol] || '',
        first_name: firstNameCol ? row[firstNameCol] : '',
        last_name: lastNameCol ? row[lastNameCol] : '',
        company: companyCol ? row[companyCol] : '',
        custom_vars: customVars,
      };
    });

    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}/prospects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospects }),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success(`Imported ${result.imported} prospects`);
        setShowCsvUpload(false);
        setCsvPreview([]);
        loadProspects();
        loadCampaign();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Import failed');
      }
    } catch {
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  const markReplied = async (prospectId: string) => {
    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}/prospects/${prospectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'replied' }),
      });
      if (res.ok) {
        setProspects(prev => prev.map(p => p.id === prospectId ? { ...p, status: 'replied' } : p));
        toast.success('Marked as replied');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  const deleteProspect = async (prospectId: string) => {
    try {
      const res = await fetch(`/api/cold-outreach/${campaignId}/prospects/${prospectId}`, { method: 'DELETE' });
      if (res.ok) {
        setProspects(prev => prev.filter(p => p.id !== prospectId));
        toast.success('Prospect removed');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: '32px',
    maxWidth: 1100,
    margin: '0 auto',
    background: '#F8F9FF',
    minHeight: '100vh',
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #E0F7FA',
    borderRadius: 16,
    padding: '24px',
    marginBottom: 20,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#64648b',
    marginBottom: 6,
    display: 'block',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 14px',
    border: '1px solid #E0F7FA',
    borderRadius: 8,
    fontSize: 14,
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer',
    background: '#fff',
  };

  const purpleBtnStyle: React.CSSProperties = {
    background: '#00B4D8',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '10px 22px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };

  const outlineBtnStyle = (color: string): React.CSSProperties => ({
    background: 'none',
    border: `1px solid ${color}`,
    color,
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  });

  const badgeStyle = (color: string, bg: string): React.CSSProperties => ({
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 600,
    color,
    background: bg,
    padding: '2px 10px',
    borderRadius: 20,
  });

  const statBoxStyle: React.CSSProperties = {
    background: '#F8F9FF',
    borderRadius: 10,
    padding: '12px 18px',
    textAlign: 'center',
    flex: 1,
    minWidth: 80,
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: 80, color: '#8b8ba7' }}>Loading campaign...</div>
      </div>
    );
  }

  if (!campaign) return null;

  const stats = campaign.prospect_stats || {};

  return (
    <div style={containerStyle}>
      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard/cold-outreach')}
        style={{ background: 'none', border: 'none', color: '#00B4D8', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 16, padding: 0 }}
      >
        &larr; Back to Campaigns
      </button>

      {/* Header Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Campaign Editor</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={toggleStatus}
              style={{
                ...outlineBtnStyle(status === 'active' ? '#d97706' : '#10b981'),
                fontWeight: 600,
              }}
            >
              {status === 'active' ? 'Pause' : 'Activate'}
            </button>
            <span style={badgeStyle(
              status === 'active' ? '#10b981' : '#64648b',
              status === 'active' ? '#ecfdf5' : '#F0F0F8',
            )}>
              {status === 'active' ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={labelStyle}>Campaign Name</label>
            <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="My Cold Campaign" />
          </div>
          <div>
            <label style={labelStyle}>From Name</label>
            <input style={inputStyle} value={fromName} onChange={e => setFromName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label style={labelStyle}>From Email</label>
            <input style={inputStyle} value={fromEmail} onChange={e => setFromEmail(e.target.value)} placeholder="john@company.com" />
          </div>
          <div>
            <label style={labelStyle}>Reply-To</label>
            <input style={inputStyle} value={replyTo} onChange={e => setReplyTo(e.target.value)} placeholder="reply@company.com" />
          </div>
          <div>
            <label style={labelStyle}>Daily Limit</label>
            <select style={selectStyle} value={dailyLimit} onChange={e => setDailyLimit(Number(e.target.value))}>
              {DAILY_LIMITS.map(l => <option key={l} value={l}>{l} emails/day</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Email Steps Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Email Steps</h2>
          <button style={purpleBtnStyle} onClick={addStep}>+ Add Step</button>
        </div>

        {steps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#8b8ba7', fontSize: 14 }}>
            No steps yet. Add your first email step to start the sequence.
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {steps.map((step, index) => {
              const isEditing = editingStepId === step.id;

              return (
                <div key={step.id} style={{ display: 'flex', gap: 16, marginBottom: index < steps.length - 1 ? 0 : 0 }}>
                  {/* Step indicator with connecting line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 36 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#00B4D8',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {step.step_number}
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{ width: 2, flexGrow: 1, background: '#E0F7FA', minHeight: 20 }} />
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{
                    flex: 1,
                    border: '1px solid #E0F7FA',
                    borderRadius: 12,
                    padding: '16px 20px',
                    marginBottom: 16,
                    background: isEditing ? '#F8F9FF' : '#fff',
                  }}>
                    {isEditing ? (
                      <>
                        <div style={{ marginBottom: 12 }}>
                          <label style={labelStyle}>Subject Line</label>
                          <input style={inputStyle} value={editSubject} onChange={e => setEditSubject(e.target.value)} />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={labelStyle}>Email Body (HTML)</label>
                          <textarea
                            ref={bodyTextareaRef}
                            style={{ ...inputStyle, minHeight: 150, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                            value={editBody}
                            onChange={e => setEditBody(e.target.value)}
                          />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={labelStyle}>Personalization Tokens</label>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {PERSONALIZATION_TOKENS.map(t => (
                              <button
                                key={t.token}
                                onClick={() => insertToken(t.token)}
                                style={{
                                  background: '#E0F7FA',
                                  border: '1px solid #d4c8ff',
                                  borderRadius: 6,
                                  padding: '4px 10px',
                                  fontSize: 12,
                                  color: '#00B4D8',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                }}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                          <div>
                            <label style={labelStyle}>Delay (days)</label>
                            <input
                              type="number"
                              min={0}
                              style={{ ...inputStyle, width: 80 }}
                              value={editDelay}
                              onChange={e => setEditDelay(parseInt(e.target.value) || 0)}
                            />
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 20 }}>
                            <input
                              type="checkbox"
                              checked={editStopOnReply}
                              onChange={e => setEditStopOnReply(e.target.checked)}
                              style={{ accentColor: '#00B4D8' }}
                            />
                            <span style={{ fontSize: 13, color: '#1a1a2e' }}>Stop on reply</span>
                          </label>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={purpleBtnStyle} onClick={saveStep}>Save Step</button>
                          <button style={outlineBtnStyle('#64648b')} onClick={() => setEditingStepId(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>{step.subject}</div>
                            <div style={{ fontSize: 13, color: '#8b8ba7' }}>
                              {step.delay_days > 0 ? `Wait ${step.delay_days} day${step.delay_days > 1 ? 's' : ''} before sending` : 'Send immediately'}
                              {step.stop_on_reply && ' \u00B7 Stops on reply'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button style={outlineBtnStyle('#00B4D8')} onClick={() => startEditStep(step)}>Edit</button>
                            <button style={outlineBtnStyle('#e53e3e')} onClick={() => deleteStep(step.id)}>Delete</button>
                          </div>
                        </div>
                        {step.body_html && (
                          <div
                            style={{
                              marginTop: 10,
                              padding: 12,
                              background: '#F8F9FF',
                              borderRadius: 8,
                              fontSize: 13,
                              color: '#64648b',
                              maxHeight: 100,
                              overflow: 'hidden',
                              lineHeight: 1.5,
                            }}
                            dangerouslySetInnerHTML={{ __html: step.body_html }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prospects Section */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Prospects</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <button style={purpleBtnStyle} onClick={() => fileInputRef.current?.click()}>
              Upload CSV
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {['total', 'pending', 'active', 'replied', 'bounced', 'completed'].map(key => {
            const config = prospectStatusConfig[key];
            const isActive = prospectFilter === key || (key === 'total' && prospectFilter === 'all');
            return (
              <div
                key={key}
                onClick={() => setProspectFilter(key === 'total' ? 'all' : key)}
                style={{
                  ...statBoxStyle,
                  cursor: 'pointer',
                  border: isActive ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                  background: isActive ? '#E0F7FA' : '#F8F9FF',
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: config?.color || '#1a1a2e' }}>
                  {stats[key] || 0}
                </div>
                <div style={{ fontSize: 12, color: '#8b8ba7', textTransform: 'capitalize' }}>{key}</div>
              </div>
            );
          })}
        </div>

        {/* CSV Upload Preview */}
        {showCsvUpload && csvPreview.length > 0 && (
          <div style={{ border: '1px solid #E0F7FA', borderRadius: 12, padding: 20, marginBottom: 20, background: '#F8F9FF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>
                Preview ({csvPreview.length} rows)
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={purpleBtnStyle} onClick={importCsv} disabled={importing}>
                  {importing ? 'Importing...' : `Import ${csvPreview.length} Prospects`}
                </button>
                <button style={outlineBtnStyle('#64648b')} onClick={() => { setShowCsvUpload(false); setCsvPreview([]); }}>
                  Cancel
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {csvHeaders.map(h => (
                      <th key={h} style={{ padding: '8px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'left', color: '#64648b', fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvPreview.slice(0, 10).map((row, i) => (
                    <tr key={i}>
                      {csvHeaders.map(h => (
                        <td key={h} style={{ padding: '6px 12px', borderBottom: '1px solid #E0F7FA', color: '#1a1a2e' }}>
                          {row[h] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvPreview.length > 10 && (
                <div style={{ textAlign: 'center', padding: 8, color: '#8b8ba7', fontSize: 12 }}>
                  ...and {csvPreview.length - 10} more rows
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prospect Table */}
        {prospects.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'left', color: '#64648b', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'left', color: '#64648b', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'left', color: '#64648b', fontWeight: 600 }}>Company</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'left', color: '#64648b', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'left', color: '#64648b', fontWeight: 600 }}>Step</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'left', color: '#64648b', fontWeight: 600 }}>Next Send</th>
                  <th style={{ padding: '10px 12px', borderBottom: '2px solid #E0F7FA', textAlign: 'right', color: '#64648b', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prospects.map(prospect => {
                  const sc = prospectStatusConfig[prospect.status] || prospectStatusConfig.pending;
                  return (
                    <tr key={prospect.id}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#1a1a2e', fontWeight: 500 }}>
                        {prospect.email}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#1a1a2e' }}>
                        {[prospect.first_name, prospect.last_name].filter(Boolean).join(' ') || '-'}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#64648b' }}>
                        {prospect.company || '-'}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA' }}>
                        <span style={badgeStyle(sc.color, sc.bg)}>{sc.label}</span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#64648b' }}>
                        {prospect.current_step}/{steps.length}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#8b8ba7', fontSize: 12 }}>
                        {prospect.next_send_at ? new Date(prospect.next_send_at).toLocaleDateString() : '-'}
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          {prospect.status !== 'replied' && (
                            <button style={outlineBtnStyle('#10b981')} onClick={() => markReplied(prospect.id)}>
                              Replied
                            </button>
                          )}
                          <button style={outlineBtnStyle('#e53e3e')} onClick={() => deleteProspect(prospect.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#8b8ba7', fontSize: 14 }}>
            No prospects yet. Upload a CSV to import prospects.
          </div>
        )}
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button style={{ ...purpleBtnStyle, padding: '12px 36px', fontSize: 15, opacity: saving ? 0.6 : 1 }} onClick={saveCampaign} disabled={saving}>
          {saving ? 'Saving...' : 'Save Campaign'}
        </button>
      </div>
    </div>
  );
}
