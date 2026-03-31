'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

interface EmailBlock {
  id: string;
  type: 'header' | 'greeting' | 'text' | 'offer' | 'image' | 'button' | 'products' | 'divider' | 'footer';
  content: Record<string, string>;
}

interface Template {
  id: string;
  name: string;
  category: string;
  color: string;
  emoji: string;
  blocks: EmailBlock[];
}

const CATEGORIES = ['All', 'Festival', 'Product Launch', 'Newsletter', 'Welcome', 'Sale', 'Thank You', 'Re-engagement', 'Loyalty'];

function buildTemplates(): Template[] {
  return [
    {
      id: 'diwali-sale',
      name: 'Diwali Sale',
      category: 'Festival',
      color: '#FF6B35',
      emoji: '🪔',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Happy Diwali from Our Family to Yours!', backgroundColor: '#FF6B35' } },
        { id: uid(), type: 'greeting', content: { text: 'Dear Valued Customer,' } },
        { id: uid(), type: 'offer', content: { title: 'Diwali Sale! 40% OFF', description: 'Celebrate the Festival of Lights with our biggest sale of the year. Use code DIWALI40 at checkout.', backgroundColor: '#FFF3ED' } },
        { id: uid(), type: 'button', content: { text: 'Shop the Diwali Sale', url: '#', backgroundColor: '#FF6B35' } },
      ],
    },
    {
      id: 'eid-mubarak',
      name: 'Eid Mubarak',
      category: 'Festival',
      color: '#10B981',
      emoji: '🌙',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Eid Mubarak!', backgroundColor: '#10B981' } },
        { id: uid(), type: 'greeting', content: { text: 'Assalamu Alaikum,' } },
        { id: uid(), type: 'text', content: { text: 'Wishing you and your family a joyous Eid filled with blessings, peace, and happiness. May this special occasion bring prosperity and togetherness to your home.' } },
        { id: uid(), type: 'button', content: { text: 'Explore Eid Collection', url: '#', backgroundColor: '#10B981' } },
      ],
    },
    {
      id: 'christmas-offer',
      name: 'Christmas Offer',
      category: 'Festival',
      color: '#EF4444',
      emoji: '🎄',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Merry Christmas!', backgroundColor: '#EF4444' } },
        { id: uid(), type: 'greeting', content: { text: 'Season\'s Greetings!' } },
        { id: uid(), type: 'offer', content: { title: 'Christmas Special', description: 'Unwrap amazing deals this holiday season. Flat 30% off on all products. Spread the joy of giving!', backgroundColor: '#FEF2F2' } },
        { id: uid(), type: 'button', content: { text: 'Shop Christmas Deals', url: '#', backgroundColor: '#EF4444' } },
      ],
    },
    {
      id: 'new-product-launch',
      name: 'New Product Launch',
      category: 'Product Launch',
      color: '#7C3AED',
      emoji: '🚀',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Introducing Something Amazing', backgroundColor: '#7C3AED' } },
        { id: uid(), type: 'text', content: { text: 'We have been working hard behind the scenes, and today we are thrilled to announce the launch of our newest product. Designed with you in mind, it combines cutting-edge innovation with everyday practicality.' } },
        { id: uid(), type: 'image', content: { src: '', alt: 'New Product Image', caption: 'Discover the future, today.' } },
        { id: uid(), type: 'button', content: { text: 'Explore Now', url: '#', backgroundColor: '#7C3AED' } },
      ],
    },
    {
      id: 'weekly-newsletter',
      name: 'Weekly Newsletter',
      category: 'Newsletter',
      color: '#3B82F6',
      emoji: '📰',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Your Weekly Digest', backgroundColor: '#3B82F6' } },
        { id: uid(), type: 'greeting', content: { text: 'Hi there,' } },
        { id: uid(), type: 'text', content: { text: 'Here is a roundup of this week\'s top stories, updates, and insights curated just for you. Stay informed and ahead of the curve.' } },
        { id: uid(), type: 'divider', content: {} },
        { id: uid(), type: 'text', content: { text: 'Have feedback or a story tip? Reply to this email and let us know. We love hearing from our readers.' } },
        { id: uid(), type: 'footer', content: { text: 'You received this email because you subscribed to our weekly newsletter. Unsubscribe anytime.' } },
      ],
    },
    {
      id: 'welcome-email',
      name: 'Welcome Email',
      category: 'Welcome',
      color: '#14B8A6',
      emoji: '👋',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Welcome to the Family!', backgroundColor: '#14B8A6' } },
        { id: uid(), type: 'greeting', content: { text: 'Welcome aboard!' } },
        { id: uid(), type: 'text', content: { text: 'We are so glad you joined us. You now have access to exclusive deals, early product launches, and curated recommendations tailored to your interests. Let us get started!' } },
        { id: uid(), type: 'button', content: { text: 'Start Exploring', url: '#', backgroundColor: '#14B8A6' } },
      ],
    },
    {
      id: 'flash-sale-24hrs',
      name: 'Flash Sale 24hrs',
      category: 'Sale',
      color: '#EF4444',
      emoji: '⚡',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'FLASH SALE - 24 Hours Only!', backgroundColor: '#EF4444' } },
        { id: uid(), type: 'offer', content: { title: '24 Hour Flash Sale!', description: 'The clock is ticking! Get up to 60% off on select items. Once it is gone, it is gone. Do not miss out on the deal of the season.', backgroundColor: '#FEF2F2' } },
        { id: uid(), type: 'button', content: { text: 'Grab the Deal Now', url: '#', backgroundColor: '#EF4444' } },
      ],
    },
    {
      id: 'customer-thank-you',
      name: 'Customer Thank You',
      category: 'Thank You',
      color: '#EC4899',
      emoji: '💖',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Thank You!', backgroundColor: '#EC4899' } },
        { id: uid(), type: 'greeting', content: { text: 'Dear Customer,' } },
        { id: uid(), type: 'text', content: { text: 'Thank you for your recent purchase! Your support means the world to us. We hope you love your order. If you have any questions or need help, our support team is always here for you.' } },
        { id: uid(), type: 'footer', content: { text: 'Need help? Contact our support team at support@example.com or call us at +91-XXXX-XXXXXX.' } },
      ],
    },
    {
      id: 'we-miss-you',
      name: 'We Miss You',
      category: 'Re-engagement',
      color: '#6B7280',
      emoji: '💌',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'We Miss You!', backgroundColor: '#6B7280' } },
        { id: uid(), type: 'greeting', content: { text: 'Hey there,' } },
        { id: uid(), type: 'text', content: { text: 'It\'s been a while since we last saw you. We have added tons of new products and features that we think you will love. Come back and take a look!' } },
        { id: uid(), type: 'offer', content: { title: 'Come back - 20% OFF', description: 'As a special welcome-back gift, here is an exclusive 20% discount just for you. Use code MISSYOU20 at checkout.', backgroundColor: '#F3F4F6' } },
        { id: uid(), type: 'button', content: { text: 'Rediscover What\'s New', url: '#', backgroundColor: '#6B7280' } },
      ],
    },
    {
      id: 'onam-special',
      name: 'Onam Special',
      category: 'Festival',
      color: '#F59E0B',
      emoji: '🌺',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Happy Onam!', backgroundColor: '#F59E0B' } },
        { id: uid(), type: 'greeting', content: { text: 'Dear Friend,' } },
        { id: uid(), type: 'offer', content: { title: 'Onam Special Offer', description: 'Celebrate the harvest festival of Kerala with our exclusive Onam collection. Enjoy up to 35% off on ethnic wear, home decor, and more!', backgroundColor: '#FFFBEB' } },
        { id: uid(), type: 'button', content: { text: 'Shop Onam Collection', url: '#', backgroundColor: '#F59E0B' } },
      ],
    },
    {
      id: 'monthly-update',
      name: 'Monthly Update',
      category: 'Newsletter',
      color: '#4F46E5',
      emoji: '📊',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'Your Monthly Update', backgroundColor: '#4F46E5' } },
        { id: uid(), type: 'greeting', content: { text: 'Hi,' } },
        { id: uid(), type: 'text', content: { text: 'Here is your monthly recap with the latest updates, top-performing products, and what is coming next. We have been busy building great things for you.' } },
        { id: uid(), type: 'divider', content: {} },
        { id: uid(), type: 'text', content: { text: 'Looking ahead, we have exciting launches planned for next month. Stay tuned and keep an eye on your inbox!' } },
        { id: uid(), type: 'footer', content: { text: 'You are receiving this because you opted in to monthly updates. Manage your preferences anytime.' } },
      ],
    },
    {
      id: 'loyalty-reward',
      name: 'Loyalty Reward',
      category: 'Loyalty',
      color: '#D97706',
      emoji: '⭐',
      blocks: [
        { id: uid(), type: 'header', content: { text: 'You Have Earned a Reward!', backgroundColor: '#D97706' } },
        { id: uid(), type: 'greeting', content: { text: 'Dear Loyal Customer,' } },
        { id: uid(), type: 'offer', content: { title: 'Exclusive Loyalty Reward', description: 'Your loyalty means everything to us. As a thank you, here is an exclusive reward just for you: a flat Rs. 500 off on your next order. Use code LOYAL500.', backgroundColor: '#FFFBEB' } },
        { id: uid(), type: 'button', content: { text: 'Claim Your Reward', url: '#', backgroundColor: '#D97706' } },
      ],
    },
  ];
}

const CATEGORY_COLORS: Record<string, string> = {
  Festival: '#FF6B35',
  'Product Launch': '#7C3AED',
  Newsletter: '#3B82F6',
  Welcome: '#14B8A6',
  Sale: '#EF4444',
  'Thank You': '#EC4899',
  'Re-engagement': '#6B7280',
  Loyalty: '#D97706',
};

export default function TemplateGalleryPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const templates = useMemo(() => buildTemplates(), []);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [templates, search, activeCategory]);

  function handleUseTemplate(template: Template) {
    router.push(`/dashboard/campaigns/new?template=${template.id}`);
  }

  return (
    <div style={{ padding: isMobile ? '16px' : '32px', backgroundColor: '#F8F9FF', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>
          Template Gallery
        </h1>
        <p style={{ fontSize: 14, color: '#64648b', marginTop: 6, marginBottom: 0 }}>
          Choose a template to get started quickly. Customize it in the email builder.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: isMobile ? '100%' : 420 }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8b8ba7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              fontSize: 14,
              border: '1px solid #E0F7FA',
              borderRadius: 12,
              outline: 'none',
              backgroundColor: '#fff',
              color: '#1a1a2e',
              boxSizing: 'border-box',
              minHeight: 44,
            }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 28,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 20,
                border: isActive ? '1px solid #00B4D8' : '1px solid #E0F7FA',
                backgroundColor: isActive ? '#E0F7FA' : '#fff',
                color: isActive ? '#00B4D8' : '#64648b',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      {search || activeCategory !== 'All' ? (
        <p style={{ fontSize: 13, color: '#8b8ba7', marginBottom: 16, marginTop: 0 }}>
          {filtered.length} template{filtered.length !== 1 ? 's' : ''} found
        </p>
      ) : null}

      {/* Template Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#8b8ba7',
          }}
        >
          <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#64648b', marginBottom: 4 }}>No templates found</p>
          <p style={{ fontSize: 14 }}>Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: isMobile ? 16 : 24,
          }}
        >
          {filtered.map((template) => {
            const isHovered = hoveredId === template.id;
            return (
              <div
                key={template.id}
                onMouseEnter={() => setHoveredId(template.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  border: '1px solid #E0F7FA',
                  boxShadow: isHovered
                    ? '0 8px 24px rgba(0,180,216,0.15)'
                    : '0 1px 3px rgba(0,180,216,0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {/* Preview Area */}
                <div
                  style={{
                    height: 200,
                    backgroundColor: template.color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 48 }}>{template.emoji}</span>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#fff',
                      textAlign: 'center',
                      padding: '0 16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    {template.name}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#1a1a2e',
                        margin: 0,
                      }}
                    >
                      {template.name}
                    </h3>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: CATEGORY_COLORS[template.category] || '#00B4D8',
                        backgroundColor: `${CATEGORY_COLORS[template.category] || '#00B4D8'}14`,
                        padding: '4px 10px',
                        borderRadius: 20,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {template.category}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 13,
                      color: '#8b8ba7',
                      margin: '0 0 16px 0',
                    }}
                  >
                    {template.blocks.length} block{template.blocks.length !== 1 ? 's' : ''} &middot;{' '}
                    {template.blocks.map((b) => b.type).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(template);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#fff',
                      backgroundColor: '#00B4D8',
                      border: 'none',
                      borderRadius: 12,
                      cursor: 'pointer',
                      minHeight: 44,
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#5835E0';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#00B4D8';
                    }}
                  >
                    Use this template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
