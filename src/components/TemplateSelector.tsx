'use client';

import { CSSProperties, useEffect, useState } from 'react';
import { emailTemplates, EmailTemplate, getTemplatesByCategory } from '@/lib/email-templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: EmailTemplate) => void;
  onCancel: () => void;
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(2, 6, 23, 0.58)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  shell: {
    background: '#ffffff',
    borderRadius: 24,
    width: 'min(1180px, 100%)',
    maxHeight: '92vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(15,23,42,0.28)',
    border: '1px solid #e2e8f0',
  },
  header: {
    padding: '22px 22px 18px',
    borderBottom: '1px solid #e2e8f0',
    background: '#ffffff',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { margin: 0, fontSize: 28, fontWeight: 800, color: '#0f172a' },
  subtitle: { margin: '8px 0 0', fontSize: 15, color: '#64748b', lineHeight: 1.6 },
  close: {
    border: '1px solid #cbd5e1',
    background: '#fff',
    borderRadius: 12,
    width: 42,
    height: 42,
    fontSize: 22,
    cursor: 'pointer',
    color: '#475569',
    flex: '0 0 auto',
  },
  tabs: {
    display: 'flex',
    gap: 10,
    marginTop: 18,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  tab: {
    border: '1px solid #cbd5e1',
    background: '#f8fafc',
    color: '#334155',
    borderRadius: 999,
    padding: '10px 14px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
  body: {
    flex: 1,
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(340px, 0.88fr)',
  },
  bodySingle: {
    flex: 1,
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
  left: { overflowY: 'auto', padding: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 },
  blankCard: {
    border: '2px dashed #cbd5e1',
    borderRadius: 20,
    padding: 22,
    background: '#ffffff',
    cursor: 'pointer',
    minHeight: 250,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  plusWrap: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    border: '1px solid #e2e8f0',
  },
  plus: { fontSize: 34, color: '#2563eb', lineHeight: 1 },
  cardTitle: { margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' },
  cardText: { margin: '8px 0 0', fontSize: 14, color: '#64748b', lineHeight: 1.6 },
  templateCard: {
    border: '1px solid #e2e8f0',
    borderRadius: 20,
    overflow: 'hidden',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 290,
  },
  previewThumb: {
    aspectRatio: '4 / 3',
    background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    cursor: 'pointer',
  },
  thumbInner: { textAlign: 'center' },
  thumbIcon: { fontSize: 44, marginBottom: 10 },
  thumbText: { fontSize: 14, color: '#475569', lineHeight: 1.5 },
  cardBody: { padding: 16, display: 'grid', gap: 12 },
  subject: { fontSize: 13, color: '#64748b', lineHeight: 1.5 },
  primaryBtn: {
    width: '100%',
    border: 'none',
    borderRadius: 14,
    background: '#2563eb',
    color: '#fff',
    padding: '12px 14px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  side: {
    borderLeft: '1px solid #e2e8f0',
    background: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sideHeader: {
    padding: 16,
    borderBottom: '1px solid #e2e8f0',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sideTitle: { margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' },
  sideBody: { flex: 1, overflowY: 'auto', padding: 16, display: 'grid', gap: 14 },
  panel: { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 16 },
  panelLabel: { fontSize: 13, color: '#64748b', marginBottom: 6 },
  iframeWrap: { border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', background: '#fff' },
  iframe: { width: '100%', height: 420, border: 'none', display: 'block' },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  chip: { background: '#eff6ff', color: '#1d4ed8', borderRadius: 999, padding: '6px 10px', fontSize: 12, fontWeight: 700 },
};

export function TemplateSelector({ onSelectTemplate, onCancel }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<EmailTemplate['category'] | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 980);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📚' },
    { id: 'welcome', name: 'Welcome', icon: '👋' },
    { id: 'festival', name: 'Festival', icon: '🎉' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'transactional', name: 'Transactional', icon: '📧' },
    { id: 'newsletter', name: 'Newsletter', icon: '📰' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? emailTemplates
    : getTemplatesByCategory(selectedCategory as EmailTemplate['category']);

  const handleSelectTemplate = (template: EmailTemplate) => onSelectTemplate(template);

  const blankTemplate: EmailTemplate = {
    id: 'blank',
    name: 'Blank Template',
    category: 'business',
    thumbnail: '/templates/blank.png',
    subject: '',
    htmlContent: '<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px;"><p>Start writing your email here...</p></div>',
    variables: []
  };

  const getCategoryIcon = (category: EmailTemplate['category']) => {
    if (category === 'welcome') return '👋';
    if (category === 'festival') return '🎉';
    if (category === 'business') return '💼';
    if (category === 'transactional') return '📧';
    return '📰';
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.headerRow}>
            <div>
              <h2 style={styles.title}>Choose a template</h2>
              <p style={styles.subtitle}>Pick a starting point or begin from scratch. Preview first, then load it into your campaign editor.</p>
            </div>
            <button onClick={onCancel} style={styles.close} aria-label="Close template selector">×</button>
          </div>

          <div style={styles.tabs}>
            {categories.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as EmailTemplate['category'] | 'all')}
                  style={{
                    ...styles.tab,
                    background: active ? '#2563eb' : '#f8fafc',
                    color: active ? '#fff' : '#334155',
                    borderColor: active ? '#2563eb' : '#cbd5e1',
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={isMobile ? styles.bodySingle : styles.body}>
          <div style={styles.left}>
            <div style={styles.grid}>
              <div onClick={() => handleSelectTemplate(blankTemplate)} style={styles.blankCard}>
                <div style={styles.center}>
                  <div style={styles.plusWrap}><span style={styles.plus}>＋</span></div>
                  <h3 style={styles.cardTitle}>Start from scratch</h3>
                  <p style={styles.cardText}>Create your own design from a clean blank layout.</p>
                </div>
              </div>

              {filteredTemplates.map((template) => (
                <div key={template.id} style={styles.templateCard}>
                  <div style={styles.previewThumb} onClick={() => setPreviewTemplate(template)}>
                    <div style={styles.thumbInner}>
                      <div style={styles.thumbIcon}>{getCategoryIcon(template.category)}</div>
                      <div style={styles.thumbText}>{template.name}</div>
                    </div>
                  </div>

                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{template.name}</h3>
                    <div style={styles.subject}>Subject: {template.subject || 'Add your own subject line'}</div>
                    <button onClick={() => handleSelectTemplate(template)} style={styles.primaryBtn}>Use this template</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isMobile && previewTemplate ? (
            <div style={styles.side}>
              <div style={styles.sideHeader}>
                <h3 style={styles.sideTitle}>{previewTemplate.name}</h3>
                <button onClick={() => setPreviewTemplate(null)} style={styles.close} aria-label="Close preview">×</button>
              </div>

              <div style={styles.sideBody}>
                <div style={styles.panel}>
                  <div style={styles.panelLabel}>Subject line</div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{previewTemplate.subject || 'No subject set'}</div>
                  {previewTemplate.preheader ? (
                    <>
                      <div style={{ ...styles.panelLabel, marginTop: 12 }}>Preheader</div>
                      <div style={{ color: '#334155', lineHeight: 1.6 }}>{previewTemplate.preheader}</div>
                    </>
                  ) : null}
                </div>

                <div style={styles.panel}>
                  <div style={styles.panelLabel}>Email preview</div>
                  <div style={styles.iframeWrap}>
                    <iframe srcDoc={previewTemplate.htmlContent} style={styles.iframe} title="Email Preview" />
                  </div>
                </div>

                {previewTemplate.variables.length > 0 ? (
                  <div style={styles.panel}>
                    <div style={styles.panelLabel}>Personalization variables</div>
                    <div style={styles.chips}>
                      {previewTemplate.variables.map((variable) => (
                        <span key={variable} style={styles.chip}>{`{{${variable}}}`}</span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <button onClick={() => handleSelectTemplate(previewTemplate)} style={styles.primaryBtn}>Use this template</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
