'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Template {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  subject: string;
  preview_text: string;
  html_body: string;
  tags: string[];
  industry_tags: string[];
  thumbnail_color: string;
  is_featured: boolean;
}

const CATEGORIES = [
  'All',
  'Indian Festivals',
  'National Days',
  'Indian Occasions',
  'International',
  'Islamic',
  'Christian',
  'Sikh',
  'Buddhist',
  'Jain',
  'Business',
] as const;

const SUBCATEGORIES: Record<string, string[]> = {
  'Indian Festivals': ['Diwali', 'Holi', 'Navratri', 'Ganesh Chaturthi', 'Raksha Bandhan', 'Pongal', 'Onam', 'Baisakhi', 'Makar Sankranti', 'Janmashtami'],
  'National Days': ['Republic Day', 'Independence Day', 'Gandhi Jayanti', 'Teachers Day', 'Childrens Day', 'Womens Day'],
  'Indian Occasions': ['Wedding Season', 'Karva Chauth', 'Dhanteras', 'Bhai Dooj', 'Lohri', 'Gudi Padwa'],
  'International': ['New Year', 'Valentines Day', 'Womens Day', 'Mothers Day', 'Fathers Day', 'Easter', 'Halloween', 'Thanksgiving', 'Christmas', 'Black Friday', 'Cyber Monday', 'Boxing Day', 'Year End'],
  'Islamic': ['Ramadan', 'Eid ul-Fitr', 'Eid ul-Adha', 'Mawlid', 'Muharram'],
  'Christian': ['Christmas', 'Easter', 'Good Friday', 'Advent'],
  'Sikh': ['Guru Nanak Jayanti', 'Baisakhi', 'Gurpurab', 'Vaisakhi'],
  'Buddhist': ['Buddha Purnima', 'Vesak'],
  'Jain': ['Mahavir Jayanti', 'Paryushana', 'Diwali Jain'],
  'Business': ['Welcome', 'Thank You', 'Re-engagement', 'Product Launch', 'Newsletter', 'Flash Sale', 'Abandoned Cart', 'Review Request', 'Birthday', 'Anniversary'],
};

const INDUSTRIES = ['All', 'Retail', 'Restaurant', 'Education', 'Healthcare', 'Real Estate', 'Technology', 'General'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  'Indian Festivals': '#FF6B35',
  'National Days': '#FF9933',
  'Indian Occasions': '#E84855',
  'International': '#44BBA4',
  'Islamic': '#00695C',
  'Christian': '#4A148C',
  'Sikh': '#1565C0',
  'Buddhist': '#880E4F',
  'Jain': '#006064',
  'Business': '#00B4D8',
};

export default function TemplatesPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.ok ? r.json() : [])
      .then(data => setTemplates(Array.isArray(data) ? data : data.templates || []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const subcategories = useMemo(() => {
    if (selectedCategory === 'All') return [];
    return SUBCATEGORIES[selectedCategory] || [];
  }, [selectedCategory]);

  const filteredTemplates = useMemo(() => {
    let result = templates;

    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category === selectedCategory);
    }

    if (selectedSubcategory !== 'All') {
      result = result.filter(t => t.subcategory === selectedSubcategory);
    }

    if (selectedIndustry !== 'All') {
      result = result.filter(t =>
        t.industry_tags.some(tag => tag.toLowerCase() === selectedIndustry.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [templates, selectedCategory, selectedSubcategory, selectedIndustry, search]);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('All');
  }, []);

  const handleUseTemplate = useCallback((id: string) => {
    router.push(`/dashboard/campaigns/new?template_id=${id}`);
  }, [router]);

  const closePreview = useCallback(() => {
    setPreviewTemplate(null);
  }, []);

  const templateCount = filteredTemplates.length || templates.length || 342;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FF', padding: isMobile ? '16px' : '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: isMobile ? 24 : 32,
          fontWeight: 700,
          color: '#1a1a2e',
          margin: 0,
          marginBottom: 8,
        }}>
          Email Templates
        </h1>
        <p style={{
          fontSize: 15,
          color: '#64648b',
          margin: 0,
        }}>
          Browse and customize professionally designed email templates for every occasion.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 480 }}>
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
            placeholder="Search templates by name, subject, or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              fontSize: 15,
              border: '1.5px solid #E0F7FA',
              borderRadius: 12,
              outline: 'none',
              background: '#fff',
              color: '#1a1a2e',
              boxSizing: 'border-box',
              minHeight: 44,
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
      }}>
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '8px 18px',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                border: isActive ? '1.5px solid #00B4D8' : '1.5px solid #E0F7FA',
                borderRadius: 20,
                background: isActive ? '#E0F7FA' : '#fff',
                color: isActive ? '#00B4D8' : '#64648b',
                cursor: 'pointer',
                minHeight: isMobile ? 44 : 36,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills */}
      {subcategories.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 16,
        }}>
          <button
            onClick={() => setSelectedSubcategory('All')}
            style={{
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: selectedSubcategory === 'All' ? 600 : 400,
              border: selectedSubcategory === 'All' ? '1.5px solid #00B4D8' : '1px solid #E0F7FA',
              borderRadius: 20,
              background: selectedSubcategory === 'All' ? '#E0F7FA' : '#fff',
              color: selectedSubcategory === 'All' ? '#00B4D8' : '#8b8ba7',
              cursor: 'pointer',
              minHeight: isMobile ? 44 : 32,
              transition: 'all 0.2s ease',
            }}
          >
            All
          </button>
          {subcategories.map(sub => {
            const isActive = selectedSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  border: isActive ? '1.5px solid #00B4D8' : '1px solid #E0F7FA',
                  borderRadius: 20,
                  background: isActive ? '#E0F7FA' : '#fff',
                  color: isActive ? '#00B4D8' : '#8b8ba7',
                  cursor: 'pointer',
                  minHeight: isMobile ? 44 : 32,
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}

      {/* Industry Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
      }}>
        <span style={{ fontSize: 13, color: '#8b8ba7', fontWeight: 500, marginRight: 4 }}>Industry:</span>
        {INDUSTRIES.map(ind => {
          const isActive = selectedIndustry === ind;
          return (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              style={{
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                border: isActive ? '1.5px solid #00B4D8' : '1px solid #E0F7FA',
                borderRadius: 20,
                background: isActive ? '#E0F7FA' : '#fff',
                color: isActive ? '#00B4D8' : '#8b8ba7',
                cursor: 'pointer',
                minHeight: isMobile ? 44 : 32,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {ind}
            </button>
          );
        })}
      </div>

      {/* Template Count */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 14, color: '#64648b', fontWeight: 500 }}>
          {loading ? 'Loading templates...' : `${filteredTemplates.length} Template${filteredTemplates.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: 16,
                background: '#fff',
                border: '1.5px solid #E0F7FA',
                overflow: 'hidden',
              }}
            >
              <div style={{
                height: 140,
                background: 'linear-gradient(90deg, #f0f0f5 25%, #e8e8f0 50%, #f0f0f5 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }} />
              <div style={{ padding: 16 }}>
                <div style={{
                  height: 16,
                  width: '70%',
                  background: '#f0f0f5',
                  borderRadius: 8,
                  marginBottom: 10,
                }} />
                <div style={{
                  height: 12,
                  width: '90%',
                  background: '#f0f0f5',
                  borderRadius: 8,
                  marginBottom: 10,
                }} />
                <div style={{
                  height: 12,
                  width: '50%',
                  background: '#f0f0f5',
                  borderRadius: 8,
                  marginBottom: 16,
                }} />
                <div style={{
                  height: 40,
                  background: '#f0f0f5',
                  borderRadius: 12,
                }} />
              </div>
            </div>
          ))}
          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTemplates.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#fff',
          borderRadius: 16,
          border: '1.5px solid #E0F7FA',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {search ? '\uD83D\uDD0D' : '\uD83D\uDCE8'}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', margin: '0 0 8px 0' }}>
            {search ? 'No templates found' : 'No templates available'}
          </h3>
          <p style={{ fontSize: 14, color: '#8b8ba7', margin: 0, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
            {search
              ? `No templates match "${search}". Try adjusting your search or filters.`
              : 'Templates will appear here once they are added. Try changing your filters.'}
          </p>
          {(search || selectedCategory !== 'All' || selectedIndustry !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedSubcategory('All');
                setSelectedIndustry('All');
              }}
              style={{
                marginTop: 20,
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                border: '1.5px solid #00B4D8',
                borderRadius: 12,
                background: '#E0F7FA',
                color: '#00B4D8',
                cursor: 'pointer',
                minHeight: 44,
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Template Grid */}
      {!loading && filteredTemplates.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isMobile={isMobile}
              onUse={handleUseTemplate}
              onPreview={setPreviewTemplate}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          isMobile={isMobile}
          onClose={closePreview}
          onUse={handleUseTemplate}
        />
      )}
    </div>
  );
}

function TemplateCard({
  template,
  isMobile,
  onUse,
  onPreview,
}: {
  template: Template;
  isMobile: boolean;
  onUse: (id: string) => void;
  onPreview: (t: Template) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const categoryColor = CATEGORY_COLORS[template.category] || '#00B4D8';
  const nameInitial = template.name.charAt(0).toUpperCase();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        background: '#fff',
        border: '1.5px solid #E0F7FA',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: hovered ? '0 8px 24px rgba(0,180,216,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Colored Header */}
      <div style={{
        height: 120,
        background: template.thumbnail_color || '#00B4D8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{
          fontSize: 36,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
        }}>
          {nameInitial}
        </div>
        <span style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.9)',
          fontWeight: 500,
          maxWidth: '80%',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {template.name}
        </span>
      </div>

      {/* Card Body */}
      <div style={{ padding: 16 }}>
        {/* Template Name */}
        <h3 style={{
          fontSize: 16,
          fontWeight: 600,
          color: '#1a1a2e',
          margin: '0 0 8px 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {template.name}
        </h3>

        {/* Category Badge */}
        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 20,
            background: `${categoryColor}18`,
            color: categoryColor,
            letterSpacing: 0.3,
          }}>
            {template.category}
          </span>
        </div>

        {/* Subject Preview */}
        <p style={{
          fontSize: 13,
          color: '#8b8ba7',
          margin: '0 0 16px 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 1.4,
        }}>
          {template.subject}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onUse(template.id); }}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              borderRadius: 12,
              background: '#00B4D8',
              color: '#fff',
              cursor: 'pointer',
              minHeight: isMobile ? 44 : 40,
              transition: 'background 0.2s ease',
            }}
          >
            Use Template
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(template); }}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: 600,
              border: '1.5px solid #E0F7FA',
              borderRadius: 12,
              background: '#fff',
              color: '#64648b',
              cursor: 'pointer',
              minHeight: isMobile ? 44 : 40,
              transition: 'all 0.2s ease',
            }}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({
  template,
  isMobile,
  onClose,
  onUse,
}: {
  template: Template;
  isMobile: boolean;
  onClose: () => void;
  onUse: (id: string) => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 12 : 32,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 720,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #E0F7FA',
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#1a1a2e',
              margin: '0 0 4px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {template.name}
            </h3>
            <p style={{
              fontSize: 13,
              color: '#8b8ba7',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              Subject: {template.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: '#F8F9FF',
              color: '#64648b',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 12,
              lineHeight: 1,
            }}
          >
            &#x2715;
          </button>
        </div>

        {/* Iframe Preview */}
        <div style={{ flex: 1, overflow: 'auto', background: '#f5f5f5' }}>
          <iframe
            srcDoc={template.html_body || '<p style="padding:40px;text-align:center;color:#8b8ba7;">No preview available</p>'}
            sandbox="allow-same-origin"
            style={{
              width: '100%',
              minHeight: 400,
              height: '60vh',
              border: 'none',
              display: 'block',
            }}
            title={`Preview: ${template.name}`}
          />
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #E0F7FA',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 10,
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 500,
              border: '1.5px solid #E0F7FA',
              borderRadius: 12,
              background: '#fff',
              color: '#64648b',
              cursor: 'pointer',
              minHeight: 44,
            }}
          >
            Close
          </button>
          <button
            onClick={() => { onUse(template.id); onClose(); }}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              borderRadius: 12,
              background: '#00B4D8',
              color: '#fff',
              cursor: 'pointer',
              minHeight: 44,
              transition: 'background 0.2s ease',
            }}
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
}
