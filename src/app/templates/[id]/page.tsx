'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTemplateById } from '@/data/template-library';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Welcome:    { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  Festival:   { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  Business:   { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
  Newsletter: { bg: '#FCE7F3', text: '#BE185D', border: '#FBCFE8' },
};

export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const template = getTemplateById(id);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Template not found</h1>
          <p className="text-gray-500 mb-6">This template doesn't exist or has been removed.</p>
          <Link href="/templates" className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-full" style={{ background: '#00B4D8' }}>
            ← Back to Templates
          </Link>
        </div>
      </div>
    );
  }

  const colors = CATEGORY_COLORS[template.category] || CATEGORY_COLORS.Welcome;

  const handleUseinCampaign = () => {
    router.push(`/dashboard/campaigns/new?template_id=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/templates" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Templates
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-xs">{template.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/templates" className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors hidden sm:block">
              Browse All
            </Link>
            <button
              onClick={handleUseinCampaign}
              className="text-sm font-bold text-white px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
              style={{ background: '#00B4D8' }}
            >
              Use in Campaign →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              {/* Thumbnail */}
              <div
                className="h-40 rounded-xl flex flex-col items-center justify-center gap-3 mb-5"
                style={{ background: template.thumbnailColor }}
              >
                <div className="text-5xl">{template.thumbnailEmoji}</div>
                <span className="text-white/80 text-sm font-medium">{template.category}</span>
              </div>

              {/* Meta */}
              <h1 className="text-xl font-extrabold text-gray-900 mb-2">{template.name}</h1>

              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
              >
                {template.category}
              </span>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Subject Line</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{template.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Preview Text</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{template.previewText}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleUseinCampaign}
                  className="w-full text-white font-bold py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
                  style={{ background: '#00B4D8' }}
                >
                  🚀 Use in Campaign
                </button>
                <Link
                  href="/templates"
                  className="w-full text-center text-gray-600 font-semibold py-3 rounded-xl text-sm border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  ← Back to Library
                </Link>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">Email Preview</h2>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="bg-gray-100 p-4">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <iframe
                    srcDoc={template.htmlBody}
                    sandbox="allow-same-origin"
                    className="w-full border-none block"
                    style={{ height: '700px' }}
                    title={`Preview: ${template.name}`}
                  />
                </div>
              </div>
            </div>

            {/* Bottom CTA Banner */}
            <div className="mt-6 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold text-lg">Like this template?</p>
                <p className="text-white/80 text-sm">Use it in your next email campaign and reach your audience today.</p>
              </div>
              <button
                onClick={handleUseinCampaign}
                className="shrink-0 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                Use in Campaign →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
