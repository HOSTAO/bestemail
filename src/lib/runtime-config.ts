const env = process.env.NODE_ENV || 'development';

function readFirstEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function isConfiguredValue(value: string) {
  const normalized = value.toLowerCase();
  return !!value && !normalized.includes('[your-') && !normalized.includes('your_') && !normalized.includes('placeholder') && !normalized.includes('change-me');
}

function readConfiguredEnv(...keys: string[]) {
  const value = readFirstEnv(...keys);
  return isConfiguredValue(value) ? value : '';
}

function isValidUrl(value: string) {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const runtimeConfig = {
  nodeEnv: env,
  isProduction: env === 'production',
  supabaseUrl: isValidUrl(readConfiguredEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL')) ? readConfiguredEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL') : '',
  supabaseAnonKey: readFirstEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: readFirstEnv('SUPABASE_SERVICE_ROLE_KEY'),
  sendyApiUrl: readFirstEnv('SENDY_API_URL', 'NEXT_PUBLIC_SENDY_API_URL'),
  sendyApiKey: readFirstEnv('SENDY_API_KEY'),
  sendyListId: readFirstEnv('SENDY_LIST_ID'),
  sendyBrandId: readFirstEnv('SENDY_BRAND_ID') || '1',
  defaultFromEmail: readFirstEnv('DEFAULT_FROM_EMAIL') || 'hello@bestemail.in',
  defaultFromName: readFirstEnv('DEFAULT_FROM_NAME') || 'Bestemail',
  instasentApiToken: readFirstEnv('INSTASENT_API_TOKEN', 'NEXT_PUBLIC_INSTASENT_API_TOKEN'),
  allowLocalDataFallback:
    env !== 'production' || process.env.ALLOW_LOCAL_DATA_FALLBACK === 'true',
};

export function getDataMode() {
  if (runtimeConfig.supabaseUrl && runtimeConfig.supabaseServiceRoleKey) {
    return 'supabase';
  }

  if (runtimeConfig.allowLocalDataFallback) {
    return 'local';
  }

  return 'unconfigured';
}

export function assertDataWriteAllowed(feature: string) {
  if (getDataMode() === 'unconfigured') {
    throw new Error(
      `${feature} requires Supabase in production. Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL), NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY, or explicitly enable ALLOW_LOCAL_DATA_FALLBACK=true.`
    );
  }
}
