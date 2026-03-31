import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAdmin } from '@/lib/auth';
import { runtimeConfig, getDataMode } from '@/lib/runtime-config';
import { loadSecureSettings } from '@/lib/secure-settings';

function isPlaceholder(value: string) {
  const normalized = value.toLowerCase();
  return !value || normalized.includes('[your-') || normalized.includes('your_') || normalized.includes('change-me') || normalized.includes('placeholder');
}

function isDefaultSendyUrl(value: string) {
  return !value || value === 'https://your-sendy-installation.com';
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const secureSettings = await loadSecureSettings(user.email);

    const checks = {
      sessionSecret: !!process.env.SESSION_SECRET && !isPlaceholder(process.env.SESSION_SECRET),
      supabaseUrl: !!runtimeConfig.supabaseUrl,
      supabaseAnonKey: !!runtimeConfig.supabaseAnonKey && !isPlaceholder(runtimeConfig.supabaseAnonKey),
      supabaseServiceRoleKey: !!runtimeConfig.supabaseServiceRoleKey && !isPlaceholder(runtimeConfig.supabaseServiceRoleKey),
      sendyApiUrl: !isDefaultSendyUrl(secureSettings.api_url),
      sendyApiKey: !!secureSettings.api_key && !isPlaceholder(secureSettings.api_key),
      sendyListId: !!secureSettings.list_id && !isPlaceholder(secureSettings.list_id),
      fromEmail: !!secureSettings.from_email,
      fromName: !!secureSettings.from_name,
    };

    const dataMode = getDataMode();
    const configReady = checks.sendyApiUrl && checks.sendyApiKey && checks.sendyListId;
    const databaseReady = checks.supabaseUrl && checks.supabaseAnonKey && checks.supabaseServiceRoleKey;
    const securityReady = checks.sessionSecret;

    return NextResponse.json({
      success: true,
      status: {
        nodeEnv: runtimeConfig.nodeEnv,
        dataMode,
        settingsSource: databaseReady ? 'database-capable' : 'environment-only',
        configReady,
        databaseReady,
        securityReady,
        overallReady: configReady && databaseReady && securityReady,
      },
      checks,
    });
  } catch (error) {
    console.error('System status error:', error);
    const message = error instanceof Error ? error.message : 'Failed to load system status';
    const status = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message === 'Unauthorized' || message === 'Invalid session' ? 'Unauthorized' : 'Failed to load system status' }, { status });
  }
}
