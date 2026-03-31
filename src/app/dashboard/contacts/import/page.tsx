'use client';

import { CSSProperties, useEffect, useMemo, useState } from 'react';


const SAMPLE_CSV = `email,name,city,business_type,tags
john@example.com,John Mathew,Kochi,Retail,new|vip
sara@example.com,Sara Paul,Dubai,Services,newsletter|lead`;

const s: Record<string, CSSProperties> = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.04)' },
  title: { fontSize: 24, fontWeight: 700, color: '#020617', margin: 0 },
  sub: { margin: '10px 0 0', fontSize: 14, color: '#64748b', lineHeight: 1.6 },
  textarea: { width: '100%', minHeight: 260, borderRadius: 16, border: '1px solid #cbd5e1', padding: '14px 16px', fontSize: 13, boxSizing: 'border-box', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  actionBlue: { borderRadius: 14, background: '#2563eb', color: '#fff', border: 'none', padding: '12px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  actionLight: { borderRadius: 14, background: '#fff', color: '#334155', border: '1px solid #cbd5e1', padding: '12px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16 },
  stat: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 18 },
  grid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 },
  miniList: { display: 'grid', gap: 12, marginTop: 16 },
  miniItem: { borderRadius: 16, border: '1px solid #e2e8f0', background: '#f8fafc', padding: 14, color: '#334155', fontSize: 14, lineHeight: 1.6 },
};

export default function ImportContactsPage() {
  const [csv, setCsv] = useState(SAMPLE_CSV);
  const [syncToSendy, setSyncToSendy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ imported: number; sendySynced: number; skipped?: number } | null>(null);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 900);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const rowCount = useMemo(() => Math.max(csv.trim() ? csv.trim().split('\n').length - 1 : 0, 0), [csv]);

  const handleImport = async () => {
    try {
      setSubmitting(true);
      setError('');
      setResult(null);
      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv, syncToSendy }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Import failed');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={s.page}>
        <section style={s.stats}>
          <div style={s.stat}><div style={{ color: '#64748b', fontSize: 14 }}>CSV rows</div><div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{rowCount}</div></div>
          <div style={s.stat}><div style={{ color: '#64748b', fontSize: 14 }}>Sync to Sendy</div><div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{syncToSendy ? 'Yes' : 'No'}</div></div>
          <div style={s.stat}><div style={{ color: '#64748b', fontSize: 14 }}>Last result</div><div style={{ marginTop: 8, fontSize: 18, fontWeight: 700 }}>{result ? `${result.imported} imported` : 'Not run yet'}</div></div>
        </section>

        {error ? <div style={{ ...s.card, borderColor: '#fecaca', background: '#fef2f2', color: '#b91c1c' }}>{error}</div> : null}
        {result ? <div style={{ ...s.card, borderColor: '#bbf7d0', background: '#f0fdf4', color: '#166534' }}>Imported <strong>{result.imported}</strong> contacts. {typeof result.skipped === 'number' ? <>Skipped <strong>{result.skipped}</strong> invalid rows. </> : null}{syncToSendy ? <>Sendy synced: <strong>{result.sendySynced}</strong>.</> : null}</div> : null}

        <section style={isMobile ? { ...s.grid, gridTemplateColumns: '1fr' } : s.grid}>
          <div style={s.card}>
            <h2 style={s.title}>Paste your CSV</h2>
            <p style={s.sub}>Required: an <code>email</code> column. Existing contacts with the same email are updated instead of duplicated in local fallback mode.</p>
            <div style={{ marginTop: 18 }}>
              <textarea value={csv} onChange={(event) => setCsv(event.target.value)} style={s.textarea} spellCheck={false} />
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 16, fontSize: 14, color: '#334155' }}>
              <input type="checkbox" checked={syncToSendy} onChange={(event) => setSyncToSendy(event.target.checked)} style={{ marginTop: 3 }} />
              <span>Also sync imported contacts to Sendy now</span>
            </label>
          </div>

          <div style={{ display: 'grid', gap: 24 }}>
            <section style={s.card}>
              <h2 style={s.title}>Import checklist</h2>
              <div style={s.miniList}>
                <div style={s.miniItem}>1. Confirm the CSV has a header row.</div>
                <div style={s.miniItem}>2. Keep <code>email</code> clean and valid.</div>
                <div style={s.miniItem}>3. Decide whether this batch should sync to Sendy immediately.</div>
                <div style={s.miniItem}>4. After import, move straight to Campaigns for a test send.</div>
              </div>
            </section>

            <section style={s.card}>
              <h2 style={s.title}>Supported columns</h2>
              <p style={s.sub}><code>email</code>, <code>name</code>, <code>city</code>, <code>business_type</code>, <code>tags</code>. Use pipe-separated tags like <code>vip|lead|newsletter</code>.</p>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
