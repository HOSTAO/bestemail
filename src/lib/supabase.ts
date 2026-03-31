import { createClient } from '@supabase/supabase-js';
import { runtimeConfig } from './runtime-config';

const supabaseUrl = runtimeConfig.supabaseUrl;
const supabaseAnonKey = runtimeConfig.supabaseAnonKey;
const supabaseServiceKey = runtimeConfig.supabaseServiceRoleKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase public environment variables not set. Public data features will be limited until configuration is completed.');
}

// Public client for client-side operations
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client for server-side operations
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  user_id: string;
  email: string;
  name?: string;
  city?: string;
  business_type?: string;
  tags: string[];
  status: 'active' | 'unsubscribed' | 'bounced';
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  content?: string;
  html_content?: string;
  segment_id?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduled_at?: string;
  sent_at?: string;
  stats: {
    sent?: number;
    opened?: number;
    clicked?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Segment {
  id: string;
  user_id: string;
  name: string;
  rules: Array<{
    field: 'city' | 'business_type' | 'tag';
    operator: 'equals' | 'contains';
    value: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  user_id: string;
  name: string;
  subject?: string;
  content?: string;
  html_content?: string;
  category?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Form {
  id: string;
  user_id: string;
  name: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'select';
    required: boolean;
    options?: string[];
  }>;
  settings: {
    type?: 'popup' | 'embedded' | 'landing';
    target_list?: string;
    status?: 'draft' | 'active';
    success_message?: string;
    redirect_url?: string;
    tracking_enabled?: boolean;
    submitted_contact_tags?: string[];
    last_submission_at?: string;
    last_submission_target_list?: string;
    last_submission_source?: string;
  };
  embed_code?: string;
  submissions_count: number;
  created_at: string;
  updated_at: string;
}

// Helper function for server-side operations
export function createClientServer() {
  return supabaseAdmin || supabase;
}