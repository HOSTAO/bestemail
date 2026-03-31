/**
 * Insert all seed templates into Supabase.
 *
 * Usage:
 *   npx tsx scripts/insert-templates.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 * (or a .env / .env.local file in project root).
 */

import { createClient } from '@supabase/supabase-js';
import { allTemplates } from './seed-all-templates';

// Load env from .env.local if present
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('Set them in .env.local or as environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  subject TEXT NOT NULL,
  preview_text TEXT,
  html_body TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  industry_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  thumbnail_color VARCHAR(20) DEFAULT '#6366f1',
  is_featured BOOLEAN DEFAULT FALSE,
  is_system BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_subcategory ON templates(subcategory);
CREATE INDEX IF NOT EXISTS idx_templates_is_featured ON templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_templates_tags ON templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_templates_industry_tags ON templates USING GIN(industry_tags);
`;

async function main() {
  console.log('🚀 Starting template seed...\n');

  // Ensure table exists
  console.log('📋 Ensuring templates table exists...');
  const { error: sqlError } = await supabase.rpc('exec_sql', { sql: CREATE_TABLE_SQL }).single();
  if (sqlError) {
    // If RPC doesn't exist, try direct insert — table might already exist via migration
    console.log('  (exec_sql RPC not available — assuming table exists via migration)');
  } else {
    console.log('  ✅ Table ready');
  }

  console.log(`\n📊 Total templates to insert: ${allTemplates.length}`);

  // Clear existing system templates
  console.log('\n🗑️  Clearing existing system templates...');
  const { error: delError } = await supabase
    .from('templates')
    .delete()
    .eq('is_system', true);
  if (delError) {
    console.error('  Warning: Could not clear existing templates:', delError.message);
  }

  // Insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < allTemplates.length; i += BATCH_SIZE) {
    const batch = allTemplates.slice(i, i + BATCH_SIZE).map((t) => ({
      name: t.name,
      category: t.category,
      subcategory: t.subcategory,
      subject: t.subject,
      preview_text: t.preview_text,
      html_body: t.html_body,
      tags: t.tags,
      industry_tags: t.industry_tags,
      thumbnail_color: t.thumbnail_color,
      is_featured: t.is_featured,
      is_system: true,
    }));

    const { error } = await supabase.from('templates').insert(batch);

    if (error) {
      console.error(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
      failed += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`  ✅ Inserted ${inserted}/${allTemplates.length}\r`);
    }
  }

  console.log(`\n\n✨ Done! Inserted ${inserted} templates. Failed: ${failed}.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
