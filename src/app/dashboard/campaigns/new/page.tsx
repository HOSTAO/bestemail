'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/hooks/useIsMobile';

// --- Block Types ---
type BlockType = 'header' | 'greeting' | 'text' | 'offer' | 'image' | 'button' | 'products' | 'divider' | 'footer';

interface EmailBlock {
  id: string;
  type: BlockType;
  content: Record<string, string>;
}

type SegmentOption = { id: string; name: string };

const BLOCK_DEFS: { type: BlockType; label: string; icon: string }[] = [
  { type: 'header', label: 'Header', icon: '🏢' },
  { type: 'greeting', label: 'Greeting', icon: '👋' },
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'offer', label: 'Offer', icon: '🎉' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'button', label: 'Button', icon: '🔘' },
  { type: 'products', label: 'Products', icon: '🛍️' },
  { type: 'divider', label: 'Divider', icon: '➖' },
  { type: 'footer', label: 'Footer', icon: '📋' },
];

const OFFER_COLORS = [
  { name: 'Purple', value: '#00B4D8' },
  { name: 'Orange', value: '#FF6B35' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Teal', value: '#14B8A6' },
];

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function defaultContent(type: BlockType): Record<string, string> {
  switch (type) {
    case 'header': return { businessName: 'Your Business Name', tagline: 'Your tagline here' };
    case 'greeting': return { text: 'Dear Customer,' };
    case 'text': return { text: 'Write your message here. Click to edit this text.' };
    case 'offer': return { text: '🎉 Special Offer - 20% OFF!', detail: 'Use code SAVE20 at checkout', color: '#00B4D8' };
    case 'image': return { url: '', caption: 'Image caption', alt: 'Email image' };
    case 'button': return { text: 'Shop Now', link: 'https://yourwebsite.com' };
    case 'products': return { p1Name: 'Product 1', p1Price: '₹999', p2Name: 'Product 2', p2Price: '₹1,499', p3Name: '', p3Price: '' };
    case 'divider': return {};
    case 'footer': return { address: '123 Business Street, City, India', unsubscribe: 'Unsubscribe', social: 'Follow us on social media' };
  }
}

// --- Templates ---
const festivalTemplates = [
  { id: 'diwali', name: 'Diwali Offer', icon: '🪔', desc: 'Festival of lights special offer' },
  { id: 'eid', name: 'Eid Mubarak', icon: '🌙', desc: 'Eid celebration offer' },
  { id: 'christmas', name: 'Christmas Sale', icon: '🎄', desc: 'Christmas special deals' },
  { id: 'onam', name: 'Onam Special', icon: '🌸', desc: 'Onam festival offer' },
  { id: 'pongal', name: 'Pongal Offer', icon: '🌾', desc: 'Pongal harvest festival deal' },
  { id: 'new-product', name: 'New Product', icon: '🆕', desc: 'Announce a new product' },
  { id: 'sale', name: 'Sale / Discount', icon: '🏷️', desc: 'Run a sale or discount offer' },
  { id: 'thank-you', name: 'Thank You', icon: '🙏', desc: 'Thank your loyal customers' },
  { id: 'news', name: 'Shop Update', icon: '📰', desc: 'Share news about your shop' },
  { id: 'event', name: 'Event Invitation', icon: '🎉', desc: 'Invite to a special event' },
];

function getTemplateBlocks(templateId: string | null): EmailBlock[] {
  const b = (type: BlockType, content?: Record<string, string>): EmailBlock => ({
    id: uid(), type, content: { ...defaultContent(type), ...content },
  });

  switch (templateId) {
    case 'diwali':
      return [
        b('header', { businessName: 'Your Business Name', tagline: 'Celebrating Diwali with you!' }),
        b('greeting', { text: 'Dear Customer,' }),
        b('offer', { text: '🪔 Special Diwali Offer - 20% OFF Everything!', detail: 'Use code DIWALI20 at checkout', color: '#FF6B35' }),
        b('text', { text: 'We are celebrating this festive season with our most valued customers. This Diwali, enjoy exclusive discounts on all our products and services.' }),
        b('button', { text: 'Shop Now', link: 'https://yourwebsite.com' }),
        b('footer'),
      ];
    case 'eid':
      return [
        b('header', { businessName: 'Your Business Name', tagline: 'Eid Mubarak!' }),
        b('greeting', { text: 'Dear Customer,' }),
        b('offer', { text: '🌙 Eid Mubarak - Special Celebration Offer!', detail: 'Up to 25% OFF on selected items', color: '#10B981' }),
        b('text', { text: 'Wishing you and your family a blessed Eid. Celebrate with our special offers curated just for you.' }),
        b('button', { text: 'Explore Offers', link: 'https://yourwebsite.com' }),
        b('footer'),
      ];
    case 'new-product':
      return [
        b('header'),
        b('greeting'),
        b('text', { text: 'We are excited to introduce our newest product! Take a look at what we have been working on.' }),
        b('products', { p1Name: 'New Product', p1Price: '₹1,299', p2Name: 'Also New', p2Price: '₹899', p3Name: '', p3Price: '' }),
        b('button', { text: 'See More', link: 'https://yourwebsite.com' }),
        b('footer'),
      ];
    case 'news':
    case 'event':
      return [
        b('header'),
        b('greeting'),
        b('text', { text: 'Monthly updates from us — here is what has been happening and what is coming next.' }),
        b('divider'),
        b('text', { text: 'More details about our latest news and upcoming plans. We have exciting things in store for you!' }),
        b('button', { text: 'Read More', link: 'https://yourwebsite.com' }),
        b('footer'),
      ];
    default:
      // Festival offer generic / sale / thank-you / etc
      if (templateId) {
        const t = festivalTemplates.find(x => x.id === templateId);
        return [
          b('header', { businessName: 'Your Business Name', tagline: t?.desc || '' }),
          b('greeting'),
          b('offer', { text: `${t?.icon || '🎉'} ${t?.name || 'Special Offer'} - Don't Miss Out!`, detail: 'Limited time offer for our valued customers', color: '#00B4D8' }),
          b('text', { text: 'Thank you for being a valued customer. We have a special offer just for you!' }),
          b('button', { text: 'Shop Now', link: 'https://yourwebsite.com' }),
          b('footer'),
        ];
      }
      return [];
  }
}

// --- HTML Generator ---
function generateEmailHTML(blocks: EmailBlock[]): string {
  const blockHtml = blocks.map(block => {
    switch (block.type) {
      case 'header':
        return `<tr><td style="background:#1a1a2e;padding:32px 24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">${esc(block.content.businessName)}</h1>
          ${block.content.tagline ? `<p style="color:#a5a5c0;margin:8px 0 0;font-size:14px;">${esc(block.content.tagline)}</p>` : ''}
        </td></tr>`;
      case 'greeting':
        return `<tr><td style="padding:24px 24px 8px;">
          <p style="color:#333;font-size:16px;margin:0;line-height:1.6;">${esc(block.content.text)}</p>
        </td></tr>`;
      case 'text':
        return `<tr><td style="padding:8px 24px;">
          <p style="color:#333;font-size:16px;margin:0;line-height:1.6;">${esc(block.content.text)}</p>
        </td></tr>`;
      case 'offer': {
        const bg = block.content.color || '#00B4D8';
        return `<tr><td style="padding:12px 24px;">
          <div style="background:${bg};border-radius:12px;padding:28px 20px;text-align:center;">
            <p style="color:#fff;font-size:22px;font-weight:700;margin:0;">${esc(block.content.text)}</p>
            ${block.content.detail ? `<p style="color:rgba(255,255,255,0.85);font-size:14px;margin:10px 0 0;">${esc(block.content.detail)}</p>` : ''}
          </div>
        </td></tr>`;
      }
      case 'image':
        return block.content.url ? `<tr><td style="padding:12px 24px;text-align:center;">
          <img src="${esc(block.content.url)}" alt="${esc(block.content.alt)}" style="max-width:100%;border-radius:8px;" />
          ${block.content.caption ? `<p style="color:#8b8ba7;font-size:13px;margin:8px 0 0;">${esc(block.content.caption)}</p>` : ''}
        </td></tr>` : `<tr><td style="padding:12px 24px;text-align:center;">
          <div style="background:#f0f0f8;border-radius:8px;padding:40px;color:#8b8ba7;font-size:14px;">Image placeholder — add URL to display</div>
        </td></tr>`;
      case 'button':
        return `<tr><td style="padding:16px 24px;text-align:center;">
          <a href="${esc(block.content.link)}" style="display:inline-block;background:#00B4D8;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">${esc(block.content.text)}</a>
        </td></tr>`;
      case 'products': {
        const prods = [
          { name: block.content.p1Name, price: block.content.p1Price },
          { name: block.content.p2Name, price: block.content.p2Price },
          { name: block.content.p3Name, price: block.content.p3Price },
        ].filter(p => p.name);
        return `<tr><td style="padding:12px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            ${prods.map(p => `<td style="padding:8px;text-align:center;vertical-align:top;width:${Math.floor(100 / prods.length)}%;">
              <div style="background:#f8f9ff;border-radius:10px;padding:20px 12px;">
                <p style="font-weight:600;color:#1a1a2e;margin:0 0 6px;font-size:15px;">${esc(p.name)}</p>
                <p style="color:#00B4D8;font-weight:700;font-size:18px;margin:0;">${esc(p.price)}</p>
              </div>
            </td>`).join('')}
          </tr></table>
        </td></tr>`;
      }
      case 'divider':
        return `<tr><td style="padding:16px 24px;">
          <hr style="border:none;border-top:1px solid #E0F7FA;margin:0;" />
        </td></tr>`;
      case 'footer':
        return `<tr><td style="background:#f8f9ff;padding:24px;text-align:center;">
          <p style="color:#8b8ba7;font-size:12px;margin:0;line-height:1.6;">${esc(block.content.address)}</p>
          <p style="color:#8b8ba7;font-size:12px;margin:8px 0 0;">
            ${esc(block.content.social)}<br/>
            <a href="#" style="color:#00B4D8;text-decoration:underline;font-size:12px;">${esc(block.content.unsubscribe)}</a>
          </p>
        </td></tr>`;
      default:
        return '';
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Email</title></head>
<body style="margin:0;padding:0;background:#f0f0f8;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f8;">
<tr><td align="center" style="padding:20px 0;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border-radius:8px;max-width:600px;width:100%;">
${blockHtml}
</table>
</td></tr></table>
</body></html>`;
}

function esc(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- Block Renderers for Canvas ---
function BlockRenderer({ block, isSelected, onSelect, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  block: EmailBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (content: Record<string, string>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const c = block.content;
  const update = (key: string, val: string) => onUpdate({ ...c, [key]: val });

  const controlBar = (
    <div style={{
      position: 'absolute', top: -14, right: 4, display: 'flex', gap: 3, zIndex: 10,
    }}>
      {!isFirst && (
        <button onClick={(e) => { e.stopPropagation(); onMoveUp(); }} style={controlBtnStyle} title="Move up">↑</button>
      )}
      {!isLast && (
        <button onClick={(e) => { e.stopPropagation(); onMoveDown(); }} style={controlBtnStyle} title="Move down">↓</button>
      )}
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ ...controlBtnStyle, background: '#EF4444', color: '#fff' }} title="Delete">×</button>
    </div>
  );

  const wrapStyle: React.CSSProperties = {
    position: 'relative',
    cursor: 'pointer',
    outline: isSelected ? '2px solid #00B4D8' : '1px solid transparent',
    borderRadius: 6,
    transition: 'outline 0.15s',
    marginBottom: 2,
  };

  // Inline editor for selected blocks
  const renderEditor = () => {
    if (!isSelected) return null;
    switch (block.type) {
      case 'header':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          <label style={edLabelStyle}>Business Name</label>
          <input style={edInputStyle} value={c.businessName} onChange={e => update('businessName', e.target.value)} />
          <label style={edLabelStyle}>Tagline</label>
          <input style={edInputStyle} value={c.tagline} onChange={e => update('tagline', e.target.value)} />
        </div>);
      case 'greeting':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          <label style={edLabelStyle}>Greeting Text</label>
          <input style={edInputStyle} value={c.text} onChange={e => update('text', e.target.value)} />
        </div>);
      case 'text':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          <label style={edLabelStyle}>Text Content</label>
          <textarea style={{ ...edInputStyle, minHeight: 80, resize: 'vertical' }} value={c.text} onChange={e => update('text', e.target.value)} />
        </div>);
      case 'offer':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          <label style={edLabelStyle}>Offer Headline</label>
          <input style={edInputStyle} value={c.text} onChange={e => update('text', e.target.value)} />
          <label style={edLabelStyle}>Detail Text</label>
          <input style={edInputStyle} value={c.detail} onChange={e => update('detail', e.target.value)} />
          <label style={edLabelStyle}>Background Color</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {OFFER_COLORS.map(col => (
              <button key={col.value} onClick={() => update('color', col.value)} style={{
                width: 32, height: 32, borderRadius: 8, border: c.color === col.value ? '3px solid #1a1a2e' : '2px solid #e8ebff',
                background: col.value, cursor: 'pointer',
              }} title={col.name} />
            ))}
          </div>
        </div>);
      case 'image':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          <label style={edLabelStyle}>Image URL</label>
          <input style={edInputStyle} value={c.url} onChange={e => update('url', e.target.value)} placeholder="https://example.com/image.jpg" />
          <label style={edLabelStyle}>Caption</label>
          <input style={edInputStyle} value={c.caption} onChange={e => update('caption', e.target.value)} />
        </div>);
      case 'button':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          <label style={edLabelStyle}>Button Text</label>
          <input style={edInputStyle} value={c.text} onChange={e => update('text', e.target.value)} />
          <label style={edLabelStyle}>Link URL</label>
          <input style={edInputStyle} value={c.link} onChange={e => update('link', e.target.value)} placeholder="https://yourwebsite.com" />
        </div>);
      case 'products':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
              <div>
                <label style={edLabelStyle}>Product {i} Name</label>
                <input style={edInputStyle} value={c[`p${i}Name`]} onChange={e => update(`p${i}Name`, e.target.value)} placeholder={i <= 2 ? `Product ${i}` : '(optional)'} />
              </div>
              <div>
                <label style={edLabelStyle}>Price</label>
                <input style={edInputStyle} value={c[`p${i}Price`]} onChange={e => update(`p${i}Price`, e.target.value)} placeholder="₹999" />
              </div>
            </div>
          ))}
        </div>);
      case 'footer':
        return (<div style={editorPanelStyle} onClick={e => e.stopPropagation()}>
          <label style={edLabelStyle}>Address</label>
          <input style={edInputStyle} value={c.address} onChange={e => update('address', e.target.value)} />
          <label style={edLabelStyle}>Social Text</label>
          <input style={edInputStyle} value={c.social} onChange={e => update('social', e.target.value)} />
        </div>);
      default:
        return null;
    }
  };

  // Preview renderers
  switch (block.type) {
    case 'header':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ background: '#1a1a2e', padding: '24px 20px', textAlign: 'center', borderRadius: 6 }}>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{c.businessName}</div>
          {c.tagline && <div style={{ color: '#a5a5c0', fontSize: 13, marginTop: 4 }}>{c.tagline}</div>}
        </div>
        {renderEditor()}
      </div>);
    case 'greeting':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ padding: '16px 20px 4px' }}>
          <p style={{ color: '#333', fontSize: 15, margin: 0 }}>{c.text}</p>
        </div>
        {renderEditor()}
      </div>);
    case 'text':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ padding: '6px 20px' }}>
          <p style={{ color: '#333', fontSize: 15, margin: 0, lineHeight: 1.6 }}>{c.text}</p>
        </div>
        {renderEditor()}
      </div>);
    case 'offer':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ padding: '8px 20px' }}>
          <div style={{ background: c.color || '#00B4D8', borderRadius: 10, padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ color: '#fff', fontSize: 19, fontWeight: 700 }}>{c.text}</div>
            {c.detail && <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 6 }}>{c.detail}</div>}
          </div>
        </div>
        {renderEditor()}
      </div>);
    case 'image':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ padding: '8px 20px', textAlign: 'center' }}>
          {c.url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.url} alt={c.alt} style={{ maxWidth: '100%', borderRadius: 8 }} />
              {c.caption && <p style={{ color: '#8b8ba7', fontSize: 12, margin: '6px 0 0' }}>{c.caption}</p>}
            </>
          ) : (
            <div style={{ background: '#f0f0f8', borderRadius: 8, padding: '32px 16px', color: '#8b8ba7', fontSize: 13 }}>
              🖼️ Click to add image URL
            </div>
          )}
        </div>
        {renderEditor()}
      </div>);
    case 'button':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ padding: '12px 20px', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: '#00B4D8', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15 }}>
            {c.text}
          </span>
        </div>
        {renderEditor()}
      </div>);
    case 'products': {
      const prods = [
        { name: c.p1Name, price: c.p1Price },
        { name: c.p2Name, price: c.p2Price },
        { name: c.p3Name, price: c.p3Price },
      ].filter(p => p.name);
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ padding: '8px 20px', display: 'flex', gap: 8 }}>
          {prods.map((p, i) => (
            <div key={i} style={{ flex: 1, background: '#f8f9ff', borderRadius: 8, padding: '16px 10px', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{p.name}</div>
              <div style={{ color: '#00B4D8', fontWeight: 700, fontSize: 16, marginTop: 4 }}>{p.price}</div>
            </div>
          ))}
        </div>
        {renderEditor()}
      </div>);
    }
    case 'divider':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ padding: '12px 20px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #E0F7FA', margin: 0 }} />
        </div>
      </div>);
    case 'footer':
      return (<div style={wrapStyle} onClick={onSelect}>
        {isSelected && controlBar}
        <div style={{ background: '#f8f9ff', padding: '18px 20px', textAlign: 'center', borderRadius: 6 }}>
          <div style={{ color: '#8b8ba7', fontSize: 11 }}>{c.address}</div>
          <div style={{ color: '#8b8ba7', fontSize: 11, marginTop: 4 }}>{c.social}</div>
          <div style={{ marginTop: 4 }}>
            <span style={{ color: '#00B4D8', fontSize: 11, textDecoration: 'underline' }}>{c.unsubscribe}</span>
          </div>
        </div>
        {renderEditor()}
      </div>);
    default:
      return null;
  }
}

// Style constants for block editors
const controlBtnStyle: React.CSSProperties = {
  width: 26, height: 26, borderRadius: 6, border: '1px solid #E0F7FA', background: '#fff',
  cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, color: '#1a1a2e', lineHeight: 1,
};

const editorPanelStyle: React.CSSProperties = {
  background: '#fafaff', borderTop: '1px solid #E0F7FA', padding: '12px 16px',
  display: 'grid', gap: 8, borderRadius: '0 0 6px 6px',
};

const edLabelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: '#8b8ba7', marginBottom: -4,
};

const edInputStyle: React.CSSProperties = {
  width: '100%', borderRadius: 6, border: '1px solid #E0F7FA', padding: '8px 10px',
  fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
};

// --- Main Component ---
export default function NewCampaignPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const isEditing = !!campaignId;
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'template' | 'design' | 'settings' | 'review'>('template');
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [sendNow, setSendNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'segment'>('all');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [segments, setSegments] = useState<SegmentOption[]>([]);
  const [contactsCount, setContactsCount] = useState(0);
  const [htmlContent, setHtmlContent] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editorMode, setEditorMode] = useState<'blocks' | 'html'>('blocks');
  const [customHtml, setCustomHtml] = useState('');
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [timezoneDelivery, setTimezoneDelivery] = useState(false);
  const htmlPreviewRef = useRef<HTMLIFrameElement>(null);

  // Block-based editor state
  const [blocks, setBlocks] = useState<EmailBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showMergeTagsFor, setShowMergeTagsFor] = useState<'subject' | 'block' | null>(null);

  const MERGE_TAGS = [
    { tag: '{{first_name}}', label: 'First name', desc: 'Customer first name' },
    { tag: '{{last_name}}', label: 'Last name', desc: 'Customer last name' },
    { tag: '{{email}}', label: 'Email', desc: 'Customer email address' },
    { tag: '{{company}}', label: 'Company', desc: 'Company name' },
  ];

  const insertMergeTag = (tag: string, target: 'subject' | 'block') => {
    if (target === 'subject') {
      setSubject(prev => prev + ' ' + tag);
    } else if (selectedBlockId) {
      setBlocks(prev => prev.map(b => {
        if (b.id !== selectedBlockId) return b;
        const textKey = b.type === 'greeting' || b.type === 'text' ? 'text' :
                        b.type === 'offer' ? 'text' :
                        b.type === 'button' ? 'text' : null;
        if (textKey && b.content[textKey] !== undefined) {
          return { ...b, content: { ...b.content, [textKey]: b.content[textKey] + ' ' + tag } };
        }
        return b;
      }));
    }
    setShowMergeTagsFor(null);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const templateParam = params.get('template');
    if (id) {
      setCampaignId(id);
      setStep('design');
    }
    if (templateParam) {
      // Load template from gallery — try to import template data dynamically
      selectTemplate(templateParam);
    }
    const templateId = params.get('template_id');
    if (templateId) {
      // Load template from API (new gallery templates)
      fetch(`/api/templates?search=`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          const templates = data?.templates || [];
          const found = templates.find((t: any) => t.id === templateId);
          if (found) {
            setCampaignName(found.name);
            setSubject(found.subject);
            setPreheader(found.preview_text || '');
            setCustomHtml(found.html_body);
            setEditorMode('html');
            setStep('design');
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contRes, segRes] = await Promise.all([
          fetch('/api/contacts', { cache: 'no-store' }),
          fetch('/api/segments', { cache: 'no-store' }),
        ]);
        if (contRes.ok) {
          const d = await contRes.json();
          setContactsCount((d.contacts || d || []).length);
        }
        if (segRes.ok) {
          const d = await segRes.json();
          const segs = (Array.isArray(d) ? d : d.segments || []).map((s: any) => ({ id: s.id, name: s.name || 'Untitled' }));
          setSegments(segs);
          setSelectedSegment(segs[0]?.id || '');
        }
        if (campaignId) {
          const campRes = await fetch(`/api/campaigns/${campaignId}`, { cache: 'no-store' });
          if (campRes.ok) {
            const c = await campRes.json();
            setCampaignName(c.name || '');
            setSubject(c.subject || '');
            setPreheader(c.preheader || '');
            setHtmlContent(c.html_content || c.content || '');
            if (c.editor_design) {
              try {
                const parsed = typeof c.editor_design === 'string' ? JSON.parse(c.editor_design) : c.editor_design;
                if (Array.isArray(parsed)) setBlocks(parsed);
              } catch { /* ignore parse errors */ }
            }
          }
        }
      } catch (e) {
        console.error('Failed to load:', e);
      }
    };
    loadData();
  }, [campaignId]);

  const getHtml = useCallback(() => generateEmailHTML(blocks), [blocks]);

  const addBlock = (type: BlockType) => {
    const newBlock: EmailBlock = { id: uid(), type, content: defaultContent(type) };
    setBlocks(prev => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, content: Record<string, string>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  const selectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const t = festivalTemplates.find(t => t.id === templateId);
    if (t) {
      setCampaignName(t.name);
      setSubject(t.name + ' - Special offer for you!');
    }
    setBlocks(getTemplateBlocks(templateId));
    setStep('design');
  };

  const goToSettings = () => {
    if (editorMode === 'html') {
      setHtmlContent(customHtml);
    } else {
      setHtmlContent(getHtml());
    }
    setStep('settings');
  };

  const goToReview = () => {
    if (!campaignName || !subject) {
      toast.error('Please fill in the email name and subject');
      return;
    }
    setStep('review');
  };

  const saveDraft = async () => {
    if (!campaignName || !subject) {
      toast.error('Please fill in the email name and subject');
      return;
    }
    setLoading(true);
    try {
      const html = step === 'design' ? (editorMode === 'html' ? customHtml : getHtml()) : htmlContent;
      const endpoint = campaignId ? `/api/campaigns/${campaignId}` : '/api/campaigns';
      const method = campaignId ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName, subject, preheader,
          content: html, html_content: html,
          editor_design: JSON.stringify(blocks),
          status: 'draft',
          recipient_type: recipientType,
          segment_id: recipientType === 'segment' ? selectedSegment : null,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Draft saved!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmailFn = async () => {
    if (!testEmail || !subject) {
      toast.error('Enter an email address and subject');
      return;
    }
    setLoading(true);
    try {
      const html = getHtml();
      const res = await fetch('/api/campaigns/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail, subject, html_content: html, preheader }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(`Test sent to ${testEmail}`);
      setShowTestEmail(false);
      setTestEmail('');
    } catch {
      toast.error('Could not send test email');
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    if (!campaignName || !subject) {
      toast.error('Please fill in all required fields');
      return;
    }
    const scheduledAt = sendNow ? null : (scheduledDate && scheduledTime ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString() : null);
    if (!sendNow && !scheduledAt) {
      toast.error('Please select a date and time');
      return;
    }
    if (!confirm(sendNow ? 'Send this email to your customers now?' : `Schedule this email for ${new Date(scheduledAt!).toLocaleString()}?`)) return;

    setLoading(true);
    try {
      const html = editorMode === 'html' ? customHtml : getHtml();
      const endpoint = campaignId ? `/api/campaigns/${campaignId}` : '/api/campaigns';
      const method = campaignId ? 'PUT' : 'POST';
      const createRes = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName, subject, preheader,
          content: html, html_content: html,
          editor_design: JSON.stringify(blocks),
          status: sendNow ? 'queued' : 'scheduled',
          recipient_type: recipientType,
          segment_id: recipientType === 'segment' ? selectedSegment : null,
          scheduled_at: scheduledAt,
          scheduled_timezone_delivery: timezoneDelivery,
        }),
      });
      const campaign = await createRes.json();
      if (!createRes.ok) throw new Error(campaign.error || 'Failed');

      if (sendNow) {
        const sendRes = await fetch('/api/campaigns/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaignId: campaign.id }),
        });
        const result = await sendRes.json();
        if (!sendRes.ok || !result.ok) throw new Error(result.error || 'Send failed');
        toast.success('Email sent to your customers!');
      } else {
        toast.success('Email scheduled!');
      }
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
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

  const btnPrimary = {
    borderRadius: 12,
    background: '#00B4D8',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44,
  };

  const btnSecondary = {
    borderRadius: 12,
    background: '#fff',
    color: '#1a1a2e',
    border: '1px solid #E0F7FA',
    padding: '12px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: 44,
  };

  const steps = [
    { key: 'template', label: 'Pick a Design' },
    { key: 'design', label: 'Write Your Email' },
    { key: 'settings', label: 'Choose Who Gets It' },
    { key: 'review', label: 'Send!' },
  ];

  return (
    <div style={{ padding: isMobile ? '16px 16px 40px' : '24px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
          {isEditing ? 'Edit Your Email' : 'Write a New Email'} ✉️
        </h1>
        <p style={{ color: '#8b8ba7', marginTop: 4, fontSize: 14 }}>
          Follow the steps to create and send your email
        </p>
      </div>

      {/* Step Indicator */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 24,
        overflowX: 'auto',
        paddingBottom: 8,
      }}>
        {steps.map((s, i) => {
          const isActive = s.key === step;
          const isPast = steps.findIndex(x => x.key === step) > i;
          return (
            <button key={s.key} onClick={() => {
              if (isPast) setStep(s.key as typeof step);
            }} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: isMobile ? '8px 12px' : '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: isActive ? '#00B4D8' : isPast ? '#E0F7FA' : '#F8F9FF',
              color: isActive ? '#fff' : isPast ? '#00B4D8' : '#8b8ba7',
              fontWeight: isActive ? 600 : 500,
              fontSize: 13,
              cursor: isPast ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
              flex: '0 0 auto',
              minHeight: 44,
            }}>
              <span style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: isActive ? 'rgba(255,255,255,0.2)' : isPast ? '#00B4D8' : '#E0F7FA',
                color: isActive ? '#fff' : isPast ? '#fff' : '#8b8ba7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
              }}>
                {isPast ? '✓' : i + 1}
              </span>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Step 1: Template Selection */}
      {step === 'template' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Choose a Design</h2>
            <p style={{ color: '#8b8ba7', fontSize: 14, margin: '0 0 12px' }}>Pick a template that fits your business, or start from scratch</p>
            <a href="/dashboard/templates" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10,
              background: '#E0F7FA', color: '#00B4D8',
              fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 16,
            }}>🎨 Browse Full Template Gallery →</a>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 12,
            }}>
              {festivalTemplates.map((t) => (
                <button key={t.id} onClick={() => selectTemplate(t.id)} style={{
                  background: selectedTemplate === t.id ? '#E0F7FA' : '#F8F9FF',
                  border: selectedTemplate === t.id ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                  borderRadius: 14,
                  padding: 16,
                  cursor: 'pointer',
                  textAlign: 'center',
                  minHeight: 44,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{t.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#8b8ba7', marginTop: 4 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row' }}>
            <button onClick={() => { setSelectedTemplate(null); setBlocks([]); setStep('design'); }} style={{ ...btnSecondary, width: isMobile ? '100%' : undefined }}>
              Start from Scratch
            </button>
            <button onClick={() => setStep('design')} style={{ ...btnPrimary, width: isMobile ? '100%' : undefined }}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Custom Block-based Email Builder */}
      {step === 'design' && (
        <div>
          {/* Subject / Name inputs */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ display: 'grid', gap: 12, marginBottom: 0 }}>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Give your email a name (e.g., Diwali Sale)"
                style={inputStyle}
              />
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line - what your customer sees first"
                  style={{ ...inputStyle, paddingRight: 100 }}
                />
                <button
                  onClick={() => setShowMergeTagsFor(showMergeTagsFor === 'subject' ? null : 'subject')}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    borderRadius: 6, border: '1px solid #E0F7FA', background: '#E0F7FA',
                    color: '#00B4D8', padding: '4px 10px', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Personalise
                </button>
                {showMergeTagsFor === 'subject' && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 20,
                    background: '#fff', borderRadius: 12, border: '1px solid #E0F7FA',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)', padding: 8, minWidth: 220,
                  }}>
                    {MERGE_TAGS.map(mt => (
                      <button key={mt.tag} onClick={() => insertMergeTag(mt.tag, 'subject')} style={{
                        display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                        borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer',
                        fontSize: 13, color: '#1a1a2e',
                      }}>
                        <span style={{ fontWeight: 600 }}>{mt.tag}</span>
                        <span style={{ color: '#8b8ba7', marginLeft: 8, fontSize: 12 }}>{mt.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                value={preheader}
                onChange={(e) => setPreheader(e.target.value)}
                placeholder="Preview text (optional)"
                maxLength={100}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Editor Mode Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
            <button
              onClick={() => setEditorMode('blocks')}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px 0 0 12px',
                border: '1px solid #E0F7FA',
                borderRight: 'none',
                background: editorMode === 'blocks' ? '#00B4D8' : '#fff',
                color: editorMode === 'blocks' ? '#fff' : '#64648b',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              Block Builder
            </button>
            <button
              onClick={() => setEditorMode('html')}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '0 12px 12px 0',
                border: '1px solid #E0F7FA',
                background: editorMode === 'html' ? '#00B4D8' : '#fff',
                color: editorMode === 'html' ? '#fff' : '#64648b',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              Custom HTML
            </button>
          </div>

          {/* Custom HTML Editor */}
          {editorMode === 'html' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                border: '1px solid #E0F7FA',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid #E0F7FA',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#8b8ba7' }}>Write your HTML email code</span>
                  <button
                    onClick={() => {
                      setShowHtmlPreview(!showHtmlPreview);
                      if (!showHtmlPreview && htmlPreviewRef.current) {
                        setTimeout(() => {
                          if (htmlPreviewRef.current) {
                            const doc = htmlPreviewRef.current.contentDocument;
                            if (doc) {
                              doc.open();
                              doc.write(customHtml);
                              doc.close();
                            }
                          }
                        }, 100);
                      }
                    }}
                    style={{
                      borderRadius: 8,
                      border: '1px solid #E0F7FA',
                      background: showHtmlPreview ? '#E0F7FA' : '#fff',
                      color: showHtmlPreview ? '#00B4D8' : '#64648b',
                      padding: '6px 14px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {showHtmlPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>

                {!showHtmlPreview ? (
                  <textarea
                    value={customHtml}
                    onChange={(e) => setCustomHtml(e.target.value)}
                    placeholder="<!DOCTYPE html>\n<html>\n<head>\n  <title>Your Email</title>\n</head>\n<body>\n  <h1>Hello!</h1>\n  <p>Write your email HTML here...</p>\n</body>\n</html>"
                    style={{
                      width: '100%',
                      minHeight: 500,
                      padding: 16,
                      border: 'none',
                      outline: 'none',
                      fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: '#1a1a2e',
                      background: '#FAFAFF',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                  />
                ) : (
                  <iframe
                    ref={htmlPreviewRef}
                    srcDoc={customHtml}
                    style={{
                      width: '100%',
                      minHeight: 500,
                      border: 'none',
                      background: '#fff',
                    }}
                    title="HTML Preview"
                    sandbox="allow-same-origin"
                  />
                )}
              </div>
              <p style={{ fontSize: 12, color: '#8b8ba7', marginTop: 8 }}>
                Paste your complete HTML email code above. Use the Preview button to see how it looks.
              </p>
            </div>
          )}

          {/* Block Builder */}
          {editorMode === 'blocks' && (
            <>
          {/* Block Picker */}
          <div style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8b8ba7', whiteSpace: 'nowrap', alignSelf: 'center', marginRight: 4 }}>
              ADD:
            </span>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => setShowMergeTagsFor(showMergeTagsFor === 'block' ? null : 'block')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '8px 14px',
                  borderRadius: 10, border: '1px solid #00B4D8', background: '#E0F7FA',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#00B4D8',
                  whiteSpace: 'nowrap', minHeight: 40, flex: '0 0 auto',
                }}
              >
                Personalise
              </button>
              {showMergeTagsFor === 'block' && (
                <div style={{
                  position: 'absolute', left: 0, top: '100%', marginTop: 4, zIndex: 20,
                  background: '#fff', borderRadius: 12, border: '1px solid #E0F7FA',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', padding: 8, minWidth: 240,
                }}>
                  <div style={{ padding: '6px 12px', fontSize: 11, color: '#8b8ba7', fontWeight: 600 }}>
                    {selectedBlockId ? 'Insert into selected block:' : 'Select a text block first'}
                  </div>
                  {MERGE_TAGS.map(mt => (
                    <button key={mt.tag} onClick={() => insertMergeTag(mt.tag, 'block')} disabled={!selectedBlockId} style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                      borderRadius: 8, border: 'none', background: 'transparent', cursor: selectedBlockId ? 'pointer' : 'default',
                      fontSize: 13, color: selectedBlockId ? '#1a1a2e' : '#ccc', opacity: selectedBlockId ? 1 : 0.5,
                    }}>
                      <span style={{ fontWeight: 600 }}>{mt.tag}</span>
                      <span style={{ color: '#8b8ba7', marginLeft: 8, fontSize: 12 }}>{mt.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {BLOCK_DEFS.map(bd => (
              <button
                key={bd.type}
                onClick={() => addBlock(bd.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px 14px',
                  borderRadius: 10,
                  border: '1px solid #E0F7FA',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1a1a2e',
                  whiteSpace: 'nowrap',
                  minHeight: 40,
                  flex: '0 0 auto',
                }}
              >
                <span style={{ fontSize: 16 }}>{bd.icon}</span>
                {bd.label}
              </button>
            ))}
          </div>

          {/* Email Canvas */}
          <div style={{
            background: '#f0f0f8',
            borderRadius: 16,
            padding: isMobile ? 12 : 24,
            marginBottom: 16,
            minHeight: 300,
          }}>
            <div style={{
              maxWidth: 600,
              margin: '0 auto',
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              minHeight: 200,
            }}>
              {blocks.length === 0 && (
                <div style={{
                  padding: 48,
                  textAlign: 'center',
                  color: '#8b8ba7',
                }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Your email is empty</div>
                  <div style={{ fontSize: 14 }}>Click the buttons above to add blocks to your email</div>
                </div>
              )}
              {blocks.map((block, i) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => setSelectedBlockId(selectedBlockId === block.id ? null : block.id)}
                  onUpdate={(content) => updateBlock(block.id, content)}
                  onDelete={() => deleteBlock(block.id)}
                  onMoveUp={() => moveBlock(block.id, -1)}
                  onMoveDown={() => moveBlock(block.id, 1)}
                  isFirst={i === 0}
                  isLast={i === blocks.length - 1}
                />
              ))}
            </div>
          </div>
            </>
          )}

          {/* Preview Modal */}
          {showPreview && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.5)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16,
            }} onClick={() => setShowPreview(false)}>
              <div style={{
                background: '#fff', borderRadius: 16, maxWidth: 650, width: '100%',
                maxHeight: '90vh', overflow: 'auto', padding: 0,
              }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0F7FA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>Email Preview</span>
                  <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#8b8ba7' }}>×</button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: getHtml() }} />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : undefined }}>
              <button onClick={() => setStep('template')} style={{ ...btnSecondary, width: isMobile ? '100%' : undefined }}>Back</button>
              <button onClick={saveDraft} disabled={loading} style={{ ...btnSecondary, opacity: loading ? 0.6 : 1, width: isMobile ? '100%' : undefined }}>
                Save Draft
              </button>
              <button onClick={() => setShowPreview(true)} style={{ ...btnSecondary, width: isMobile ? '100%' : undefined }}>
                Preview HTML
              </button>
            </div>
            <button onClick={goToSettings} style={{ ...btnPrimary, width: isMobile ? '100%' : undefined }}>
              Next: Choose Recipients
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 'settings' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Who should receive this email?</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e', display: 'block', marginBottom: 6 }}>Send to</label>
                <select value={recipientType} onChange={e => setRecipientType(e.target.value as 'all' | 'segment')} style={inputStyle}>
                  <option value="all">All my customers ({contactsCount} people)</option>
                  <option value="segment">A specific group</option>
                </select>
              </div>
              {recipientType === 'segment' && (
                segments.length > 0 ? (
                  <select value={selectedSegment} onChange={e => setSelectedSegment(e.target.value)} style={inputStyle}>
                    {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                ) : (
                  <div style={{ padding: 16, background: '#FFF0F0', borderRadius: 12, color: '#cc5555', fontSize: 14 }}>
                    No groups created yet. Send to all customers or create a group first.
                  </div>
                )
              )}
            </div>
          </div>

          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>When should it be sent?</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', borderRadius: 12, border: sendNow ? '2px solid #00B4D8' : '1px solid #E0F7FA', background: sendNow ? '#E0F7FA' : '#fff', minHeight: 44 }}>
                <input type="radio" checked={sendNow} onChange={() => setSendNow(true)} style={{ accentColor: '#00B4D8' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Send right now</div>
                  <div style={{ fontSize: 12, color: '#8b8ba7' }}>Your email goes out immediately</div>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', borderRadius: 12, border: !sendNow ? '2px solid #00B4D8' : '1px solid #E0F7FA', background: !sendNow ? '#E0F7FA' : '#fff', minHeight: 44 }}>
                <input type="radio" checked={!sendNow} onChange={() => setSendNow(false)} style={{ accentColor: '#00B4D8' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Schedule for later</div>
                  <div style={{ fontSize: 12, color: '#8b8ba7' }}>Choose a date and time</div>
                </div>
              </label>
              {!sendNow && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                    <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} style={inputStyle} />
                    <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} style={inputStyle} />
                  </div>
                  {/* Timezone Delivery Toggle */}
                  <div
                    onClick={() => setTimezoneDelivery(!timezoneDelivery)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 16px',
                      borderRadius: 12,
                      border: timezoneDelivery ? '2px solid #00B4D8' : '1px solid #E0F7FA',
                      background: timezoneDelivery ? '#E0F7FA' : '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: timezoneDelivery ? '#00B4D8' : '#E0F7FA',
                      position: 'relative',
                      transition: 'background 0.2s',
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        background: '#fff',
                        position: 'absolute',
                        top: 2,
                        left: timezoneDelivery ? 22 : 2,
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>Deliver by recipient timezone</div>
                      <div style={{ fontSize: 12, color: '#8b8ba7', marginTop: 2 }}>
                        Each customer gets your email at {scheduledTime || 'the scheduled time'} in THEIR timezone
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Test email */}
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 8px' }}>Send a test first</h2>
            <p style={{ color: '#8b8ba7', fontSize: 13, margin: '0 0 12px' }}>Always test your email before sending it to customers</p>
            {showTestEmail ? (
              <div style={{ display: 'flex', gap: 8, flexDirection: isMobile ? 'column' : 'row' }}>
                <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} placeholder="your@email.com" style={{ ...inputStyle, flex: isMobile ? undefined : 1 }} />
                <button onClick={sendTestEmailFn} disabled={loading} style={{ ...btnPrimary, whiteSpace: 'nowrap', opacity: loading ? 0.6 : 1, width: isMobile ? '100%' : undefined }}>Send Test</button>
              </div>
            ) : (
              <button onClick={() => setShowTestEmail(true)} style={btnSecondary}>Send Test Email</button>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row' }}>
            <button onClick={() => setStep('design')} style={{ ...btnSecondary, width: isMobile ? '100%' : undefined }}>Back</button>
            <button onClick={goToReview} style={{ ...btnPrimary, width: isMobile ? '100%' : undefined }}>Review & Send</button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 'review' && (
        <div>
          <div style={{ ...cardStyle, marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 16px' }}>Review Your Email</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                { label: 'Email name', value: campaignName },
                { label: 'Subject', value: subject },
                { label: 'Preview text', value: preheader || '(none)' },
                { label: 'Sending to', value: recipientType === 'all' ? `All customers (${contactsCount})` : `Group: ${segments.find(s => s.id === selectedSegment)?.name || selectedSegment}` },
                { label: 'When', value: sendNow ? 'Right now' : `${scheduledDate} at ${scheduledTime}` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F0F8', flexWrap: 'wrap', gap: isMobile ? 4 : 8, flexDirection: isMobile ? 'column' : 'row' }}>
                  <span style={{ color: '#8b8ba7', fontSize: 14 }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {htmlContent && (
            <div style={{ ...cardStyle, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 12px' }}>Preview</h3>
              <div style={{ border: '1px solid #E0F7FA', borderRadius: 12, overflow: 'hidden', maxHeight: 400, overflowY: 'auto' }}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} style={{ padding: 16 }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
            <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row', width: isMobile ? '100%' : undefined }}>
              <button onClick={() => setStep('settings')} style={{ ...btnSecondary, width: isMobile ? '100%' : undefined }}>Back</button>
              <button onClick={saveDraft} disabled={loading} style={{ ...btnSecondary, opacity: loading ? 0.6 : 1, width: isMobile ? '100%' : undefined }}>
                Save as Draft
              </button>
            </div>
            <button onClick={sendCampaign} disabled={loading} style={{
              ...btnPrimary,
              background: loading ? '#8b8ba7' : '#00B4D8',
              padding: '14px 28px',
              fontSize: 16,
              width: isMobile ? '100%' : undefined,
            }}>
              {loading ? 'Sending...' : sendNow ? 'Send to My Customers!' : 'Schedule Email'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
