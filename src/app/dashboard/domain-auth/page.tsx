'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

type Domain = {
  id: string;
  domain: string;
  dkim_selector: string;
  dkim_public_key: string;
  spf_verified: boolean;
  dkim_verified: boolean;
  dmarc_verified: boolean;
  verified_at: string | null;
  created_at: string;
  cf_zone_id?: string;
  cf_connected?: boolean;
  cf_token_hint?: string;
};

type CfResult = { record: string; status: 'created' | 'updated' | 'error'; error?: string };
type CfZone = { id: string; name: string; status: string; plan: string };

export default function DomainAuthPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cfExpandedId, setCfExpandedId] = useState<string | null>(null);
  const [cfToken, setCfToken] = useState('');
  const [cfSyncing, setCfSyncing] = useState<string | null>(null);
  const [cfResults, setCfResults] = useState<Record<string, CfResult[]>>({});
  const [cfZones, setCfZones] = useState<CfZone[]>([]);
  const [cfFetchingZones, setCfFetchingZones] = useState(false);
  const [cfSelectedZone, setCfSelectedZone] = useState<CfZone | null>(null);
  const [cfTokenVerified, setCfTokenVerified] = useState(false);
  const isMobile = useIsMobile();

  const loadDomains = async () => {
    try {
      const res = await fetch('/api/domain-auth');
      const d = await res.json();
      if (res.ok) {
        setDomains(d.data || []);
      } else {
        toast.error(d.error || 'Failed to load domains');
      }
    } catch {
      toast.error('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDomains(); }, []);

  const addDomain = async () => {
    const trimmed = newDomain.trim().toLowerCase();
    if (!trimmed) {
      toast.error('Domain name is required');
      return;
    }
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(trimmed)) {
      toast.error('Enter a valid domain (e.g. example.com)');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/domain-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: trimmed }),
      });
      const d = await res.json();
      if (res.ok) {
        toast.success('Domain added. Configure the DNS records below, then verify.');
        setNewDomain('');
        setShowAddForm(false);
        await loadDomains();
        setExpandedId(d.data?.id || null);
      } else {
        toast.error(d.error || 'Failed to add domain');
      }
    } catch {
      toast.error('Failed to add domain');
    } finally {
      setAdding(false);
    }
  };

  const verifyDomain = async (domainId: string) => {
    setVerifyingId(domainId);
    try {
      const res = await fetch('/api/domain-auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain_id: domainId }),
      });
      const d = await res.json();
      if (res.ok) {
        const result = d.data;
        if (result.spf_verified && result.dkim_verified && result.dmarc_verified) {
          toast.success('All DNS records verified!');
        } else {
          const missing: string[] = [];
          if (!result.spf_verified) missing.push('SPF');
          if (!result.dkim_verified) missing.push('DKIM');
          if (!result.dmarc_verified) missing.push('DMARC');
          toast.error(`Verification incomplete: ${missing.join(', ')} not found`);
        }
        await loadDomains();
      } else {
        toast.error(d.error || 'Verification failed');
      }
    } catch {
      toast.error('Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const deleteDomain = async (domain: Domain) => {
    if (!confirm(`Delete domain "${domain.domain}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/domain-auth?id=${domain.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Domain deleted');
        if (expandedId === domain.id) setExpandedId(null);
        loadDomains();
      } else {
        toast.error('Failed to delete domain');
      }
    } catch {
      toast.error('Failed to delete domain');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const fetchCfZones = async () => {
    if (!cfToken.trim()) {
      toast.error('Cloudflare API token is required');
      return;
    }
    setCfFetchingZones(true);
    setCfZones([]);
    setCfSelectedZone(null);
    setCfTokenVerified(false);
    try {
      const res = await fetch('/api/domain-auth/cloudflare-zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloudflare_token: cfToken }),
      });
      const d = await res.json();
      if (res.ok && d.zones) {
        setCfZones(d.zones);
        setCfTokenVerified(true);
        if (d.zones.length === 0) {
          toast.error('No domains found in this Cloudflare account');
        } else {
          toast.success(`Found ${d.zones.length} domain${d.zones.length > 1 ? 's' : ''}`);
        }
      } else {
        toast.error(d.error || 'Invalid token or API error');
      }
    } catch {
      toast.error('Failed to connect to Cloudflare');
    } finally {
      setCfFetchingZones(false);
    }
  };

  const syncCloudflare = async (domain: Domain) => {
    if (!cfToken.trim() || !cfSelectedZone) {
      toast.error('Select a domain first');
      return;
    }
    setCfSyncing(domain.id);
    setCfResults(prev => ({ ...prev, [domain.id]: [] }));
    try {
      const res = await fetch('/api/domain-auth/cloudflare-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain.domain,
          cloudflare_token: cfToken,
          zone_id: cfSelectedZone.id,
        }),
      });
      const d = await res.json();
      if (res.ok && d.results) {
        setCfResults(prev => ({ ...prev, [domain.id]: d.results }));
        const errors = d.results.filter((r: CfResult) => r.status === 'error');
        if (errors.length === 0) {
          toast.success('DNS records added to Cloudflare!');
          await loadDomains();
        } else {
          toast.error(`${errors.length} record(s) failed`);
        }
      } else {
        toast.error(d.error || 'Cloudflare sync failed');
      }
    } catch {
      toast.error('Cloudflare sync failed');
    } finally {
      setCfSyncing(null);
    }
  };

  const getStatusBadge = (domain: Domain) => {
    if (domain.verified_at) {
      return { label: 'Verified', style: { background: '#dcfce7', color: '#16a34a' } };
    }
    if (domain.spf_verified || domain.dkim_verified || domain.dmarc_verified) {
      return { label: 'Pending', style: { background: '#fef3c7', color: '#d97706' } };
    }
    return { label: 'Pending', style: { background: '#fef3c7', color: '#d97706' } };
  };

  const getCheckIcon = (verified: boolean) => (
    <span style={{ color: verified ? '#16a34a' : '#dc2626', fontWeight: 700, fontSize: 16 }}>
      {verified ? '\u2713' : '\u2717'}
    </span>
  );

  const cardStyle = {
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
    fontSize: 16,
    boxSizing: 'border-box',
    outline: 'none',
  };

  const btnPrimary: React.CSSProperties = {
    background: '#00B4D8',
    color: '#fff',
    borderRadius: 12,
    border: 'none',
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a2e',
    display: 'block',
    marginBottom: 6,
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        Loading domains...
      </div>
    );
  }

  const renderDnsPanel = (domain: Domain) => {
    const spfRecord = `v=spf1 include:_spf.bestemail.io ~all`;
    const dkimHost = `${domain.dkim_selector}._domainkey.${domain.domain}`;
    const dkimValue = `v=DKIM1; k=rsa; p=${domain.dkim_public_key}`;
    const dmarcRecord = `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain.domain}`;

    const recordRowStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: 8,
      alignItems: isMobile ? 'stretch' : 'center',
      padding: '12px 0',
      borderBottom: '1px solid #E0F7FA',
    };

    const recordLabelStyle: React.CSSProperties = {
      fontSize: 12,
      fontWeight: 700,
      color: '#00B4D8',
      minWidth: 60,
      textTransform: 'uppercase',
    };

    const recordValueStyle: React.CSSProperties = {
      flex: 1,
      fontSize: 13,
      color: '#1a1a2e',
      fontFamily: 'monospace',
      wordBreak: 'break-all',
      background: '#F8F9FF',
      padding: '8px 12px',
      borderRadius: 8,
    };

    const copyBtnStyle: React.CSSProperties = {
      background: '#fff',
      border: '1px solid #E0F7FA',
      borderRadius: 8,
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 600,
      color: '#00B4D8',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    };

    return (
      <div style={{ ...cardStyle, padding: 20, marginTop: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>
          DNS Records for {domain.domain}
        </h3>
        <p style={{ fontSize: 13, color: '#64648b', margin: '0 0 16px', lineHeight: 1.5 }}>
          Add the following DNS records to your domain provider, then click &ldquo;Verify DNS&rdquo; to confirm.
        </p>

        {/* SPF */}
        <div style={recordRowStyle}>
          <span style={recordLabelStyle}>SPF</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 4 }}>
              Type: <strong>TXT</strong> &nbsp; Host: <strong>@</strong>
            </div>
            <div style={recordValueStyle}>{spfRecord}</div>
          </div>
          <button onClick={() => copyToClipboard(spfRecord, 'SPF record')} style={copyBtnStyle}>
            Copy
          </button>
        </div>

        {/* DKIM */}
        <div style={recordRowStyle}>
          <span style={recordLabelStyle}>DKIM</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 4 }}>
              Type: <strong>TXT</strong> &nbsp; Host: <strong>{dkimHost}</strong>
            </div>
            <div style={recordValueStyle}>{dkimValue}</div>
          </div>
          <button onClick={() => copyToClipboard(dkimValue, 'DKIM record')} style={copyBtnStyle}>
            Copy
          </button>
        </div>

        {/* DMARC */}
        <div style={{ ...recordRowStyle, borderBottom: 'none' }}>
          <span style={recordLabelStyle}>DMARC</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#8b8ba7', marginBottom: 4 }}>
              Type: <strong>TXT</strong> &nbsp; Host: <strong>_dmarc</strong>
            </div>
            <div style={recordValueStyle}>{dmarcRecord}</div>
          </div>
          <button onClick={() => copyToClipboard(dmarcRecord, 'DMARC record')} style={copyBtnStyle}>
            Copy
          </button>
        </div>
      </div>
    );
  };

  const renderCloudflarePanel = (domain: Domain) => {
    const isOpen = cfExpandedId === domain.id;
    const isSyncing = cfSyncing === domain.id;
    const results = cfResults[domain.id] || [];

    const cfInputStyle: React.CSSProperties = {
      width: '100%', borderRadius: 8, border: '1px solid #E0F7FA',
      padding: '10px 14px', fontSize: 14, boxSizing: 'border-box' as const, outline: 'none',
    };

    return (
      <div style={{ ...cardStyle, padding: 20, marginTop: 12 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          onClick={() => {
            setCfExpandedId(isOpen ? null : domain.id);
            if (isOpen) {
              setCfResults(prev => ({ ...prev, [domain.id]: [] }));
            }
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>&#x26A1;</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
              Add DNS records automatically
            </span>
            {domain.cf_connected && (
              <span style={{
                background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 700,
                padding: '3px 8px', borderRadius: 12,
              }}>
                Cloudflare Connected
              </span>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#8b8ba7' }}>{isOpen ? '\u25B2' : '\u25BC'}</span>
        </div>

        {isOpen && (
          <div style={{ marginTop: 16 }}>
            {/* Step 1 — Token */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{
                  background: '#00B4D8', color: '#fff', fontSize: 11, fontWeight: 700,
                  width: 22, height: 22, borderRadius: '50%', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>1</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Paste your Cloudflare API Token</span>
                {cfTokenVerified && (
                  <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 14 }}>{'\u2713'}</span>
                )}
              </div>
              <input
                type="password"
                value={cfToken}
                onChange={e => {
                  setCfToken(e.target.value);
                  if (cfTokenVerified) {
                    setCfTokenVerified(false);
                    setCfZones([]);
                    setCfSelectedZone(null);
                  }
                }}
                placeholder="Paste your Cloudflare API token here"
                style={cfInputStyle}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: '#8b8ba7', lineHeight: 1.6 }}>
                In Cloudflare &rarr; Profile &rarr; API Tokens &rarr; Create Token &rarr; Use &ldquo;Edit zone DNS&rdquo; template.{' '}
                <a
                  href="https://dash.cloudflare.com/profile/api-tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00B4D8', fontWeight: 600, textDecoration: 'none' }}
                >
                  Open Cloudflare &rarr;
                </a>
              </div>
              <button
                onClick={fetchCfZones}
                disabled={cfFetchingZones || !cfToken.trim()}
                style={{
                  ...btnPrimary, marginTop: 10, borderRadius: 10, padding: '9px 18px', fontSize: 13,
                  opacity: (cfFetchingZones || !cfToken.trim()) ? 0.5 : 1, minHeight: 38,
                }}
              >
                {cfFetchingZones ? 'Fetching domains...' : 'Fetch My Domains'}
              </button>
            </div>

            {/* Step 2 — Domain dropdown */}
            {cfTokenVerified && cfZones.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{
                    background: '#00B4D8', color: '#fff', fontSize: 11, fontWeight: 700,
                    width: 22, height: 22, borderRadius: '50%', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>2</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Select your domain</span>
                  {cfSelectedZone && (
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 14 }}>{'\u2713'}</span>
                  )}
                </div>
                <select
                  value={cfSelectedZone?.id || ''}
                  onChange={e => {
                    const zone = cfZones.find(z => z.id === e.target.value) || null;
                    setCfSelectedZone(zone);
                  }}
                  style={{
                    ...cfInputStyle,
                    cursor: 'pointer',
                    background: '#fff',
                    appearance: 'auto',
                  }}
                >
                  <option value="">-- Select a domain --</option>
                  {cfZones.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.status === 'active' ? 'Active' : z.status})
                    </option>
                  ))}
                </select>
                {cfSelectedZone && (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 600 }}>{cfSelectedZone.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 12,
                      background: cfSelectedZone.status === 'active' ? '#dcfce7' : '#fef3c7',
                      color: cfSelectedZone.status === 'active' ? '#16a34a' : '#d97706',
                    }}>
                      {cfSelectedZone.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                    <span style={{ fontSize: 11, color: '#8b8ba7' }}>{cfSelectedZone.plan}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Add records */}
            {cfSelectedZone && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{
                    background: '#00B4D8', color: '#fff', fontSize: 11, fontWeight: 700,
                    width: 22, height: 22, borderRadius: '50%', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>3</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>Add DNS Records to Cloudflare</span>
                </div>
                {cfSelectedZone.name !== domain.domain && (
                  <div style={{
                    background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8,
                    padding: '8px 12px', fontSize: 12, color: '#92400e', marginBottom: 10, lineHeight: 1.5,
                  }}>
                    Note: Selected zone <strong>{cfSelectedZone.name}</strong> doesn&apos;t match domain <strong>{domain.domain}</strong>. Records will be added to the selected zone.
                  </div>
                )}
                <button
                  onClick={() => syncCloudflare(domain)}
                  disabled={isSyncing}
                  style={{
                    ...btnPrimary, borderRadius: 10, padding: '10px 20px', fontSize: 13,
                    opacity: isSyncing ? 0.5 : 1, minHeight: 40,
                  }}
                >
                  {isSyncing ? 'Adding records...' : domain.cf_connected ? 'Re-sync DNS Records' : 'Add DNS Records to Cloudflare'}
                </button>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {results.map((r) => (
                  <div key={r.record} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <span style={{ color: r.status === 'error' ? '#dc2626' : '#16a34a', fontWeight: 700, fontSize: 15 }}>
                      {r.status === 'error' ? '\u2717' : '\u2713'}
                    </span>
                    <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{r.record}</span>
                    <span style={{ color: r.status === 'error' ? '#dc2626' : '#8b8ba7' }}>
                      {r.status === 'error' ? r.error || 'failed' : r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Domain Authentication</h1>
          <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 14 }}>
            {domains.length} domain{domains.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          style={{ ...btnPrimary, minHeight: 44, borderRadius: 10, padding: '12px 20px' }}
        >
          + Add Domain
        </button>
      </div>

      {/* Add Domain Form */}
      {showAddForm && (
        <div style={{ ...cardStyle, padding: isMobile ? 20 : 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>Add a New Domain</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Domain Name</label>
            <input
              type="text"
              value={newDomain}
              onChange={e => setNewDomain(e.target.value)}
              placeholder="e.g. example.com"
              style={inputStyle}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') addDomain(); }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={addDomain} disabled={adding} style={{ ...btnPrimary, opacity: adding ? 0.6 : 1, minHeight: 44 }}>
              {adding ? 'Adding...' : 'Add Domain'}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewDomain(''); }}
              style={{
                borderRadius: 12, background: '#fff', color: '#64648b', border: '1px solid #E0F7FA',
                padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 44,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {domains.length === 0 && !showAddForm ? (
        <div style={{ ...cardStyle, padding: '48px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x1F310;</div>
          <p style={{ color: '#1a1a2e', fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No domains configured</p>
          <p style={{ color: '#8b8ba7', fontSize: 14, marginBottom: 20, maxWidth: 420, margin: '0 auto 20px' }}>
            Authenticate your sending domain to improve email deliverability with SPF, DKIM, and DMARC records.
          </p>
          <button onClick={() => setShowAddForm(true)} style={{ ...btnPrimary, minHeight: 44, padding: '12px 24px' }}>
            Add Your First Domain
          </button>
        </div>
      ) : domains.length > 0 && (
        /* Domains Table */
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          {/* Table Header */}
          {!isMobile && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 70px 70px 80px 100px 90px 80px',
              gap: 8,
              padding: '14px 20px',
              background: '#F8F9FF',
              borderBottom: '1px solid #E0F7FA',
              fontSize: 12,
              fontWeight: 700,
              color: '#8b8ba7',
              textTransform: 'uppercase',
            }}>
              <span>Domain</span>
              <span style={{ textAlign: 'center' }}>SPF</span>
              <span style={{ textAlign: 'center' }}>DKIM</span>
              <span style={{ textAlign: 'center' }}>DMARC</span>
              <span style={{ textAlign: 'center' }}>Status</span>
              <span style={{ textAlign: 'center' }}>Verify</span>
              <span style={{ textAlign: 'center' }}>Delete</span>
            </div>
          )}

          {/* Rows */}
          {domains.map(domain => {
            const status = getStatusBadge(domain);
            const isExpanded = expandedId === domain.id;

            return (
              <div key={domain.id}>
                {isMobile ? (
                  /* Mobile Card Layout */
                  <div style={{ padding: 16, borderBottom: '1px solid #E0F7FA' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span
                        style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', cursor: 'pointer' }}
                        onClick={() => setExpandedId(isExpanded ? null : domain.id)}
                      >
                        {domain.domain}
                      </span>
                      <span style={{
                        ...status.style,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 20,
                      }}>
                        {status.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64648b', marginBottom: 12 }}>
                      <span>SPF {getCheckIcon(domain.spf_verified)}</span>
                      <span>DKIM {getCheckIcon(domain.dkim_verified)}</span>
                      <span>DMARC {getCheckIcon(domain.dmarc_verified)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : domain.id)}
                        style={{
                          borderRadius: 8, border: '1px solid #E0F7FA', background: '#F8F9FF',
                          padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#00B4D8', cursor: 'pointer',
                        }}
                      >
                        {isExpanded ? 'Hide DNS' : 'Show DNS'}
                      </button>
                      <button
                        onClick={() => verifyDomain(domain.id)}
                        disabled={verifyingId === domain.id}
                        style={{
                          ...btnPrimary, padding: '6px 14px', fontSize: 12, borderRadius: 8,
                          opacity: verifyingId === domain.id ? 0.6 : 1,
                        }}
                      >
                        {verifyingId === domain.id ? 'Verifying...' : 'Verify'}
                      </button>
                      <button
                        onClick={() => deleteDomain(domain)}
                        style={{
                          borderRadius: 8, border: '1px solid #FFD5D5', background: '#FFF0F0',
                          padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#e53e3e', cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    {isExpanded && (
                      <>
                        {renderDnsPanel(domain)}
                        {renderCloudflarePanel(domain)}
                      </>
                    )}
                  </div>
                ) : (
                  /* Desktop Table Row */
                  <>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 70px 70px 80px 100px 90px 80px',
                      gap: 8,
                      padding: '14px 20px',
                      borderBottom: '1px solid #E0F7FA',
                      alignItems: 'center',
                      fontSize: 14,
                    }}>
                      <span
                        style={{ fontWeight: 600, color: '#1a1a2e', cursor: 'pointer' }}
                        onClick={() => setExpandedId(isExpanded ? null : domain.id)}
                        title="Click to show/hide DNS records"
                      >
                        {domain.domain}
                        <span style={{ fontSize: 11, color: '#8b8ba7', marginLeft: 6 }}>
                          {isExpanded ? '\u25B2' : '\u25BC'}
                        </span>
                      </span>
                      <span style={{ textAlign: 'center' }}>{getCheckIcon(domain.spf_verified)}</span>
                      <span style={{ textAlign: 'center' }}>{getCheckIcon(domain.dkim_verified)}</span>
                      <span style={{ textAlign: 'center' }}>{getCheckIcon(domain.dmarc_verified)}</span>
                      <span style={{ textAlign: 'center' }}>
                        <span style={{
                          ...status.style,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 20,
                          display: 'inline-block',
                        }}>
                          {status.label}
                        </span>
                      </span>
                      <span style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => verifyDomain(domain.id)}
                          disabled={verifyingId === domain.id}
                          style={{
                            ...btnPrimary, padding: '6px 14px', fontSize: 12, borderRadius: 8,
                            opacity: verifyingId === domain.id ? 0.6 : 1,
                          }}
                        >
                          {verifyingId === domain.id ? '...' : 'Verify'}
                        </button>
                      </span>
                      <span style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => deleteDomain(domain)}
                          style={{
                            borderRadius: 8, border: '1px solid #FFD5D5', background: '#FFF0F0',
                            padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#e53e3e', cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </span>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: '0 20px 16px' }}>
                        {renderDnsPanel(domain)}
                        {renderCloudflarePanel(domain)}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
