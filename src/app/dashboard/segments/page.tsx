'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

type RuleField = 'opened_last' | 'not_opened' | 'has_tag' | 'location' | 'joined_before' | 'joined_after' | 'city' | 'business_type' | 'tag';
type CombineMode = 'all' | 'any';

type SegmentRule = {
  id: string;
  field: RuleField;
  value: string;
};

type Segment = {
  id: string;
  name: string;
  rules: Array<{ field: string; operator?: string; value: string }>;
  combine_mode?: CombineMode;
  created_at?: string;
};

const RULE_OPTIONS: { value: RuleField; label: string; placeholder: string }[] = [
  { value: 'opened_last', label: 'Opened last campaign', placeholder: '' },
  { value: 'not_opened', label: 'Did not open last 3 campaigns', placeholder: '' },
  { value: 'has_tag', label: 'Has tag', placeholder: 'e.g. VIP, Regular Customer' },
  { value: 'location', label: 'Location / Country', placeholder: 'e.g. India, UAE' },
  { value: 'city', label: 'City', placeholder: 'e.g. Mumbai, Dubai' },
  { value: 'business_type', label: 'Business type', placeholder: 'e.g. Restaurant, Retail' },
  { value: 'joined_before', label: 'Joined before date', placeholder: 'YYYY-MM-DD' },
  { value: 'joined_after', label: 'Joined after date', placeholder: 'YYYY-MM-DD' },
];

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  const [segmentName, setSegmentName] = useState('');
  const [combineMode, setCombineMode] = useState<CombineMode>('all');
  const [rules, setRules] = useState<SegmentRule[]>([
    { id: '1', field: 'city', value: '' },
  ]);

  const loadSegments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/segments', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setSegments(Array.isArray(data) ? data : data.segments || []);
    } catch (err) {
      console.error('Failed to load segments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSegments(); }, []);

  const addRule = () => {
    setRules([...rules, { id: Date.now().toString(), field: 'city', value: '' }]);
  };

  const removeRule = (id: string) => {
    if (rules.length <= 1) return;
    setRules(rules.filter(r => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<SegmentRule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const createSegment = async () => {
    if (!segmentName.trim()) {
      toast.error('Please name your segment');
      return;
    }
    if (rules.some(r => needsValue(r.field) && !r.value.trim())) {
      toast.error('Please fill in all rule values');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch('/api/segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: segmentName,
          rules: rules.map(r => ({ field: r.field, operator: 'equals', value: r.value })),
          combine_mode: combineMode,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');
      setSegments(prev => [data, ...prev]);
      setSegmentName('');
      setRules([{ id: '1', field: 'city', value: '' }]);
      toast.success('Segment created! You can now use it when sending campaigns.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create segment');
    } finally {
      setSaving(false);
    }
  };

  const deleteSegment = async (id: string) => {
    if (!confirm('Delete this segment?')) return;
    try {
      const res = await fetch(`/api/segments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSegments(prev => prev.filter(s => s.id !== id));
        toast.success('Segment deleted');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const needsValue = (field: RuleField) => {
    return !['opened_last', 'not_opened'].includes(field);
  };

  const getRuleDescription = (rule: { field: string; value: string }) => {
    const opt = RULE_OPTIONS.find(o => o.value === rule.field);
    if (!opt) return `${rule.field} = ${rule.value}`;
    if (!needsValue(rule.field as RuleField)) return opt.label;
    return `${opt.label}: ${rule.value}`;
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
    fontSize: 16,
    boxSizing: 'border-box' as const,
    outline: 'none',
  };

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Segments</h1>
        <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 15 }}>
          Send emails only to customers who match specific conditions
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Total segments</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{segments.length}</div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7' }}>City-based</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>
            {segments.filter(s => s.rules.some(r => r.field === 'city' || r.field === 'location')).length}
          </div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Tag-based</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>
            {segments.filter(s => s.rules.some(r => r.field === 'tag' || r.field === 'has_tag')).length}
          </div>
        </div>
      </div>

      {/* Create Segment */}
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>
          Create a segment
        </h2>
        <p style={{ color: '#8b8ba7', fontSize: 14, margin: '0 0 16px' }}>
          Send only to customers who match these conditions
        </p>

        <div style={{ display: 'grid', gap: 14 }}>
          <input
            type="text"
            value={segmentName}
            onChange={e => setSegmentName(e.target.value)}
            placeholder="Segment name (e.g., Dubai VIP customers)"
            style={inputStyle}
          />

          {/* Combine mode */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Match customers where:</span>
            <select
              value={combineMode}
              onChange={e => setCombineMode(e.target.value as CombineMode)}
              style={{ ...inputStyle, width: 'auto', minWidth: 120 }}
            >
              <option value="all">ALL conditions are true</option>
              <option value="any">ANY condition is true</option>
            </select>
          </div>

          {/* Rules */}
          <div style={{ display: 'grid', gap: 10 }}>
            {rules.map((rule, i) => (
              <div key={rule.id} style={{
                display: 'flex', gap: 8, alignItems: 'center',
                flexDirection: isMobile ? 'column' : 'row',
              }}>
                {i > 0 && (
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#00B4D8', background: '#E0F7FA',
                    padding: '2px 10px', borderRadius: 6, flexShrink: 0,
                    width: isMobile ? 'auto' : 40, textAlign: 'center',
                  }}>
                    {combineMode === 'all' ? 'AND' : 'OR'}
                  </span>
                )}
                <select
                  value={rule.field}
                  onChange={e => updateRule(rule.id, { field: e.target.value as RuleField })}
                  style={{ ...inputStyle, width: isMobile ? '100%' : 220, flexShrink: 0 }}
                >
                  {RULE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {needsValue(rule.field) && (
                  <input
                    type={rule.field.includes('joined') ? 'date' : 'text'}
                    value={rule.value}
                    onChange={e => updateRule(rule.id, { value: e.target.value })}
                    placeholder={RULE_OPTIONS.find(o => o.value === rule.field)?.placeholder || 'Value'}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                )}
                {rules.length > 1 && (
                  <button onClick={() => removeRule(rule.id)} style={{
                    background: 'none', border: '1px solid #FFD5D5', borderRadius: 8,
                    color: '#e53e3e', cursor: 'pointer', padding: '8px 12px', fontSize: 14,
                    minHeight: 40, flexShrink: 0,
                  }}>x</button>
                )}
              </div>
            ))}
          </div>

          <button onClick={addRule} style={{
            borderRadius: 8, border: '1px dashed #E0F7FA', background: '#F8F9FF',
            padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#00B4D8',
            cursor: 'pointer', minHeight: 40,
          }}>
            + Add another condition
          </button>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={createSegment} disabled={saving} style={{
              borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
              padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              opacity: saving ? 0.6 : 1, minHeight: 44,
            }}>
              {saving ? 'Creating...' : 'Create Segment'}
            </button>
            <Link href="/dashboard/campaigns/new" style={{
              borderRadius: 10, background: '#fff', color: '#1a1a2e', border: '1px solid #E0F7FA',
              padding: '12px 20px', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', minHeight: 44,
            }}>
              Back to email builder
            </Link>
          </div>
        </div>
      </div>

      {/* Existing Segments */}
      <div style={{ ...cardStyle, padding: isMobile ? 16 : 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Your Segments</h2>
        {loading ? (
          <div style={{ color: '#8b8ba7', padding: '20px 0' }}>Loading segments...</div>
        ) : segments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
            <p style={{ color: '#8b8ba7', fontSize: 15 }}>No segments yet. Create one above to send targeted emails.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {segments.map(segment => (
              <div key={segment.id} style={{
                borderRadius: 12, border: '1px solid #E0F7FA', padding: isMobile ? 14 : 16, background: '#fff',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>{segment.name}</div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {segment.rules.map((rule, i) => (
                        <span key={i} style={{
                          padding: '3px 10px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                          background: '#E0F7FA', color: '#00B4D8',
                        }}>
                          {getRuleDescription(rule)}
                        </span>
                      ))}
                    </div>
                    {segment.created_at && (
                      <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 6 }}>
                        Created {new Date(segment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <Link href={`/dashboard/campaigns/new?segment=${segment.id}`} style={{
                      borderRadius: 8, border: '1px solid #E0F7FA', background: '#fff',
                      padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#00B4D8',
                      textDecoration: 'none', minHeight: 32, display: 'inline-flex', alignItems: 'center',
                    }}>
                      Use in campaign
                    </Link>
                    <button onClick={() => deleteSegment(segment.id)} style={{
                      borderRadius: 8, border: '1px solid #FFD5D5', background: '#FFF0F0',
                      padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#e53e3e',
                      cursor: 'pointer', minHeight: 32,
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
