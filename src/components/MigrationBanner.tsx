'use client';

export default function MigrationBanner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
        <span className="text-3xl">🔧</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Database Migration Required</h2>
      <p className="text-gray-400 mb-4 max-w-md">
        This feature needs a one-time database setup. Run the migration in your Supabase SQL Editor to activate it.
      </p>
      <a
        href="https://supabase.com/dashboard/project/buxpheohrcsxufwqpych/sql/new"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
      >
        Open Supabase SQL Editor →
      </a>
      <p className="text-gray-500 text-sm mt-4">
        Paste the contents of <code className="text-indigo-400">supabase/migrations/005_activecampaign_features.sql</code> and click Run.
      </p>
    </div>
  );
}
