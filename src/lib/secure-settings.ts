import { createClient } from '@supabase/supabase-js';
import { encrypt, decrypt } from './security';
import { runtimeConfig } from './runtime-config';

interface SecureSettings {
  sendy_api_url: string;
  sendy_api_key_encrypted: string;
  sendy_list_id: string;
  sendy_brand_id: string;
  default_from_email: string;
  default_from_name: string;
}

interface SecureSettingsInput {
  api_url: string;
  api_key: string;
  list_id: string;
  brand_id?: string;
  from_email: string;
  from_name: string;
}

function getEnvBackedSettings() {
  return {
    api_url: runtimeConfig.sendyApiUrl || '',
    api_key: runtimeConfig.sendyApiKey || '',
    list_id: runtimeConfig.sendyListId || '',
    brand_id: runtimeConfig.sendyBrandId || '1',
    from_email: runtimeConfig.defaultFromEmail,
    from_name: runtimeConfig.defaultFromName,
  };
}

function getAdminClient() {
  if (!runtimeConfig.supabaseUrl || !runtimeConfig.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(runtimeConfig.supabaseUrl, runtimeConfig.supabaseServiceRoleKey);
}

export async function saveSecureSettings(userId: string, settings: SecureSettingsInput) {
  const supabase = getAdminClient();

  if (!supabase) {
    throw new Error('Supabase admin configuration is required to save settings');
  }

  const secureSettings: SecureSettings = {
    sendy_api_url: settings.api_url,
    sendy_api_key_encrypted: encrypt(settings.api_key),
    sendy_list_id: settings.list_id,
    sendy_brand_id: settings.brand_id || '1',
    default_from_email: settings.from_email,
    default_from_name: settings.from_name,
  };

  const { error } = await supabase.from('settings').upsert({
    user_id: userId,
    ...secureSettings,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return true;
}

export async function loadSecureSettings(userId: string) {
  const fallback = getEnvBackedSettings();
  const supabase = getAdminClient();

  if (!supabase) {
    return fallback;
  }

  const { data: settings, error } = await supabase.from('settings').select('*').eq('user_id', userId).single();

  if (error || !settings) {
    return fallback;
  }

  return {
    api_url: settings.sendy_api_url || fallback.api_url,
    api_key: settings.sendy_api_key_encrypted ? decrypt(settings.sendy_api_key_encrypted) : fallback.api_key,
    list_id: settings.sendy_list_id || fallback.list_id,
    brand_id: settings.sendy_brand_id || '1',
    from_email: settings.default_from_email || fallback.from_email,
    from_name: settings.default_from_name || fallback.from_name,
  };
}

export async function getSecureSettingsForClient(userId: string) {
  const fallback = getEnvBackedSettings();
  const settings = await loadSecureSettings(userId);
  const source = runtimeConfig.supabaseUrl && runtimeConfig.supabaseServiceRoleKey ? 'database' : 'environment';

  return {
    settings: {
      api_url: settings.api_url,
      api_key: '',
      has_api_key: !!settings.api_key,
      list_id: settings.list_id,
      brand_id: settings.brand_id,
      from_email: settings.from_email,
      from_name: settings.from_name,
      using_env_defaults: source === 'environment' && settings.api_url === fallback.api_url && settings.list_id === fallback.list_id,
    },
    source,
  };
}

export async function validateSendyCredentials(settings: Pick<SecureSettingsInput, 'api_url' | 'api_key' | 'list_id'>): Promise<{ valid: boolean; message: string }> {
  try {
    const formData = new URLSearchParams({
      api_key: settings.api_key,
      list_id: settings.list_id,
    });

    const response = await fetch(`${settings.api_url}/api/subscribers/active-subscriber-count.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    const text = await response.text();
    const count = parseInt(text);

    if (!isNaN(count)) {
      return {
        valid: true,
        message: `Connected successfully! ${count} active subscribers found.`,
      };
    }

    if (text.includes('Invalid API key')) {
      return { valid: false, message: 'Invalid API key' };
    }

    if (text.includes('List does not exist')) {
      return { valid: false, message: 'List ID not found' };
    }

    return { valid: false, message: 'Connection failed' };
  } catch {
    return { valid: false, message: 'Network error' };
  }
}
