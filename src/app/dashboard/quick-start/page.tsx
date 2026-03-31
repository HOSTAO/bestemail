'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

type WizardStep = 'welcome' | 'customers' | 'email' | 'done';

export default function QuickStartPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<WizardStep>('welcome');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [addMethod, setAddMethod] = useState<'manual' | 'csv' | null>(null);
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [customersAdded, setCustomersAdded] = useState(0);

  const steps: { key: WizardStep; label: string }[] = [
    { key: 'welcome', label: 'Your Business' },
    { key: 'customers', label: 'Add Customers' },
    { key: 'email', label: 'First Email' },
    { key: 'done', label: 'Done!' },
  ];

  const currentIndex = steps.findIndex(s => s.key === step);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    padding: isMobile ? 16 : 24,
  };

  const inputStyle = {
    width: '100%',
    borderRadius: 8,
    border: '1px solid #E0F7FA',
    padding: '12px 14px',
    fontSize: 16,
    boxSizing: 'border-box' as const,
    outline: 'none',
  };

  const btnPrimary = {
    borderRadius: 12,
    background: '#00B4D8',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44,
  };

  const btnSecondary = {
    borderRadius: 12,
    background: '#fff',
    color: '#1a1a2e',
    border: '1px solid #E0F7FA',
    padding: '14px 28px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44,
  };

  const navRow: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column-reverse' : 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: isMobile ? 10 : 0,
  };

  const navBtnStyle = isMobile ? { width: '100%' } : {};

  const addManualContact = async () => {
    if (!manualEmail) {
      toast.error('Please enter an email');
      return;
    }
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: manualEmail, name: manualName }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Customer added!');
      setCustomersAdded(prev => prev + 1);
      setManualEmail('');
      setManualName('');
    } catch {
      toast.error('Could not add customer');
    }
  };

  const importCSV = async () => {
    if (!csvText.trim()) {
      toast.error('Paste your CSV data first');
      return;
    }
    setImporting(true);
    try {
      const res = await fetch('/api/contacts/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText, syncToSendy: false }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const count = data.imported || data.count || 0;
      setCustomersAdded(prev => prev + count);
      toast.success(`${count} customers imported!`);
      setCsvText('');
    } catch {
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 600, margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          {steps.map((s, i) => (
            <span key={s.key} style={{
              fontSize: 12,
              fontWeight: i <= currentIndex ? 600 : 400,
              color: i <= currentIndex ? '#00B4D8' : '#8b8ba7',
            }}>{s.label}</span>
          ))}
        </div>
        <div style={{ height: 6, background: '#E0F7FA', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00B4D8, #FF6B6B)',
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Step 1: Welcome */}
      {step === 'welcome' && (
        <div className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>👋</div>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
              Welcome! Let&apos;s set up your account
            </h1>
            <p style={{ color: '#8b8ba7', fontSize: 15 }}>
              This will take less than 2 minutes
            </p>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>
                  What&apos;s your business name?
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="e.g., Kumar Textiles"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>
                  What type of business?
                </label>
                <select value={businessType} onChange={e => setBusinessType(e.target.value)} style={inputStyle}>
                  <option value="">Choose one...</option>
                  <option value="retail">Retail Shop</option>
                  <option value="restaurant">Restaurant / Food</option>
                  <option value="textile">Textile / Clothing</option>
                  <option value="jewelry">Jewelry</option>
                  <option value="electronics">Electronics</option>
                  <option value="grocery">Grocery / Supermarket</option>
                  <option value="salon">Salon / Beauty</option>
                  <option value="pharmacy">Pharmacy / Medical</option>
                  <option value="education">Education / Coaching</option>
                  <option value="services">Services / Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div style={navRow}>
            <button onClick={() => router.push('/dashboard')} style={{ ...btnSecondary, ...navBtnStyle }}>Skip for now</button>
            <button onClick={() => setStep('customers')} style={{ ...btnPrimary, ...navBtnStyle }}>Continue</button>
          </div>
        </div>
      )}

      {/* Step 2: Add Customers */}
      {step === 'customers' && (
        <div className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>👥</div>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
              Add your first customers
            </h1>
            <p style={{ color: '#8b8ba7', fontSize: 15 }}>
              {customersAdded > 0 ? `${customersAdded} customer${customersAdded > 1 ? 's' : ''} added so far!` : 'You can add them one by one or import from a file'}
            </p>
          </div>

          {!addMethod && (
            <div style={{ display: 'grid', gap: 12 }}>
              <button onClick={() => setAddMethod('manual')} style={{
                ...cardStyle, cursor: 'pointer', textAlign: 'left' as const, border: '1px solid #E0F7FA', minHeight: 44,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>✏️</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#1a1a2e' }}>Add one by one</div>
                <div style={{ color: '#8b8ba7', fontSize: 13, marginTop: 4 }}>Type in each customer&apos;s name and email</div>
              </button>
              <button onClick={() => setAddMethod('csv')} style={{
                ...cardStyle, cursor: 'pointer', textAlign: 'left' as const, border: '1px solid #E0F7FA', minHeight: 44,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#1a1a2e' }}>Import from a file</div>
                <div style={{ color: '#8b8ba7', fontSize: 13, marginTop: 4 }}>Paste data from Excel, Google Sheets, or a CSV file</div>
              </button>
            </div>
          )}

          {addMethod === 'manual' && (
            <div style={cardStyle}>
              <div style={{ display: 'grid', gap: 12 }}>
                <input type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Customer name" style={inputStyle} />
                <input type="email" value={manualEmail} onChange={e => setManualEmail(e.target.value)} placeholder="Email address" style={inputStyle} />
                <button onClick={addManualContact} style={{ ...btnPrimary, width: '100%' }}>Add Customer</button>
                {customersAdded > 0 && (
                  <p style={{ textAlign: 'center', color: '#16a34a', fontSize: 14, fontWeight: 600 }}>
                    ✓ {customersAdded} added! Add more or continue.
                  </p>
                )}
                <button onClick={() => setAddMethod(null)} style={{ ...btnSecondary, width: '100%' }}>Choose different method</button>
              </div>
            </div>
          )}

          {addMethod === 'csv' && (
            <div style={cardStyle}>
              <div style={{ background: '#F8F9FF', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 12, color: '#64648b' }}>
                <strong>Paste your data like this:</strong><br />
                email,name<br />
                customer@example.com,Customer Name
              </div>
              <textarea
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                placeholder="Paste your customer data here..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'monospace', fontSize: 12 }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={importCSV} disabled={importing} style={{ ...btnPrimary, flex: 1, opacity: importing ? 0.6 : 1 }}>
                  {importing ? 'Importing...' : 'Import'}
                </button>
                <button onClick={() => setAddMethod(null)} style={btnSecondary}>Back</button>
              </div>
            </div>
          )}

          <div style={navRow}>
            <button onClick={() => setStep('welcome')} style={{ ...btnSecondary, ...navBtnStyle }}>Back</button>
            <button onClick={() => setStep('email')} style={{ ...btnPrimary, ...navBtnStyle }}>
              {customersAdded > 0 ? 'Continue' : 'Skip for now'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: First Email */}
      {step === 'email' && (
        <div className="animate-fade-in">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>✉️</div>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
              Create your first email
            </h1>
            <p style={{ color: '#8b8ba7', fontSize: 15 }}>
              Pick a template and send your first email
            </p>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { icon: '🪔', name: 'Festival Offer', desc: 'Great for Diwali, Eid, Onam and more' },
              { icon: '🏷️', name: 'Sale / Discount', desc: 'Run a special offer for your customers' },
              { icon: '🙏', name: 'Thank You Message', desc: 'Thank your loyal customers' },
              { icon: '📰', name: 'Shop News', desc: 'Share updates about your business' },
            ].map(t => (
              <button key={t.name} onClick={() => {
                router.push('/dashboard/campaigns/new');
              }} style={{
                ...cardStyle,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                textAlign: 'left' as const,
                minHeight: 44,
              }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>{t.name}</div>
                  <div style={{ color: '#8b8ba7', fontSize: 13, marginTop: 2 }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div style={navRow}>
            <button onClick={() => setStep('customers')} style={{ ...btnSecondary, ...navBtnStyle }}>Back</button>
            <button onClick={() => setStep('done')} style={{ ...btnPrimary, ...navBtnStyle }}>Skip for now</button>
          </div>
        </div>
      )}

      {/* Step 4: Done! */}
      {step === 'done' && (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>
            You&apos;re all set!
          </h1>
          <p style={{ color: '#8b8ba7', fontSize: 16, marginBottom: 32 }}>
            {businessName ? `${businessName} is` : 'Your account is'} ready to go. Start sending emails to grow your business!
          </p>

          <div style={{ ...cardStyle, textAlign: 'left' as const, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Quick checklist</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { done: true, label: 'Account created' },
                { done: customersAdded > 0, label: `Customers added (${customersAdded})` },
                { done: false, label: 'First email sent' },
                { done: false, label: 'Form added to website' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    background: item.done ? '#00B4D8' : '#E0F7FA',
                    color: item.done ? '#fff' : '#8b8ba7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                  }}>{item.done ? '✓' : ''}</div>
                  <span style={{ fontSize: 14, color: item.done ? '#8b8ba7' : '#1a1a2e', textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => router.push('/dashboard')} style={{
            ...btnPrimary,
            padding: '16px 40px',
            fontSize: 16,
          }}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}
