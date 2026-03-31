'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';

const PRESETS = [
  { id: 'minimal_white', label: 'Light (default)' },
  { id: 'dark', label: 'Dark' },
  { id: 'full_width', label: 'Full Width' },
];

export default function EmbedPage() {
  const [formId, setFormId] = useState('');
  const [preset, setPreset] = useState('minimal_white');
  const [copied, setCopied] = useState<string | null>(null);

  const scriptTag = formId
    ? `<div id="bestemail-${formId}"></div>\n<script src="https://bestemail.in/api/embed/${formId}.js"></script>`
    : '';

  const iframeTag = formId
    ? `<iframe\n  src="https://bestemail.in/form/${formId}"\n  width="100%"\n  height="400"\n  frameborder="0"\n  style="border:none;border-radius:12px;"\n></iframe>`
    : '';

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const card: React.CSSProperties = {
    background: '#111827',
    border: '1px solid #EEF2FF',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,180,216,0.06)',
  };

  const label: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#F9FAFB',
    marginBottom: 6,
  };

  const input: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #EEF2FF',
    borderRadius: 8,
    fontSize: 14,
    color: '#F9FAFB',
    outline: 'none',
    background: '#0B0F14',
    boxSizing: 'border-box',
  };

  const codeBlock: React.CSSProperties = {
    background: '#0B0F14',
    borderRadius: 10,
    padding: '16px 20px',
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#e2e8f0',
    whiteSpace: 'pre',
    overflowX: 'auto',
    marginTop: 10,
    position: 'relative',
  };

  const copyBtn = (text: string, key: string) => (
    <button
      onClick={() => copy(text, key)}
      style={{ position: 'absolute', top: 10, right: 10, padding: '5px 12px', background: copied === key ? '#10b981' : '#4F46E5', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
    >
      {copied === key ? '✓ Copied' : 'Copy'}
    </button>
  );

  return (
    <AppShell>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F9FAFB', marginBottom: 8 }}>Embed Forms</h1>
          <p style={{ color: '#8b8ba7', fontSize: 15 }}>Add signup forms to any website with a single script tag or iframe.</p>
        </div>

        {/* Step 1 — Enter Form ID */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB', marginBottom: 16 }}>1. Select your form</h2>
          <label style={label}>Form ID</label>
          <input
            style={input}
            placeholder="Paste your Form ID from Forms → Settings"
            value={formId}
            onChange={e => setFormId(e.target.value.trim())}
          />
          <p style={{ fontSize: 12, color: '#8b8ba7', marginTop: 8 }}>
            Find your Form ID in <a href="/dashboard/forms" style={{ color: '#4F46E5' }}>Dashboard → Forms</a> → click a form → copy the ID from the URL.
          </p>

          <div style={{ marginTop: 20 }}>
            <label style={label}>Style preset</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => setPreset(p.id)} style={{ padding: '8px 16px', borderRadius: 8, border: preset === p.id ? 'none' : '1px solid #EEF2FF', background: preset === p.id ? '#4F46E5' : '#0B0F14', color: preset === p.id ? '#fff' : '#8b8ba7', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 — Script embed */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB', marginBottom: 6 }}>2. Add to your website</h2>
          <p style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 16 }}>Paste this snippet anywhere in your HTML — blog, landing page, any site.</p>

          <div style={{ ...codeBlock, opacity: formId ? 1 : 0.4 }}>
            {formId ? scriptTag : '<div id="bestemail-YOUR_FORM_ID"></div>\n<script src="https://bestemail.in/api/embed/YOUR_FORM_ID.js"></script>'}
            {formId && copyBtn(scriptTag, 'script')}
          </div>

          {!formId && <p style={{ fontSize: 12, color: '#f59e0b', marginTop: 8 }}>↑ Enter your Form ID above to generate your snippet</p>}
        </div>

        {/* Step 3 — iFrame option */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB', marginBottom: 6 }}>Alternative: iFrame embed</h2>
          <p style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 16 }}>Use an iframe for sandboxed embedding in stricter environments (Webflow, Notion, etc.).</p>

          <div style={{ ...codeBlock, opacity: formId ? 1 : 0.4 }}>
            {formId ? iframeTag : '<iframe src="https://bestemail.in/form/YOUR_FORM_ID" width="100%" height="400" frameborder="0"></iframe>'}
            {formId && copyBtn(iframeTag, 'iframe')}
          </div>
        </div>

        {/* Step 4 — WordPress / Webflow hint */}
        <div style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#F9FAFB', marginBottom: 16 }}>Platform guides</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { name: '📝 WordPress', tip: 'Paste script in a Custom HTML block or in footer via Appearance → Theme Editor.' },
              { name: '🌊 Webflow', tip: 'Use the Embed component. Paste the iframe version for best compatibility.' },
              { name: '🛒 Shopify', tip: 'Add to a page template via Online Store → Themes → Edit Code → .liquid file.' },
              { name: '📄 Any HTML site', tip: 'Paste the script tag just before </body> or inside any <div> container.' },
            ].map(p => (
              <div key={p.name} style={{ background: '#0B0F14', borderRadius: 10, padding: '14px 16px', border: '1px solid #EEF2FF' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#F9FAFB', marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#8b8ba7', lineHeight: 1.6 }}>{p.tip}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
