// @ts-nocheck
// Supabase removed — using direct PostgreSQL
const createClient = () => null;
import { runtimeConfig } from './runtime-config';
import { decrypt } from './security';

export interface SendySettings {
  apiUrl: string;
  apiKey: string;
  listId: string;
  brandId: string;
  fromEmail: string;
  fromName: string;
}

function envSendySettings(): SendySettings {
  return {
    apiUrl: runtimeConfig.sendyApiUrl || '',
    apiKey: runtimeConfig.sendyApiKey || '',
    listId: runtimeConfig.sendyListId || '',
    brandId: runtimeConfig.sendyBrandId || '1',
    fromEmail: runtimeConfig.defaultFromEmail,
    fromName: runtimeConfig.defaultFromName,
  };
}

function extractApiKey(settings: Record<string, unknown>) {
  const encrypted = typeof settings.sendy_api_key_encrypted === 'string' ? settings.sendy_api_key_encrypted : '';
  const plaintext = typeof settings.sendy_api_key === 'string' ? settings.sendy_api_key : '';

  if (encrypted) {
    try {
      return decrypt(encrypted);
    } catch {
      return plaintext;
    }
  }

  return plaintext;
}

function mapSettings(settings: Record<string, unknown>): SendySettings {
  const fallback = envSendySettings();

  return {
    apiUrl: typeof settings.sendy_api_url === 'string' && settings.sendy_api_url ? settings.sendy_api_url : fallback.apiUrl,
    apiKey: extractApiKey(settings),
    listId: typeof settings.sendy_list_id === 'string' && settings.sendy_list_id ? settings.sendy_list_id : fallback.listId,
    brandId: typeof settings.sendy_brand_id === 'string' && settings.sendy_brand_id ? settings.sendy_brand_id : '1',
    fromEmail: typeof settings.default_from_email === 'string' && settings.default_from_email ? settings.default_from_email : fallback.fromEmail,
    fromName: typeof settings.default_from_name === 'string' && settings.default_from_name ? settings.default_from_name : fallback.fromName,
  };
}

export async function getSendySettings(userId?: string): Promise<SendySettings> {
  if (userId && runtimeConfig.supabaseUrl && runtimeConfig.supabaseAnonKey) {
    try {
      const supabase = createClient(runtimeConfig.supabaseUrl, runtimeConfig.supabaseAnonKey);
      const { data: settings } = await supabase.from('settings').select('*').eq('user_id', userId).single();

      if (settings) {
        const mapped = mapSettings(settings as Record<string, unknown>);
        if (mapped.apiKey && mapped.listId) {
          return mapped;
        }
      }
    } catch (error) {
      console.error('Error loading settings from database:', error);
    }
  }

  return envSendySettings();
}

export async function getSendySettingsServer(userId?: string): Promise<SendySettings> {
  if (userId && runtimeConfig.supabaseUrl && runtimeConfig.supabaseServiceRoleKey) {
    try {
      const supabase = createClient(runtimeConfig.supabaseUrl, runtimeConfig.supabaseServiceRoleKey);
      const { data: settings } = await supabase.from('settings').select('*').eq('user_id', userId).single();

      if (settings) {
        const mapped = mapSettings(settings as Record<string, unknown>);
        if (mapped.apiKey && mapped.listId) {
          return mapped;
        }
      }
    } catch (error) {
      console.error('Error loading settings from database (server):', error);
    }
  }

  return envSendySettings();
}
