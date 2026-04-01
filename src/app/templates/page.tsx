'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { templateLibrary, TEMPLATE_CATEGORIES, TemplateCategory } from '@/data/template-library';
import type { LibraryTemplate } from '@/data/template-library';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Welcome:    { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  Festival:   { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  Business:   { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
  Newsletter: { bg: '#FCE7F3', text: '#BE185D', border: '#FBCFE8' },
};

export default function TemplatesLibraryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? templateLibrary : templateLibrary.filter(t => t.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 text-gray-800 hover:text-gray-600 transition-colors">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base"
              style={{ background: 'linear-gradient(135deg,#00B4D8,#FF6B6B)' }}>
              B
            </div>
            <span className="font-bold text-lg hidden sm:block">Bestemail</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">Dashboard</Link>
            <Link href="/templates" className="text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-0.5">Templates</Link>
            <Link href="/dashboard/campaigns/new"
              className="text-sm font-semibold text-white px-4 py-2 rounded-full transition-colors"
              style={{ background: '#00B4D8' }}>
              New Campaign
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Email Templates Library</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Ready-to-use email templates crafted for Indian businesses. Pick one and launch in minutes.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-8">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat as TemplateCategory)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 text-xs font-normal opacity-75">
                    ({templateLibrary.filter(t => t.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 mb-6">
          Showing <strong className="text-gray-700">{filtered.length}</strong> template{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No templates match your search.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="mt-4 text-sm font-semibold text-indigo-600 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={() => router.push(`/dashboard/campaigns/new?template_id=${template.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TemplateCard({ template, onUse }: { template: LibraryTemplate; onUse: () => void }) {
  const colors = CATEGORY_COLORS[template.category] || CATEGORY_COLORS.Welcome;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
      {/* Thumbnail */}
      <div
        className="h-36 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
        style={{ background: template.thumbnailColor }}
      >
        <div className="text-4xl">{template.thumbnailEmoji}</div>
        <div className="text-white/80 text-xs font-medium px-3 text-center line-clamp-2 max-w-[85%]">
          {template.subject.length > 50 ? template.subject.slice(0, 47) + '…' : template.subject}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link href={`/templates/${template.id}`} className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-full">
            Preview
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1">{template.name}</h3>
          <span
            className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {template.category}
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-4 line-clamp-2">{template.previewText}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onUse}
            className="flex-1 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            style={{ background: '#00B4D8' }}
          >
            Use Template
          </button>
          <Link
            href={`/templates/${template.id}`}
            className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
