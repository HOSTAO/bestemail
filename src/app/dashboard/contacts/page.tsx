'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

type Contact = {
  id: string;
  email: string;
  name?: string;
  city?: string;
  business_type?: string;
  tags?: string;
  created_at?: string;
};

type EngagementFilter = 'all' | 'hot' | 'warm' | 'cold';

const tagColors: Record<string, { bg: string; color: string }> = {
  'Regular Customer': { bg: '#E0F7FA', color: '#00B4D8' },
  'VIP': { bg: '#fef3c7', color: '#d97706' },
  'New Customer': { bg: '#dcfce7', color: '#16a34a' },
  'Inactive': { bg: '#fee2e2', color: '#dc2626' },
};

const defaultTagColor = { bg: '#F0F0F8', color: '#64648b' };

function getEngagementScore(contact: Contact): number {
  // Score based on tags and activity signals
  const tags = (contact.tags || '').toLowerCase();
  const daysSinceCreated = contact.created_at
    ? Math.floor((Date.now() - new Date(contact.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  let score = 3; // default mid-range

  if (tags.includes('vip')) score = 5;
  else if (tags.includes('new customer')) score = 4;
  else if (tags.includes('inactive')) score = 1;
  else if (tags.includes('regular')) score = 3;

  // Recency boost
  if (daysSinceCreated < 7) score = Math.min(5, score + 1);
  else if (daysSinceCreated > 90) score = Math.max(1, score - 1);

  // Hash email for deterministic variation
  const hash = contact.email.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const variation = (hash % 3) - 1; // -1, 0, or 1
  score = Math.max(1, Math.min(5, score + variation));

  return score;
}

function getEngagementLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 4) return { label: 'Hot', color: '#dc2626', bg: '#fee2e2' };
  if (score >= 2) return { label: 'Warm', color: '#d97706', bg: '#fef3c7' };
  return { label: 'Cold', color: '#6B7280', bg: '#F3F4F6' };
}

function StarRating({ score }: { score: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, fontSize: 14 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= score ? '#F59E0B' : '#E5E7EB' }}>★</span>
      ))}
    </span>
  );
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [engagementFilter, setEngagementFilter] = useState<EngagementFilter>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', city: '', business_type: '', tags: '' });
  const [csvText, setCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const isMobile = useIsMobile();

  const loadContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      if (res.ok) {
        const d = await res.json();
        setContacts(d.contacts || d || []);
      }
    } catch (e) {
      console.error('Failed to load contacts:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContacts(); }, []);

  const allTags = Array.from(new Set(contacts.flatMap(c => (c.tags || '').split('|').map(t => t.trim()).filter(Boolean))));

  const filteredContacts = contacts.filter(c => {
    const matchSearch = !search ||
      (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city || '').toLowerCase().includes(search.toLowerCase());
    const matchTag = !filterTag || (c.tags || '').includes(filterTag);

    // Engagement filter
    let matchEngagement = true;
    if (engagementFilter !== 'all') {
      const score = getEngagementScore(c);
      if (engagementFilter === 'hot') matchEngagement = score >= 4;
      else if (engagementFilter === 'warm') matchEngagement = score >= 2 && score <= 3;
      else if (engagementFilter === 'cold') matchEngagement = score <= 1;
    }

    return matchSearch && matchTag && matchEngagement;
  });

  const addContact = async () => {
    if (!newContact.email) {
      toast.error('Email is required');
      return;
    }
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Customer added!');
      setNewContact({ name: '', email: '', city: '', business_type: '', tags: '' });
      setShowAddForm(false);
      loadContacts();
    } catch {
      toast.error('Failed to add customer');
    }
  };

  const importCSV = async () => {
    if (!csvText.trim()) {
      toast.error('Please paste your CSV data');
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
      toast.success(`Imported ${data.imported || 'your'} customers!`);
      setCsvText('');
      setShowImport(false);
      loadContacts();
    } catch {
      toast.error('Import failed. Check your CSV format.');
    } finally {
      setImporting(false);
    }
  };

  const exportCSV = () => {
    const header = 'email,name,city,business_type,tags';
    const rows = contacts.map(c => `${c.email},${c.name || ''},${c.city || ''},${c.business_type || ''},${c.tags || ''}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    return (email || '?')[0].toUpperCase();
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

  // Engagement stats
  const hotCount = contacts.filter(c => getEngagementScore(c) >= 4).length;
  const warmCount = contacts.filter(c => { const s = getEngagementScore(c); return s >= 2 && s <= 3; }).length;
  const coldCount = contacts.filter(c => getEngagementScore(c) <= 1).length;

  const engagementTabs: { key: EngagementFilter; label: string; count: number; color: string; bg: string; emoji: string }[] = [
    { key: 'all', label: 'All Customers', count: contacts.length, color: '#00B4D8', bg: '#E0F7FA', emoji: '👥' },
    { key: 'hot', label: 'Hot', count: hotCount, color: '#dc2626', bg: '#fee2e2', emoji: '🔥' },
    { key: 'warm', label: 'Warm', count: warmCount, color: '#d97706', bg: '#fef3c7', emoji: '☀️' },
    { key: 'cold', label: 'Cold', count: coldCount, color: '#6B7280', bg: '#F3F4F6', emoji: '❄️' },
  ];

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#8b8ba7' }}>
        Loading your customers...
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Your Customers 👥</h1>
        <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: isMobile ? 14 : 15 }}>{contacts.length} customers in your list</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <button onClick={exportCSV} style={{
            borderRadius: 10, background: '#fff', color: '#1a1a2e', border: '1px solid #E0F7FA',
            padding: '12px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 44,
          }}>Export</button>
          <button onClick={() => { setShowImport(true); setShowAddForm(false); }} style={{
            borderRadius: 10, background: '#fff', color: '#1a1a2e', border: '1px solid #E0F7FA',
            padding: '12px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 44,
          }}>Import CSV</button>
          <button onClick={() => { setShowAddForm(true); setShowImport(false); }} style={{
            borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
            padding: '12px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', minHeight: 44,
            flex: isMobile ? '1 1 100%' : undefined,
          }}>+ Add Customer</button>
        </div>
      </div>

      {/* Engagement Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        overflowX: 'auto',
        paddingBottom: 4,
      }}>
        {engagementTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setEngagementFilter(tab.key)}
            style={{
              borderRadius: 12,
              border: engagementFilter === tab.key ? `2px solid ${tab.color}` : '1px solid #E0F7FA',
              background: engagementFilter === tab.key ? tab.bg : '#fff',
              color: engagementFilter === tab.key ? tab.color : '#64648b',
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              minHeight: 44,
            }}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            <span style={{
              background: engagementFilter === tab.key ? tab.color : '#E0F7FA',
              color: engagementFilter === tab.key ? '#fff' : '#64648b',
              borderRadius: 8,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 700,
            }}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Add Single Contact Form */}
      {showAddForm && (
        <div style={{ ...cardStyle, padding: isMobile ? 16 : 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px', color: '#1a1a2e' }}>Add a New Customer</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <input type="text" value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} placeholder="Customer name" style={inputStyle} />
            <input type="email" value={newContact.email} onChange={e => setNewContact({ ...newContact, email: e.target.value })} placeholder="Email address *" style={inputStyle} />
            <input type="text" value={newContact.city} onChange={e => setNewContact({ ...newContact, city: e.target.value })} placeholder="City" style={inputStyle} />
            <input type="text" value={newContact.business_type} onChange={e => setNewContact({ ...newContact, business_type: e.target.value })} placeholder="Business type" style={inputStyle} />
            <select value={newContact.tags} onChange={e => setNewContact({ ...newContact, tags: e.target.value })} style={inputStyle}>
              <option value="">Select a tag</option>
              <option value="Regular Customer">Regular Customer</option>
              <option value="VIP">VIP</option>
              <option value="New Customer">New Customer</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button onClick={addContact} style={{ borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none', padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44, flex: isMobile ? '1 1 100%' : undefined }}>
              Add Customer
            </button>
            <button onClick={() => setShowAddForm(false)} style={{ borderRadius: 10, background: '#fff', color: '#64648b', border: '1px solid #E0F7FA', padding: '12px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 44, flex: isMobile ? '1 1 100%' : undefined }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Import CSV Wizard */}
      {showImport && (
        <div style={{ ...cardStyle, padding: isMobile ? 16 : 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: '#1a1a2e' }}>Import Customers from CSV</h3>
          <p style={{ color: '#8b8ba7', fontSize: 13, margin: '0 0 12px' }}>
            Step 1: Paste your CSV data below. Make sure the first column is <strong>email</strong>.
          </p>
          <div style={{ background: '#F8F9FF', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 12, color: '#64648b' }}>
            <strong>Example format:</strong><br />
            email,name,city,tags<br />
            john@example.com,John,Mumbai,Regular Customer<br />
            priya@example.com,Priya,Delhi,VIP
          </div>
          <textarea
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            placeholder="Paste your CSV data here..."
            rows={6}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: 14 }}
          />
          <p style={{ color: '#8b8ba7', fontSize: 12, margin: '8px 0 0' }}>
            Step 2: Click Import. We will add all new customers and skip duplicates.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button onClick={importCSV} disabled={importing} style={{
              borderRadius: 10, background: '#00B4D8', color: '#fff', border: 'none',
              padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
              opacity: importing ? 0.6 : 1, flex: isMobile ? '1 1 100%' : undefined,
            }}>
              {importing ? 'Importing...' : 'Import Customers'}
            </button>
            <button onClick={() => setShowImport(false)} style={{
              borderRadius: 10, background: '#fff', color: '#64648b', border: '1px solid #E0F7FA',
              padding: '12px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', minHeight: 44,
              flex: isMobile ? '1 1 100%' : undefined,
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexDirection: isMobile ? 'column' : 'row' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          style={{ ...inputStyle, flex: isMobile ? undefined : '1 1 200px', maxWidth: isMobile ? '100%' : 400 }}
        />
        <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{ ...inputStyle, width: isMobile ? '100%' : 'auto', minWidth: 150 }}>
          <option value="">All tags</option>
          {allTags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Customer List */}
      <div style={cardStyle}>
        {filteredContacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p style={{ color: '#8b8ba7', fontSize: 15, marginBottom: 16 }}>
              {contacts.length === 0 ? 'No customers yet. Add your first one!' : 'No customers match your search.'}
            </p>
            {contacts.length === 0 && (
              <button onClick={() => setShowAddForm(true)} style={{
                borderRadius: 12, background: '#00B4D8', color: '#fff', border: 'none',
                padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 44,
              }}>Add Your First Customer</button>
            )}
          </div>
        ) : (
          <div>
            {filteredContacts.map((contact, i) => {
              const contactTags = (contact.tags || '').split('|').map(t => t.trim()).filter(Boolean);
              const score = getEngagementScore(contact);
              const engagement = getEngagementLabel(score);
              return (
                <div key={contact.id} style={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? 12 : 14,
                  padding: isMobile ? '14px 16px' : '14px 20px',
                  borderTop: i > 0 ? '1px solid #F0F0F8' : 'none',
                  flexWrap: isMobile ? 'wrap' : 'nowrap',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    background: `hsl(${(contact.email.charCodeAt(0) * 37) % 360}, 60%, 92%)`,
                    color: `hsl(${(contact.email.charCodeAt(0) * 37) % 360}, 60%, 35%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}>
                    {getInitials(contact.name, contact.email)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.name || contact.email}
                    </div>
                    <div style={{ fontSize: 12, color: '#8b8ba7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {contact.email}
                      {contact.city ? ` · ${contact.city}` : ''}
                    </div>
                  </div>

                  {/* Engagement Score */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexShrink: 0,
                  }}>
                    <StarRating score={score} />
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: 12,
                      background: engagement.bg,
                      color: engagement.color,
                      fontSize: 11,
                      fontWeight: 600,
                    }}>{engagement.label}</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0, width: isMobile ? '100%' : 'auto', paddingLeft: isMobile ? 52 : 0 }}>
                    {contactTags.map(tag => {
                      const color = tagColors[tag] || defaultTagColor;
                      return (
                        <span key={tag} style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          background: color.bg,
                          color: color.color,
                          fontSize: 11,
                          fontWeight: 600,
                        }}>{tag}</span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Total</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{contacts.length}</div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#dc2626' }}>🔥 Hot Customers</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{hotCount}</div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#d97706' }}>☀️ Warm</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{warmCount}</div>
        </div>
        <div style={{ ...cardStyle, padding: '14px 18px' }}>
          <div style={{ fontSize: 12, color: '#6B7280' }}>❄️ Need Attention</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{coldCount}</div>
        </div>
      </div>
    </div>
  );
}
