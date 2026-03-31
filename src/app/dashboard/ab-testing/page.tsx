'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ABTest {
  id: string;
  name: string;
  status: 'Running' | 'Completed' | 'Winner Sent';
  createdAt: string;
  split: string;
  winnerCriteria: string;
  autoSendAfter: number;
  versionA: {
    subject: string;
    preview: string;
    openRate: number;
    clickRate: number;
  };
  versionB: {
    subject: string;
    preview: string;
    openRate: number;
    clickRate: number;
  };
  winner: 'A' | 'B' | null;
}

const mockTests: ABTest[] = [
  {
    id: '1',
    name: 'Spring Sale Launch',
    status: 'Winner Sent',
    createdAt: '2026-03-10',
    split: '50/50',
    winnerCriteria: 'Most Opens',
    autoSendAfter: 4,
    versionA: { subject: 'Spring deals are here!', preview: 'Up to 40% off everything...', openRate: 32.1, clickRate: 8.4 },
    versionB: { subject: "Don't miss our Spring Sale", preview: 'Limited time savings inside...', openRate: 41.3, clickRate: 12.7 },
    winner: 'B',
  },
  {
    id: '2',
    name: 'Weekly Newsletter #42',
    status: 'Running',
    createdAt: '2026-03-13',
    split: '50/50',
    winnerCriteria: 'Most Clicks',
    autoSendAfter: 6,
    versionA: { subject: 'This week in tech', preview: 'The top stories you need to know...', openRate: 28.5, clickRate: 6.2 },
    versionB: { subject: '5 stories you missed this week', preview: 'Catch up on what matters...', openRate: 31.2, clickRate: 7.8 },
    winner: null,
  },
  {
    id: '3',
    name: 'Product Update March',
    status: 'Completed',
    createdAt: '2026-03-08',
    split: '60/40',
    winnerCriteria: 'Most Opens',
    autoSendAfter: 12,
    versionA: { subject: 'New features just dropped', preview: 'Check out what we built for you...', openRate: 45.6, clickRate: 15.3 },
    versionB: { subject: "March product update", preview: "See what's new this month...", openRate: 38.9, clickRate: 11.1 },
    winner: 'A',
  },
  {
    id: '4',
    name: 'Re-engagement Campaign',
    status: 'Winner Sent',
    createdAt: '2026-03-05',
    split: '70/30',
    winnerCriteria: 'Most Clicks',
    autoSendAfter: 24,
    versionA: { subject: 'We miss you!', preview: "It's been a while since your last visit...", openRate: 22.4, clickRate: 4.1 },
    versionB: { subject: 'Come back for 20% off', preview: 'A special offer just for you...', openRate: 35.8, clickRate: 9.6 },
    winner: 'B',
  },
  {
    id: '5',
    name: 'Onboarding Sequence Test',
    status: 'Running',
    createdAt: '2026-03-14',
    split: '50/50',
    winnerCriteria: 'Most Opens',
    autoSendAfter: 2,
    versionA: { subject: 'Welcome aboard!', preview: "Here's how to get started...", openRate: 52.1, clickRate: 18.3 },
    versionB: { subject: 'Your first steps with Bestemail', preview: "Let's set you up for success...", openRate: 49.7, clickRate: 20.1 },
    winner: null,
  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Running: { bg: '#E8F4FD', color: '#1976D2' },
  Completed: { bg: '#E8F5E9', color: '#2E7D32' },
  'Winner Sent': { bg: '#E0F7FA', color: '#00B4D8' },
};

export default function ABTestingPage() {
  const isMobile = useIsMobile();
  const [tests, setTests] = useState<ABTest[]>(mockTests);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    subjectA: '',
    previewA: '',
    subjectB: '',
    previewB: '',
    split: '50/50',
    winnerCriteria: 'Most Opens',
    autoSendAfter: 4,
  });

  const totalTests = tests.length;
  const runningNow = tests.filter((t) => t.status === 'Running').length;
  const completed = tests.filter((t) => t.status !== 'Running').length;

  const stats = [
    { label: 'Total Tests', value: totalTests, icon: '\u{1F9EA}' },
    { label: 'Running Now', value: runningNow, icon: '\u25B6' },
    { label: 'Completed', value: completed, icon: '\u2713' },
  ];

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a campaign name');
      return;
    }
    if (!formData.subjectA.trim() || !formData.subjectB.trim()) {
      toast.error('Both versions need a subject line');
      return;
    }

    const newTest: ABTest = {
      id: Date.now().toString(),
      name: formData.name,
      status: 'Running',
      createdAt: new Date().toISOString().split('T')[0],
      split: formData.split,
      winnerCriteria: formData.winnerCriteria,
      autoSendAfter: formData.autoSendAfter,
      versionA: { subject: formData.subjectA, preview: formData.previewA, openRate: 0, clickRate: 0 },
      versionB: { subject: formData.subjectB, preview: formData.previewB, openRate: 0, clickRate: 0 },
      winner: null,
    };

    setTests((prev) => [newTest, ...prev]);
    setFormData({ name: '', subjectA: '', previewA: '', subjectB: '', previewB: '', split: '50/50', winnerCriteria: 'Most Opens', autoSendAfter: 4 });
    setShowForm(false);
    toast.success("A/B test started! We'll pick the winner automatically.");
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    fontSize: 14,
    border: '1px solid #E0F7FA',
    borderRadius: 12,
    outline: 'none',
    color: '#1a1a2e',
    background: '#fff',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    minHeight: 44,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a2e',
    marginBottom: 6,
    display: 'block',
  };

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    padding: isMobile ? 16 : 24,
    marginBottom: 16,
  };

  return (
    <div style={{ padding: isMobile ? 16 : 32, background: '#F8F9FF', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
          A/B Testing
        </h1>
        <p style={{ fontSize: 15, color: '#64648b', margin: '6px 0 0' }}>
          Test 2 versions &rarr; send the winner
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#E0F7FA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: '#8b8ba7' }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Button / Form Toggle */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            borderRadius: 12,
            background: '#00B4D8',
            color: '#fff',
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 600,
            minHeight: 44,
            border: 'none',
            cursor: 'pointer',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'center',
          }}
        >
          + New A/B Test
        </button>
      )}

      {/* Create Form */}
      {showForm && (
        <div style={{ ...cardStyle, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Create A/B Test</h2>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 20,
                color: '#8b8ba7',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              &times;
            </button>
          </div>

          {/* Campaign Name */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Campaign Name</label>
            <input
              type="text"
              placeholder="e.g. Spring Sale Launch"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* Versions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 20,
              marginBottom: 18,
            }}
          >
            {/* Version A */}
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                border: '2px solid #E0F7FA',
                background: '#FAFBFF',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: '#00B4D8',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 14,
                  letterSpacing: 0.5,
                }}
              >
                VERSION A
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Subject Line</label>
                <input
                  type="text"
                  placeholder="Subject for version A"
                  value={formData.subjectA}
                  onChange={(e) => setFormData({ ...formData, subjectA: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Content Preview</label>
                <textarea
                  placeholder="Preview text for version A..."
                  value={formData.previewA}
                  onChange={(e) => setFormData({ ...formData, previewA: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' as const }}
                />
              </div>
            </div>

            {/* Version B */}
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                border: '2px solid #E0F7FA',
                background: '#FAFBFF',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: '#1a1a2e',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 14,
                  letterSpacing: 0.5,
                }}
              >
                VERSION B
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Subject Line</label>
                <input
                  type="text"
                  placeholder="Subject for version B"
                  value={formData.subjectB}
                  onChange={(e) => setFormData({ ...formData, subjectB: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Content Preview</label>
                <textarea
                  placeholder="Preview text for version B..."
                  value={formData.previewB}
                  onChange={(e) => setFormData({ ...formData, previewB: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' as const }}
                />
              </div>
            </div>
          </div>

          {/* Settings Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div>
              <label style={labelStyle}>Split Percentage</label>
              <select
                value={formData.split}
                onChange={(e) => setFormData({ ...formData, split: e.target.value })}
                style={inputStyle}
              >
                <option value="50/50">50 / 50</option>
                <option value="60/40">60 / 40</option>
                <option value="70/30">70 / 30</option>
                <option value="80/20">80 / 20</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Winner Criteria</label>
              <select
                value={formData.winnerCriteria}
                onChange={(e) => setFormData({ ...formData, winnerCriteria: e.target.value })}
                style={inputStyle}
              >
                <option value="Most Opens">Most Opens</option>
                <option value="Most Clicks">Most Clicks</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Auto-send Winner After</label>
              <select
                value={formData.autoSendAfter}
                onChange={(e) => setFormData({ ...formData, autoSendAfter: Number(e.target.value) })}
                style={inputStyle}
              >
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
            <button
              onClick={handleCreate}
              style={{
                borderRadius: 12,
                background: '#00B4D8',
                color: '#fff',
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 600,
                minHeight: 44,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Start A/B Test
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                borderRadius: 12,
                background: '#E0F7FA',
                color: '#00B4D8',
                padding: '12px 20px',
                fontSize: 14,
                fontWeight: 600,
                minHeight: 44,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tests List */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 16px' }}>Your Tests</h2>
      <div>
        {tests.map((test) => {
          const isExpanded = expandedId === test.id;
          const sc = statusColors[test.status];

          return (
            <div key={test.id} style={{ ...cardStyle, cursor: 'pointer' }}>
              {/* Test Header Row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : test.id)}
                style={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  justifyContent: 'space-between',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 10 : 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: sc.bg,
                      color: sc.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    AB
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{test.name}</div>
                    <div style={{ fontSize: 13, color: '#8b8ba7', marginTop: 2 }}>
                      {test.split} split &middot; {test.winnerCriteria} &middot; Created {test.createdAt}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      background: sc.bg,
                      color: sc.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {test.status}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: '#8b8ba7',
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      display: 'inline-block',
                    }}
                  >
                    &#9660;
                  </span>
                </div>
              </div>

              {/* Expanded Results */}
              {isExpanded && (
                <div style={{ marginTop: 20, borderTop: '1px solid #E0F7FA', paddingTop: 20 }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: 16,
                    }}
                  >
                    {/* Version A Results */}
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        border: test.winner === 'A' ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                        background: test.winner === 'A' ? '#FAFAFF' : '#fff',
                        position: 'relative',
                      }}
                    >
                      {test.winner === 'A' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: -10,
                            right: 12,
                            padding: '2px 10px',
                            borderRadius: 6,
                            background: '#00B4D8',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                          }}
                        >
                          WINNER
                        </div>
                      )}
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 6,
                          background: '#00B4D8',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          marginBottom: 12,
                          letterSpacing: 0.5,
                        }}
                      >
                        VERSION A
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>
                        {test.versionA.subject}
                      </div>
                      <div style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 16 }}>
                        {test.versionA.preview}
                      </div>
                      <div style={{ display: 'flex', gap: 20 }}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
                            {test.versionA.openRate}%
                          </div>
                          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Open Rate</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
                            {test.versionA.clickRate}%
                          </div>
                          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Click Rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Version B Results */}
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        border: test.winner === 'B' ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                        background: test.winner === 'B' ? '#FAFAFF' : '#fff',
                        position: 'relative',
                      }}
                    >
                      {test.winner === 'B' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: -10,
                            right: 12,
                            padding: '2px 10px',
                            borderRadius: 6,
                            background: '#00B4D8',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 0.5,
                          }}
                        >
                          WINNER
                        </div>
                      )}
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: 6,
                          background: '#1a1a2e',
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          marginBottom: 12,
                          letterSpacing: 0.5,
                        }}
                      >
                        VERSION B
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>
                        {test.versionB.subject}
                      </div>
                      <div style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 16 }}>
                        {test.versionB.preview}
                      </div>
                      <div style={{ display: 'flex', gap: 20 }}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
                            {test.versionB.openRate}%
                          </div>
                          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Open Rate</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
                            {test.versionB.clickRate}%
                          </div>
                          <div style={{ fontSize: 12, color: '#8b8ba7' }}>Click Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auto-send info */}
                  <div
                    style={{
                      marginTop: 14,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: '#E0F7FA',
                      fontSize: 13,
                      color: '#64648b',
                    }}
                  >
                    {test.status === 'Running'
                      ? `Auto-sending winner after ${test.autoSendAfter} hours based on ${test.winnerCriteria.toLowerCase()}.`
                      : `Winner was determined by ${test.winnerCriteria.toLowerCase()} after ${test.autoSendAfter} hours.`}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {tests.length === 0 && (
        <div
          style={{
            ...cardStyle,
            textAlign: 'center' as const,
            padding: 48,
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>AB</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 6 }}>
            No A/B tests yet
          </div>
          <div style={{ fontSize: 14, color: '#8b8ba7' }}>
            Create your first test to start optimizing your emails.
          </div>
        </div>
      )}
    </div>
  );
}
