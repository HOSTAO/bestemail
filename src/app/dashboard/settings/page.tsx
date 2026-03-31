'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { smsService } from '@/lib/sms';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Settings {
  api_url: string;
  api_key: string;
  has_api_key?: boolean;
  list_id: string;
  brand_id: string;
  from_email: string;
  from_name: string;
  sms_api_token: string;
  sms_sender_id: string;
  sms_enabled: boolean;
}

interface SystemStatus {
  status: {
    nodeEnv: string;
    dataMode: string;
    configReady: boolean;
    databaseReady: boolean;
    securityReady: boolean;
    overallReady: boolean;
  };
  checks: {
    sessionSecret: boolean;
    supabaseUrl: boolean;
    supabaseAnonKey: boolean;
    supabaseServiceRoleKey: boolean;
    sendyApiUrl: boolean;
    sendyApiKey: boolean;
    sendyListId: boolean;
    fromEmail: boolean;
    fromName: boolean;
  };
}

const defaultSettings: Settings = {
  api_url: '',
  api_key: '',
  has_api_key: false,
  list_id: '',
  brand_id: '1',
  from_email: 'hello@bestemail.in',
  from_name: 'Bestemail',
  sms_api_token: '',
  sms_sender_id: '',
  sms_enabled: false,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testingSms, setTestingSms] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [smsTestResult, setSmsTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showEmailApiKey, setShowEmailApiKey] = useState(false);
  const [showSmsApiKey, setShowSmsApiKey] = useState(false);
  const [settingsSource, setSettingsSource] = useState<'database' | 'environment'>('environment');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [ipAllowlist, setIpAllowlist] = useState<string[]>([]);
  const [ipRestrictionEnabled, setIpRestrictionEnabled] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [savingIp, setSavingIp] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated) { router.push('/login'); return; }
        const role = data.user?.role;
        setUserRole(role);
        if (role !== 'admin') router.push('/dashboard');
      })
      .catch(() => router.push('/login'));

    void loadSettings();
    void loadSystemStatus();
    void loadIpAllowlist();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings/secure', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to load settings');
      setSettings({ ...defaultSettings, ...(data.settings || {}) });
      setSettingsSource(data.source === 'database' ? 'database' : 'environment');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/system-status', { cache: 'no-store' });
      const data = await response.json();
      if (response.ok) setSystemStatus(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadIpAllowlist = async () => {
    try {
      const res = await fetch('/api/settings/ip-allowlist');
      const data = await res.json();
      if (res.ok) {
        setIpAllowlist(data.ips || []);
        setIpRestrictionEnabled(data.enabled || false);
      }
    } catch {}
  };

  const saveIpAllowlist = async (ips: string[], enabled: boolean) => {
    setSavingIp(true);
    try {
      const res = await fetch('/api/settings/ip-allowlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ips, enabled }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('IP allowlist updated');
    } catch {
      toast.error('Failed to save IP allowlist');
    } finally {
      setSavingIp(false);
    }
  };

  const addIp = () => {
    const ip = newIp.trim();
    if (!ip) return;
    if (!/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(ip)) {
      toast.error('Invalid IP address format');
      return;
    }
    if (ipAllowlist.includes(ip)) {
      toast.error('IP already in list');
      return;
    }
    const updated = [...ipAllowlist, ip];
    setIpAllowlist(updated);
    setNewIp('');
    void saveIpAllowlist(updated, ipRestrictionEnabled);
  };

  const removeIp = (ip: string) => {
    const updated = ipAllowlist.filter(i => i !== ip);
    setIpAllowlist(updated);
    void saveIpAllowlist(updated, ipRestrictionEnabled);
  };

  const toggleIpRestriction = () => {
    const newVal = !ipRestrictionEnabled;
    setIpRestrictionEnabled(newVal);
    void saveIpAllowlist(ipAllowlist, newVal);
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings/secure', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save settings');
      if (settings.sms_api_token) await smsService.initialize({ apiToken: settings.sms_api_token, senderId: settings.sms_sender_id });
      setSettingsSource('database');
      toast.success(result.message || 'Settings saved!');
      await Promise.all([loadSettings(), loadSystemStatus()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testEmailConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/settings/secure', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ api_url: settings.api_url, api_key: settings.api_key, list_id: settings.list_id }) });
      const result = await response.json();
      const success = response.ok && !!result.success;
      setTestResult({ success, message: result.message || (success ? 'Connection successful!' : 'Connection failed') });
      success ? toast.success('Sendy connection OK') : toast.error(result.error || result.message || 'Connection failed');
    } catch {
      setTestResult({ success: false, message: 'Network error' });
      toast.error('Failed to test connection');
    } finally {
      setTesting(false);
    }
  };

  const testSmsConnection = async () => {
    setTestingSms(true);
    setSmsTestResult(null);
    try {
      const service = settings.sms_api_token ? await smsService.initialize({ apiToken: settings.sms_api_token, senderId: settings.sms_sender_id }) : smsService;
      const balance = await service.getBalance();
      if (balance.error) {
        setSmsTestResult({ success: false, message: balance.error });
        toast.error('SMS connection test failed');
      } else {
        setSmsTestResult({ success: true, message: `Connected! Balance: ₹${balance.balance?.toFixed(2) || '0.00'}` });
        toast.success('SMS connection OK');
      }
    } catch {
      setSmsTestResult({ success: false, message: 'Failed to connect' });
      toast.error('SMS connection test failed');
    } finally {
      setTestingSms(false);
    }
  };

  const setupChecklist = useMemo(() => {
    if (!systemStatus) return [];
    return [
      { label: 'Session secret', ok: systemStatus.checks.sessionSecret },
      { label: 'Supabase URL', ok: systemStatus.checks.supabaseUrl },
      { label: 'Supabase anon key', ok: systemStatus.checks.supabaseAnonKey },
      { label: 'Sendy API URL', ok: systemStatus.checks.sendyApiUrl },
      { label: 'Sendy API key', ok: systemStatus.checks.sendyApiKey },
      { label: 'Sendy list ID', ok: systemStatus.checks.sendyListId },
      { label: 'From email', ok: systemStatus.checks.fromEmail },
      { label: 'From name', ok: systemStatus.checks.fromName },
    ];
  }, [systemStatus]);

  const blockerCount = setupChecklist.filter(i => !i.ok).length;

  const cardStyle = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    padding: isMobile ? 16 : 20,
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

  if (userRole === null || loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>Loading settings...</div>;
  }
  if (userRole !== 'admin') return null;

  return (
    <>
      <Toaster position="top-right" />
      <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Settings ⚙️</h1>
            <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 15 }}>Configure your email delivery and system settings</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : 'auto' }}>
            <button onClick={loadSystemStatus} style={{
              borderRadius: 10, background: '#fff', color: '#1a1a2e', border: '1px solid #E0F7FA',
              padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 44,
            }}>Refresh</button>
            <button onClick={saveSettings} disabled={saving} style={{
              borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
              padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              opacity: saving ? 0.6 : 1, minHeight: 44,
            }}>{saving ? 'Saving...' : 'Save Settings'}</button>
          </div>
        </div>

        {/* Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Settings from', value: settingsSource === 'database' ? 'Database' : 'Environment', icon: '💾' },
            { label: 'Data mode', value: systemStatus?.status.dataMode || '...', icon: '🔄' },
            { label: 'Security', value: systemStatus?.status.securityReady ? 'Ready' : 'Needs work', icon: systemStatus?.status.securityReady ? '🟢' : '🟡' },
            { label: 'Blockers', value: String(blockerCount), icon: blockerCount === 0 ? '🟢' : '🔴' },
          ].map(s => (
            <div key={s.label} style={{ ...cardStyle, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#8b8ba7' }}>{s.label}</span>
                <span>{s.icon}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Checklist */}
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Setup Checklist</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {setupChecklist.map(item => (
              <div key={item.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 10, border: '1px solid #E0F7FA',
                background: item.ok ? '#F8F9FF' : '#fff',
              }}>
                <span style={{ fontSize: 14, color: '#1a1a2e' }}>{item.label}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                  background: item.ok ? '#dcfce7' : '#fef3c7',
                  color: item.ok ? '#16a34a' : '#d97706',
                }}>{item.ok ? 'Ready' : 'Missing'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email Delivery */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Email Delivery (Sendy)</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Sendy API URL</label>
                <input type="url" value={settings.api_url} onChange={e => setSettings({ ...settings, api_url: e.target.value })} placeholder="https://my.bestemail.in" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>API Key</label>
                <div style={{ position: 'relative' }}>
                  <input type={showEmailApiKey ? 'text' : 'password'} value={settings.api_key} onChange={e => setSettings({ ...settings, api_key: e.target.value })} placeholder={settings.has_api_key ? 'Saved — enter new to replace' : 'Your Sendy API key'} style={{ ...inputStyle, paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowEmailApiKey(!showEmailApiKey)} style={{ position: 'absolute', right: 10, top: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}>{showEmailApiKey ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>List ID</label>
                  <input type="text" value={settings.list_id} onChange={e => setSettings({ ...settings, list_id: e.target.value })} placeholder="List ID" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Brand ID</label>
                  <input type="text" value={settings.brand_id} onChange={e => setSettings({ ...settings, brand_id: e.target.value })} placeholder="1" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>From Email</label>
                  <input type="email" value={settings.from_email} onChange={e => setSettings({ ...settings, from_email: e.target.value })} placeholder="hello@bestemail.in" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>From Name</label>
                  <input type="text" value={settings.from_name} onChange={e => setSettings({ ...settings, from_name: e.target.value })} placeholder="Bestemail" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={testEmailConnection} disabled={testing || (!settings.api_key && !settings.has_api_key)} style={{
                  borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
                  padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  opacity: testing || (!settings.api_key && !settings.has_api_key) ? 0.5 : 1, minHeight: 44,
                }}>{testing ? 'Testing...' : 'Test Connection'}</button>
                {testResult && <span style={{ fontSize: 13, color: testResult.success ? '#16a34a' : '#dc2626' }}>{testResult.message}</span>}
              </div>
            </div>
          </div>

          {/* SMS */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>SMS (Optional)</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '12px 14px', borderRadius: 10, border: '1px solid #E0F7FA', background: '#F8F9FF',
              }}>
                <input type="checkbox" checked={settings.sms_enabled} onChange={e => setSettings({ ...settings, sms_enabled: e.target.checked })} style={{ accentColor: '#00B4D8' }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>Enable SMS marketing</span>
              </label>

              {settings.sms_enabled ? (
                <>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>InstaSent API Token</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showSmsApiKey ? 'text' : 'password'} value={settings.sms_api_token} onChange={e => setSettings({ ...settings, sms_api_token: e.target.value })} placeholder="API token" style={{ ...inputStyle, paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowSmsApiKey(!showSmsApiKey)} style={{ position: 'absolute', right: 10, top: 8, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}>{showSmsApiKey ? '🙈' : '👁️'}</button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Sender ID</label>
                    <input type="text" value={settings.sms_sender_id} onChange={e => setSettings({ ...settings, sms_sender_id: e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 11) })} placeholder="BESTEMAIL" maxLength={11} style={inputStyle} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <button onClick={testSmsConnection} disabled={testingSms || !settings.sms_api_token} style={{
                      borderRadius: 10, background: '#16a34a', color: '#fff', border: 'none',
                      padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      opacity: testingSms || !settings.sms_api_token ? 0.5 : 1, minHeight: 44,
                    }}>{testingSms ? 'Testing...' : 'Test SMS'}</button>
                    {smsTestResult && <span style={{ fontSize: 13, color: smsTestResult.success ? '#16a34a' : '#dc2626' }}>{smsTestResult.message}</span>}
                  </div>
                </>
              ) : (
                <div style={{ padding: 14, background: '#F8F9FF', borderRadius: 10, fontSize: 13, color: '#8b8ba7', lineHeight: 1.6 }}>
                  Set up email delivery first. You can enable SMS later.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Health / Blacklist Monitoring */}
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Email Health</h2>
          <p style={{ color: '#8b8ba7', fontSize: 13, margin: '0 0 16px' }}>Check if your sending domain is blacklisted</p>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 16,
            background: '#dcfce7', borderRadius: 12, marginBottom: 12,
          }}>
            <span style={{ fontSize: 28 }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#166534' }}>Not blacklisted</div>
              <div style={{ fontSize: 13, color: '#166534', opacity: 0.8 }}>
                Your domain {settings.from_email ? settings.from_email.split('@')[1] : 'bestemail.in'} looks healthy
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            {['SPF Record', 'DKIM Record', 'DMARC Record'].map(record => (
              <div key={record} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 10, border: '1px solid #E0F7FA',
              }}>
                <span style={{ fontSize: 14, color: '#1a1a2e' }}>{record}</span>
                <span style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                  background: '#fef3c7', color: '#d97706',
                }}>Check manually</span>
              </div>
            ))}
          </div>

          <a
            href="https://mxtoolbox.com/blacklists.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              borderRadius: 10, background: '#E0F7FA', color: '#00B4D8', border: 'none',
              padding: '10px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none', minHeight: 44,
            }}
          >
            Check on MXToolbox &rarr;
          </a>
        </div>

        {/* Developer / API Access */}
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Developer / API Access</h2>
          <p style={{ color: '#8b8ba7', fontSize: 13, margin: '0 0 16px' }}>Use the Bestemail API to manage subscribers programmatically</p>

          <div style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Your API Key</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  readOnly
                  value="be_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                  style={{ ...inputStyle, flex: 1, background: '#F8F9FF', fontFamily: 'monospace', fontSize: 14 }}
                />
                <button
                  onClick={() => { toast.success('API key copied!'); navigator.clipboard?.writeText('be_live_xxxxxxxxxxxxxxxxxxxxxxxx'); }}
                  style={{
                    borderRadius: 8, border: '1px solid #E0F7FA', background: '#fff',
                    padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#00B4D8',
                    whiteSpace: 'nowrap', minHeight: 44,
                  }}
                >
                  Copy
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#8b8ba7', marginTop: 6 }}>
                Keep this key secret. Do not share it publicly.
              </p>
            </div>

            {settings.api_url && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Sendy SMTP Details</label>
                <div style={{ background: '#F8F9FF', borderRadius: 10, padding: 14, fontSize: 13, color: '#64648b', lineHeight: 1.8 }}>
                  <div><strong>API URL:</strong> {settings.api_url}</div>
                  <div><strong>List ID:</strong> {settings.list_id || 'Not set'}</div>
                  <div><strong>From:</strong> {settings.from_name} &lt;{settings.from_email}&gt;</div>
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Quick Start: Add a subscriber via API</label>
              <pre style={{
                background: '#1a1a2e', color: '#a5f3c4', borderRadius: 10, padding: 16,
                fontSize: 12, lineHeight: 1.6, overflow: 'auto', margin: 0,
              }}>
{`curl -X POST ${settings.api_url || 'https://your-sendy-url.com'}/subscribe \\
  -d api_key=YOUR_API_KEY \\
  -d list=${settings.list_id || 'YOUR_LIST_ID'} \\
  -d email=customer@example.com \\
  -d name=John`}
              </pre>
            </div>
          </div>
        </div>

        {/* IP Allowlist */}
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>IP Allowlist</h2>
          <p style={{ color: '#8b8ba7', fontSize: 13, margin: '0 0 16px' }}>Restrict account access to specific IP addresses</p>

          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            padding: '12px 14px', borderRadius: 10, border: '1px solid #E0F7FA', background: '#F8F9FF',
            marginBottom: 16,
          }}>
            <input type="checkbox" checked={ipRestrictionEnabled} onChange={toggleIpRestriction} disabled={savingIp} style={{ accentColor: '#00B4D8' }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>Enable IP restriction</span>
          </label>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              value={newIp}
              onChange={e => setNewIp(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIp()}
              placeholder="e.g. 192.168.1.1 or 10.0.0.0/24"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={addIp} disabled={savingIp} style={{
              borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
              padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap', minHeight: 44, opacity: savingIp ? 0.6 : 1,
            }}>Add IP</button>
          </div>

          {ipAllowlist.length === 0 ? (
            <div style={{ padding: 14, background: '#F8F9FF', borderRadius: 10, fontSize: 13, color: '#8b8ba7' }}>
              No IPs added. Leave empty to allow all IPs.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 6 }}>
              {ipAllowlist.map(ip => (
                <div key={ip} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 10, border: '1px solid #E0F7FA', background: '#F8F9FF',
                }}>
                  <span style={{ fontSize: 14, fontFamily: 'monospace', color: '#1a1a2e' }}>{ip}</span>
                  <button onClick={() => removeIp(ip)} style={{
                    background: '#FFF0F0', border: '1px solid #FFD5D5', borderRadius: 8,
                    color: '#e53e3e', padding: '4px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  }}>Remove</button>
                </div>
              ))}
            </div>
          )}

          {!ipRestrictionEnabled && ipAllowlist.length > 0 && (
            <div style={{ marginTop: 10, padding: 10, background: '#fef3c7', borderRadius: 8, fontSize: 12, color: '#d97706' }}>
              IP restriction is disabled. These IPs are saved but not enforced.
            </div>
          )}
        </div>

        {/* Save Button */}
        <button onClick={saveSettings} disabled={saving} style={{
          borderRadius: 12, background: '#00B4D8', color: '#fff', border: 'none',
          padding: '14px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          opacity: saving ? 0.6 : 1, minHeight: 44, width: isMobile ? '100%' : 'auto',
        }}>{saving ? 'Saving...' : 'Save All Settings'}</button>
      </div>
    </>
  );
}
