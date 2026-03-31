import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// One-time database setup endpoint
// Call with: POST /api/admin/setup-db
// Body: { "secret": "<SETUP_SECRET>" }

const SETUP_SECRET = process.env.SETUP_SECRET || process.env.SESSION_SECRET || 'bestemail-setup-2026';

const FULL_SCHEMA = `
-- ============================================================
-- BESTEMAIL PLATFORM - COMPLETE DATABASE SETUP
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  password_hash VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member',
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- 3. CONTACTS TABLE
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  name VARCHAR(255),
  city VARCHAR(255),
  business_type VARCHAR(255),
  company VARCHAR(255),
  phone VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  subscribed BOOLEAN DEFAULT true,
  engagement_score INTEGER DEFAULT 0,
  last_engaged_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- 4. SEGMENTS TABLE
CREATE TABLE IF NOT EXISTS segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  rules JSONB DEFAULT '[]',
  contact_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  preheader TEXT,
  content TEXT,
  html_content TEXT,
  from_email VARCHAR(255),
  from_name VARCHAR(255),
  reply_to VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  template_id VARCHAR(100),
  recipient_type VARCHAR(50) DEFAULT 'all',
  segment_id VARCHAR(50),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  unsubscribe_count INTEGER DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  stats JSONB DEFAULT '{}',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. FORMS TABLE
CREATE TABLE IF NOT EXISTS forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  fields JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft',
  embed_code TEXT,
  submissions_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. AUTOMATIONS TABLE
CREATE TABLE IF NOT EXISTS automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  trigger_type VARCHAR(255),
  actions JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'draft',
  enrolled_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member',
  status VARCHAR(50) DEFAULT 'active',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sendy_api_url TEXT,
  sendy_api_key TEXT,
  sendy_list_id TEXT,
  sendy_brand_id TEXT DEFAULT '1',
  default_from_email TEXT,
  default_from_name TEXT,
  timezone TEXT DEFAULT 'Asia/Calcutta',
  enable_tracking BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 10. CAMPAIGN TRACKING
CREATE TABLE IF NOT EXISTS campaign_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent',
  bounce_type VARCHAR(50),
  bounce_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_opens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45),
  device_type VARCHAR(50),
  email_client VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaign_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  link_id VARCHAR(50),
  url TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    if (secret !== SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Run SQL statements one by one
    const statements = FULL_SCHEMA
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const results: { sql: string; status: string; error?: string }[] = [];

    for (const sql of statements) {
      const fullSql = sql + ';';
      const { error } = await supabase.rpc('exec_sql', { sql: fullSql }).single() as any;

      if (error) {
        // Try via raw query
        const { error: err2 } = await supabase
          .from('_setup_check')
          .select('1')
          .limit(0) as any;

        results.push({
          sql: fullSql.substring(0, 80) + '...',
          status: 'attempted',
          error: error.message,
        });
      } else {
        results.push({
          sql: fullSql.substring(0, 80) + '...',
          status: 'ok',
        });
      }
    }

    // Verify tables were created
    const tables = ['users', 'contacts', 'campaigns', 'segments', 'forms', 'automations', 'sessions', 'settings'];
    const tableStatus: Record<string, boolean> = {};

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(0);
      tableStatus[table] = !error;
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      tables: tableStatus,
      allTablesReady: Object.values(tableStatus).every(Boolean),
    });
  } catch (error) {
    console.error('Setup DB error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Setup failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to check table status
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');

  if (secret !== SETUP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const tables = ['users', 'contacts', 'campaigns', 'segments', 'forms', 'automations', 'sessions', 'settings'];
  const tableStatus: Record<string, boolean> = {};

  for (const table of tables) {
    const { error } = await supabase.from(table).select('id').limit(0);
    tableStatus[table] = !error;
  }

  const allReady = Object.values(tableStatus).every(Boolean);

  return NextResponse.json({
    supabaseConnected: true,
    tables: tableStatus,
    allTablesReady: allReady,
    message: allReady ? 'All tables exist. Database is ready!' : 'Some tables are missing. Run POST to create them.',
  });
}
