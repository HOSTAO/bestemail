'use client';

import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import toast from 'react-hot-toast';

interface Plan {
  name: string;
  price: string;
  renewal_date: string | null;
  daily_limit: number;
  monthly_limit: number;
  contacts_limit: number;
}

interface Usage {
  emails_today: number;
  emails_month: number;
  contacts: number;
  campaigns_month: number;
}

interface HistoryEntry {
  month: string;
  emails: number;
  campaigns: number;
}

interface BillingData {
  plan: Plan;
  usage: Usage;
  history: HistoryEntry[];
}

const plans = [
  {
    name: 'Free',
    price: '$0/mo',
    features: ['500 emails/day', '10,000 emails/month', '2,000 contacts', '5 campaigns/month', 'Basic templates', 'Email support'],
  },
  {
    name: 'Pro',
    price: '$29/mo',
    features: ['5,000 emails/day', '100,000 emails/month', '25,000 contacts', 'Unlimited campaigns', 'All templates', 'Sequences & automation', 'Priority support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99/mo',
    features: ['Unlimited emails/day', 'Unlimited emails/month', 'Unlimited contacts', 'Unlimited campaigns', 'Custom templates', 'Advanced analytics', 'Dedicated account manager', 'SSO & team management'],
  },
];

export default function BillingPage() {
  const isMobile = useIsMobile();
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/billing/usage')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load billing data');
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load billing data');
      })
      .finally(() => setLoading(false));
  }, []);

  const card = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    padding: 20,
    ...extra,
  });

  const ProgressBar = ({ value, max, label }: { value: number; max: number; label: string }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const warn = pct > 80;
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{label}</span>
          <span style={{ fontSize: 13, color: warn ? '#FF6B6B' : '#64648b', fontWeight: warn ? 600 : 400 }}>
            {value.toLocaleString()} / {max.toLocaleString()} ({Math.round(pct)}%)
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: '#E0F7FA', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 4,
              background: warn
                ? 'linear-gradient(90deg, #FF6B6B, #ff9a9a)'
                : 'linear-gradient(90deg, #00B4D8, #a385ff)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: isMobile ? 16 : 32, background: '#F8F9FF', minHeight: '100vh' }}>
        <div style={{ ...card(), textAlign: 'center', padding: 60 }}>
          <p style={{ color: '#64648b', fontSize: 15 }}>Loading billing data...</p>
        </div>
      </div>
    );
  }

  const plan = data?.plan || { name: 'Free', price: '$0/mo', renewal_date: null, daily_limit: 500, monthly_limit: 10000, contacts_limit: 2000 };
  const usage = data?.usage || { emails_today: 0, emails_month: 0, contacts: 0, campaigns_month: 0 };
  const history = data?.history || [];

  return (
    <div style={{ padding: isMobile ? 16 : 32, background: '#F8F9FF', minHeight: '100vh' }}>
      {/* Header */}
      <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 }}>
        Billing & Usage
      </h1>

      {/* Current Plan */}
      <div style={card({ marginBottom: 24 })}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 4 }}>Current Plan</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
              {plan.name}
              <span style={{ fontSize: 16, fontWeight: 500, color: '#64648b', marginLeft: 8 }}>{plan.price}</span>
            </h2>
            {plan.renewal_date && (
              <p style={{ fontSize: 13, color: '#8b8ba7', marginTop: 4 }}>
                Renews on {new Date(plan.renewal_date).toLocaleDateString()}
              </p>
            )}
          </div>
          <a
            href="/pricing"
            style={{
              background: '#00B4D8',
              color: '#fff',
              borderRadius: 12,
              border: 'none',
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Upgrade
          </a>
        </div>
      </div>

      {/* Usage Meters */}
      <div style={card({ marginBottom: 24 })}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16, marginTop: 0 }}>
          Usage
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          <div>
            <ProgressBar label="Emails sent today" value={usage.emails_today} max={plan.daily_limit} />
          </div>
          <div>
            <ProgressBar label="Emails sent this month" value={usage.emails_month} max={plan.monthly_limit} />
          </div>
          <div>
            <ProgressBar label="Contacts used" value={usage.contacts} max={plan.contacts_limit} />
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div style={card({ marginBottom: 24, overflowX: 'auto' })}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16, marginTop: 0 }}>
          Usage History
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {['Month', 'Emails Sent', 'Campaigns Run'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderBottom: '1px solid #E0F7FA',
                    color: '#8b8ba7',
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '20px 12px', color: '#8b8ba7', textAlign: 'center' }}>
                  No usage history yet
                </td>
              </tr>
            ) : (
              history.map((row) => (
                <tr key={row.month}>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#1a1a2e', fontWeight: 500 }}>
                    {row.month}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#64648b' }}>
                    {row.emails.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid #E0F7FA', color: '#64648b' }}>
                    {row.campaigns}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Plan Comparison */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>
          Compare Plans
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {plans.map((p) => {
            const isCurrent = p.name === plan.name;
            return (
              <div
                key={p.name}
                style={{
                  ...card(),
                  border: p.popular
                    ? '2px solid #00B4D8'
                    : isCurrent
                    ? '2px solid #a385ff'
                    : '1px solid #E0F7FA',
                  position: 'relative',
                }}
              >
                {p.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: 16,
                      background: '#00B4D8',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: 20,
                    }}
                  >
                    Popular
                  </span>
                )}
                <h4 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px 0' }}>{p.name}</h4>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#00B4D8', margin: '0 0 16px 0' }}>{p.price}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: 13, color: '#64648b', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#00B4D8', fontWeight: 700 }}>&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '10px 20px',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#00B4D8',
                      border: '1px solid #E0F7FA',
                      borderRadius: 12,
                    }}
                  >
                    Current Plan
                  </div>
                ) : (
                  <a
                    href="/pricing"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#00B4D8',
                      color: '#fff',
                      borderRadius: 12,
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    {p.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
