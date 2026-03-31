-- Migration 007: New feature tables (Domain Auth, Sender IDs, Webhooks)
-- Add ip_allowlist column to settings table

CREATE TABLE IF NOT EXISTS sending_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain VARCHAR(255) NOT NULL,
  dkim_selector VARCHAR(100) DEFAULT 'bestemail',
  dkim_public_key TEXT,
  spf_verified BOOLEAN DEFAULT FALSE,
  dkim_verified BOOLEAN DEFAULT FALSE,
  dmarc_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, domain)
);

CREATE TABLE IF NOT EXISTS sender_ids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_name VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  reply_to VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT ARRAY[]::TEXT[],
  secret_key VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add ip_allowlist JSONB column to settings if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'settings' AND column_name = 'ip_allowlist'
  ) THEN
    ALTER TABLE settings ADD COLUMN ip_allowlist JSONB DEFAULT '{"ips": [], "enabled": false}'::jsonb;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE sending_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE sender_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'sending_domains_user_policy') THEN
    CREATE POLICY sending_domains_user_policy ON sending_domains FOR ALL USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'sender_ids_user_policy') THEN
    CREATE POLICY sender_ids_user_policy ON sender_ids FOR ALL USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'webhooks_user_policy') THEN
    CREATE POLICY webhooks_user_policy ON webhooks FOR ALL USING (user_id = auth.uid());
  END IF;
END $$;
