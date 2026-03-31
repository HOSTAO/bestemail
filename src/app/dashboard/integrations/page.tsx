'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

const FULL_API_KEY = 'be_live_sk_7f8a9b2c3d4e5f6g7h8i9j0ka3f7';
const MASKED_API_KEY = 'be_live_••••••••••••a3f7';

const API_TABS = ['Add Subscriber', 'Send Campaign', 'Get Stats'] as const;
type ApiTab = typeof API_TABS[number];

const CODE_EXAMPLES: Record<ApiTab, string> = {
  'Add Subscriber': `curl -X POST https://bestemail.in/api/contacts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "customer@example.com", "name": "Customer Name", "tags": "New Customer"}'`,
  'Send Campaign': `curl -X POST https://bestemail.in/api/campaigns/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"campaign_id": "camp_123", "segment": "all"}'`,
  'Get Stats': `curl https://bestemail.in/api/campaigns/camp_123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
};

const INTEGRATIONS = [
  { name: 'WordPress', emoji: '📝', desc: 'Connect your WordPress site', status: 'Coming Soon' as const },
  { name: 'Shopify', emoji: '🛒', desc: 'Sync Shopify customers', status: 'Coming Soon' as const },
  { name: 'WooCommerce', emoji: '🛍️', desc: 'Auto-add WooCommerce buyers', status: 'Coming Soon' as const },
  { name: 'Zapier', emoji: '⚡', desc: 'Connect to 5000+ apps', status: 'Coming Soon' as const },
  { name: 'Make (Integromat)', emoji: '🔄', desc: 'Automate workflows', status: 'Coming Soon' as const },
  { name: 'Custom API', emoji: '🔧', desc: 'Build your own integration', status: 'Available' as const },
];

export default function IntegrationsPage() {
  const isMobile = useIsMobile();
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState<ApiTab>('Add Subscriber');
  const [webhookUrl, setWebhookUrl] = useState('');

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E0F7FA',
    boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    padding: isMobile ? 20 : 28,
    marginBottom: 24,
  };

  const buttonStyle: React.CSSProperties = {
    borderRadius: 12,
    background: '#00B4D8',
    color: '#fff',
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    minHeight: 44,
    border: 'none',
    cursor: 'pointer',
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(FULL_API_KEY);
    toast.success('API key copied!');
  };

  const handleRegenerate = () => {
    if (window.confirm('Are you sure you want to regenerate your API key? Your existing key will stop working immediately.')) {
      toast.success('API key regenerated successfully');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error('Please enter a webhook URL');
      return;
    }
    toast.success('Webhook URL saved!');
  };

  return (
    <div style={{ padding: isMobile ? 16 : 32, maxWidth: 900, margin: '0 auto', background: '#F8F9FF', minHeight: '100vh' }}>
      <h1 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
        Integrations & API 🔌
      </h1>
      <p style={{ fontSize: 15, color: '#64648b', marginBottom: 28 }}>
        Connect Bestemail with your favorite tools and services
      </p>

      {/* API Key Section */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>API Key</h2>
        <p style={{ fontSize: 14, color: '#8b8ba7', marginBottom: 16 }}>Use this key to authenticate your API requests</p>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: 10,
        }}>
          <div style={{
            flex: 1,
            background: '#F8F9FF',
            borderRadius: 8,
            border: '1px solid #E0F7FA',
            padding: '10px 14px',
            fontSize: 15,
            fontFamily: 'monospace',
            color: '#1a1a2e',
            wordBreak: 'break-all',
          }}>
            {showKey ? FULL_API_KEY : MASKED_API_KEY}
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setShowKey(!showKey)}
              style={{
                ...buttonStyle,
                background: '#E0F7FA',
                color: '#00B4D8',
                padding: '10px 16px',
              }}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
            <button onClick={handleCopyKey} style={{ ...buttonStyle, padding: '10px 16px' }}>
              Copy
            </button>
            <button
              onClick={handleRegenerate}
              style={{
                ...buttonStyle,
                background: '#fff',
                color: '#e74c3c',
                border: '1px solid #e74c3c',
                padding: '10px 16px',
              }}
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>API Documentation</h2>
        <p style={{ fontSize: 14, color: '#8b8ba7', marginBottom: 16 }}>Quick reference for common API calls</p>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '2px solid #E0F7FA',
          marginBottom: 20,
          overflowX: 'auto',
        }}>
          {API_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 18px',
                fontSize: 14,
                fontWeight: activeTab === tab ? 600 : 500,
                color: activeTab === tab ? '#00B4D8' : '#64648b',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #00B4D8' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginBottom: -2,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Code Block */}
        <div style={{ position: 'relative' }}>
          <pre style={{
            background: '#1a1a2e',
            color: '#fff',
            borderRadius: 12,
            padding: isMobile ? 16 : 20,
            fontSize: isMobile ? 13 : 14,
            fontFamily: 'monospace',
            overflowX: 'auto',
            lineHeight: 1.6,
            margin: 0,
          }}>
            {CODE_EXAMPLES[activeTab]}
          </pre>
          <button
            onClick={() => handleCopyCode(CODE_EXAMPLES[activeTab])}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              borderRadius: 8,
              background: 'rgba(0,180,216,0.8)',
              color: '#fff',
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Webhook URL */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Webhook URL</h2>
        <p style={{ fontSize: 14, color: '#64648b', marginBottom: 16 }}>
          Get notified when someone subscribes
        </p>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 10,
          marginBottom: 12,
        }}>
          <input
            type="url"
            placeholder="https://your-site.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            style={{
              flex: 1,
              borderRadius: 8,
              border: '1px solid #E0F7FA',
              padding: '10px 14px',
              fontSize: 16,
              outline: 'none',
              color: '#1a1a2e',
            }}
          />
          <button onClick={handleSaveWebhook} style={{ ...buttonStyle, flexShrink: 0 }}>
            Save Webhook
          </button>
        </div>
        <p style={{ fontSize: 13, color: '#8b8ba7', margin: 0 }}>
          We will send a POST request to this URL whenever a new subscriber is added via your forms
        </p>
      </div>

      {/* Integration Tiles */}
      <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1a1a2e', marginBottom: 16 }}>Available Integrations</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {INTEGRATIONS.map((item) => {
          const isAvailable = item.status === 'Available';
          return (
            <div key={item.name} style={{
              ...cardStyle,
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 24,
            }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{item.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>
                {item.name}
              </div>
              <div style={{ fontSize: 14, color: '#64648b', marginBottom: 14 }}>
                {item.desc}
              </div>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: isAvailable ? '#e6f9ed' : '#fef9e7',
                color: isAvailable ? '#27ae60' : '#d4a017',
              }}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
