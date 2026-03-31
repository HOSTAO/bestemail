-- Templates table for email template gallery
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

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_subcategory ON templates(subcategory);
CREATE INDEX IF NOT EXISTS idx_templates_is_featured ON templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_templates_tags ON templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_templates_industry_tags ON templates USING GIN(industry_tags);

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- System templates are readable by all authenticated users
CREATE POLICY "System templates are readable by all" ON templates
  FOR SELECT USING (is_system = TRUE);
