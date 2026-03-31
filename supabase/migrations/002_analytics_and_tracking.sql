-- Add new columns to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS template_id VARCHAR(100);
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS preheader TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS recipient_type VARCHAR(50) DEFAULT 'all';
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS segment_id VARCHAR(50);
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS total_recipients INTEGER DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS sent_count INTEGER DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS failed_count INTEGER DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS open_count INTEGER DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS unsubscribe_count INTEGER DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS bounce_count INTEGER DEFAULT 0;

-- Add engagement fields to contacts
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_engaged_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS subscribed BOOLEAN DEFAULT true;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- Campaign sends tracking
CREATE TABLE IF NOT EXISTS campaign_sends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'sent', -- sent, failed, bounced
  bounce_type VARCHAR(50), -- hard, soft
  bounce_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, contact_id)
);

-- Campaign opens tracking
CREATE TABLE IF NOT EXISTS campaign_opens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45),
  device_type VARCHAR(50),
  email_client VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign clicks tracking
CREATE TABLE IF NOT EXISTS campaign_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  link_id VARCHAR(50),
  url TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign unsubscribes
CREATE TABLE IF NOT EXISTS campaign_unsubscribes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, contact_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign ON campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_contact ON campaign_sends(contact_id);
CREATE INDEX IF NOT EXISTS idx_campaign_opens_campaign ON campaign_opens(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_opens_contact ON campaign_opens(contact_id);
CREATE INDEX IF NOT EXISTS idx_campaign_clicks_campaign ON campaign_clicks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_clicks_contact ON campaign_clicks(contact_id);
CREATE INDEX IF NOT EXISTS idx_contacts_engagement ON contacts(last_engaged_at, engagement_score);
CREATE INDEX IF NOT EXISTS idx_contacts_subscribed ON contacts(subscribed);

-- Functions to increment campaign stats
CREATE OR REPLACE FUNCTION increment_campaign_opens(campaign_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE campaigns 
  SET open_count = open_count + 1 
  WHERE id = campaign_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_campaign_clicks(campaign_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE campaigns 
  SET click_count = click_count + 1 
  WHERE id = campaign_id_param;
END;
$$ LANGUAGE plpgsql;

-- White label tables
CREATE TABLE IF NOT EXISTS white_label_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) UNIQUE,
  custom_domain VARCHAR(255),
  branding_config JSONB DEFAULT '{
    "primaryColor": "#007bff",
    "secondaryColor": "#6c757d",
    "logo": null,
    "favicon": null
  }',
  features_config JSONB DEFAULT '{
    "smsMarketing": false,
    "whatsappIntegration": false,
    "customIntegrations": false,
    "apiAccess": false
  }',
  from_name VARCHAR(255),
  from_email VARCHAR(255),
  reply_to_email VARCHAR(255),
  support_url VARCHAR(500),
  terms_url VARCHAR(500),
  privacy_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link white label accounts to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS white_label_account_id UUID REFERENCES white_label_accounts(id);

-- Email templates
CREATE TABLE IF NOT EXISTS email_templates_custom (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES white_label_accounts(id),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  subject TEXT,
  preheader TEXT,
  html_content TEXT,
  text_content TEXT,
  thumbnail_url VARCHAR(500),
  variables TEXT[], -- Array of variable names used
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign analytics views
CREATE OR REPLACE VIEW campaign_analytics AS
SELECT 
  c.id,
  c.name,
  c.subject,
  c.status,
  c.created_at,
  c.started_at,
  c.completed_at,
  c.total_recipients,
  c.sent_count,
  c.open_count,
  c.click_count,
  c.unsubscribe_count,
  c.bounce_count,
  CASE 
    WHEN c.sent_count > 0 THEN ROUND((c.open_count::NUMERIC / c.sent_count) * 100, 2)
    ELSE 0
  END AS open_rate,
  CASE 
    WHEN c.sent_count > 0 THEN ROUND((c.click_count::NUMERIC / c.sent_count) * 100, 2)
    ELSE 0
  END AS click_rate,
  CASE 
    WHEN c.sent_count > 0 THEN ROUND((c.unsubscribe_count::NUMERIC / c.sent_count) * 100, 2)
    ELSE 0
  END AS unsubscribe_rate
FROM campaigns c;

-- Contact engagement view
CREATE OR REPLACE VIEW contact_engagement AS
SELECT 
  c.id,
  c.email,
  c.first_name,
  c.last_name,
  c.subscribed,
  c.engagement_score,
  c.last_engaged_at,
  COUNT(DISTINCT co.campaign_id) AS campaigns_opened,
  COUNT(DISTINCT cc.campaign_id) AS campaigns_clicked,
  CASE 
    WHEN c.last_engaged_at > NOW() - INTERVAL '30 days' THEN 'engaged'
    WHEN c.last_engaged_at > NOW() - INTERVAL '90 days' THEN 'moderate'
    WHEN c.last_engaged_at IS NOT NULL THEN 'inactive'
    ELSE 'never_engaged'
  END AS engagement_status
FROM contacts c
LEFT JOIN campaign_opens co ON c.id = co.contact_id
LEFT JOIN campaign_clicks cc ON c.id = cc.contact_id
GROUP BY c.id;