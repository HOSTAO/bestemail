-- Create settings table for storing user-specific configurations
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Sendy configuration
  sendy_api_url TEXT,
  sendy_api_key TEXT,
  sendy_list_id TEXT,
  sendy_brand_id TEXT DEFAULT '1',
  
  -- Email defaults
  default_from_email TEXT,
  default_from_name TEXT,
  
  -- Other settings
  timezone TEXT DEFAULT 'Asia/Calcutta',
  enable_tracking BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Ensure one settings record per user
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_settings_user_id ON settings(user_id);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view and edit their own settings
CREATE POLICY "Users can view own settings" ON settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON settings
  FOR DELETE USING (auth.uid() = user_id);