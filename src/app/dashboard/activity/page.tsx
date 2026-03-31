'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import toast from 'react-hot-toast';

type ActivityEvent = {
  id: string;
  timestamp: string;
  event_type: 'sent' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'spam';
  email: string;
  campaign_name: string;
  details: string;
};

const EVENT_TYPES = ['all', 'sent', 'opened', 'clicked', 'bounced', 'unsubscribed', 'spam'] as const;

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  sent: { bg: '#dbeafe', text: '#2563eb' },
  opened: { bg: '#dcfce7', text: '#16a34a' },
  clicked: { bg: '#E0F7FA', text: '#00B4D8' },
  bounced: { bg: '#fee2e2', text: '#dc2626' },
  unsubscribed: { bg: '#fef3c7', text: '#d97706' },
  spam: { bg: '#fee2e2', text: '#dc2626' },
};

export default function ActivityPage() {
  const isMobile = useIsMobile();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('all');
  const [emailSearch, setEmailSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (emailSearch) params.set('email', emailSearch);
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);
      params.set('page', String(page));
      params.set('limit', '50');

      const res = await fetch(`/api/activity?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch activity');
      const data = await res.json();
      setEvents(data.events || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, emailSearch, fromDate, toDate, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, emailSearch, fromDate, toDate]);

  const exportCSV = () => {
    if (!events.length) {
      toast.error('No data to export');
      return;
    }
    const header = 'Timestamp,Event Type,Email Address,Campaign,Details';
    const rows = events.map((e) =>
      [
        new Date(e.timestamp).toLocaleString(),
        e.event_type,
        e.email,
        `"${e.campaign_name.replace(/"/g, '""')}"`,
        `"${e.details.replace(/"/g, '""')}"`,
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const Badge = ({ type }: { type: string }) => {
    const colors = BADGE_COLORS[type] || { bg: '#f3f4f6', text: '#6b7280' };
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
          background: colors.bg,
          color: colors.text,
          textTransform: 'capitalize',
        }}
      >
        {type}
      </span>
    );
  };

  return (
    <div style={{ padding: isMobile ? 16 : 32, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
            Activity Log
          </h1>
          <p style={{ color: '#64648b', fontSize: 14, margin: '4px 0 0' }}>
            Track all email events across your campaigns
          </p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            background: '#00B4D8',
            color: '#fff',
            borderRadius: 12,
            border: 'none',
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E0F7FA',
          boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
          padding: 20,
          marginBottom: 20,
        }}
      >
        {/* Event type pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}
        >
          {EVENT_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: typeFilter === t ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                background: typeFilter === t ? '#E0F7FA' : '#fff',
                color: typeFilter === t ? '#00B4D8' : '#64648b',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {t === 'all' ? 'All Events' : t}
            </button>
          ))}
        </div>

        {/* Search and date filters */}
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 12,
            alignItems: isMobile ? 'stretch' : 'center',
          }}
        >
          <input
            type="text"
            placeholder="Search by email address..."
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            style={{
              flex: 2,
              borderRadius: 8,
              border: '1px solid #E0F7FA',
              padding: '10px 14px',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box' as const,
            }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: isMobile ? undefined : 2 }}>
            <span style={{ color: '#8b8ba7', fontSize: 13, whiteSpace: 'nowrap' }}>From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                flex: 1,
                borderRadius: 8,
                border: '1px solid #E0F7FA',
                padding: '10px 14px',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
            <span style={{ color: '#8b8ba7', fontSize: 13, whiteSpace: 'nowrap' }}>To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                flex: 1,
                borderRadius: 8,
                border: '1px solid #E0F7FA',
                padding: '10px 14px',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #E0F7FA',
            boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
            padding: 60,
            textAlign: 'center',
            color: '#8b8ba7',
            fontSize: 15,
          }}
        >
          Loading activity events...
        </div>
      )}

      {/* Empty state */}
      {!loading && events.length === 0 && (
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #E0F7FA',
            boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
            padding: 60,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>&#128220;</div>
          <h3 style={{ color: '#1a1a2e', fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>
            No activity found
          </h3>
          <p style={{ color: '#8b8ba7', fontSize: 14, margin: 0 }}>
            {typeFilter !== 'all' || emailSearch || fromDate || toDate
              ? 'Try adjusting your filters to see more results.'
              : 'Activity events will appear here once you start sending campaigns.'}
          </p>
        </div>
      )}

      {/* Table / Cards */}
      {!loading && events.length > 0 && (
        <>
          {isMobile ? (
            /* Mobile: Card layout */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid #E0F7FA',
                    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
                    padding: 16,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Badge type={event.event_type} />
                    <span style={{ color: '#8b8ba7', fontSize: 12 }}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>
                    {event.email}
                  </div>
                  <div style={{ fontSize: 13, color: '#64648b', marginBottom: 4 }}>
                    {event.campaign_name}
                  </div>
                  <div style={{ fontSize: 12, color: '#8b8ba7' }}>
                    {event.details}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop: Table layout */
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid #E0F7FA',
                boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E0F7FA' }}>
                    {['Timestamp', 'Event Type', 'Email Address', 'Campaign', 'Details'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '14px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#8b8ba7',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      style={{ borderBottom: '1px solid #f0f0f8' }}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64648b', whiteSpace: 'nowrap' }}>
                        {formatTimestamp(event.timestamp)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge type={event.event_type} />
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#1a1a2e', fontWeight: 500 }}>
                        {event.email}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64648b' }}>
                        {event.campaign_name}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#8b8ba7', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {event.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
              padding: '0 4px',
            }}
          >
            <span style={{ color: '#8b8ba7', fontSize: 13 }}>
              Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} of {total} events
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #E0F7FA',
                  background: page <= 1 ? '#f8f9ff' : '#fff',
                  color: page <= 1 ? '#c0c0d0' : '#1a1a2e',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Previous
              </button>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  fontSize: 13,
                  color: '#64648b',
                  fontWeight: 600,
                }}
              >
                {page} / {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid #E0F7FA',
                  background: page >= pages ? '#f8f9ff' : '#fff',
                  color: page >= pages ? '#c0c0d0' : '#1a1a2e',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: page >= pages ? 'not-allowed' : 'pointer',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
