import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAdmin } from '@/lib/auth';
import { saveSecureSettings, getSecureSettingsForClient, loadSecureSettings, validateSendyCredentials } from '@/lib/secure-settings';
import { sanitizeInput } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const result = await getSecureSettingsForClient(user.email);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    const message = error instanceof Error ? error.message : 'Failed to load settings';
    const status = message === 'Unauthorized' || message === 'Invalid session' ? 401 : 500;
    return NextResponse.json({ error: message === 'Unauthorized' || message === 'Invalid session' ? 'Unauthorized' : 'Failed to load settings' }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const existing = await loadSecureSettings(user.email);
    const settings = {
      api_url: sanitizeInput(body.api_url || ''),
      api_key: body.api_key?.trim() || existing.api_key || '',
      list_id: sanitizeInput(body.list_id || ''),
      brand_id: sanitizeInput(body.brand_id || '1'),
      from_email: sanitizeInput(body.from_email || ''),
      from_name: sanitizeInput(body.from_name || ''),
    };

    if (!settings.api_url || !settings.api_key || !settings.list_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
      new URL(settings.api_url);
    } catch {
      return NextResponse.json({ error: 'Invalid API URL format' }, { status: 400 });
    }

    await saveSecureSettings(user.email, settings);

    return NextResponse.json({
      success: true,
      message: 'Settings saved securely',
    });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to save settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const existing = await loadSecureSettings(user.email);
    const api_url = typeof body.api_url === 'string' ? body.api_url.trim() : '';
    const api_key = typeof body.api_key === 'string' && body.api_key.trim() ? body.api_key.trim() : existing.api_key;
    const list_id = typeof body.list_id === 'string' ? body.list_id.trim() : '';

    if (!api_url || !api_key || !list_id) {
      return NextResponse.json({ success: false, message: 'API URL, API key, and list ID are required for a real connection test.' }, { status: 400 });
    }

    const result = await validateSendyCredentials({ api_url, api_key, list_id });

    return NextResponse.json({ success: result.valid, message: result.message }, { status: result.valid ? 200 : 400 });
  } catch (error) {
    console.error('Settings test error:', error);
    return NextResponse.json({ error: 'Connection test failed' }, { status: 500 });
  }
}
