import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get settings from DB
    const { data: rows } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['sendy_api_url', 'sendy_api_key', 'sendy_list_id', 'sendy_brand_id']);

    const settings: Record<string, string> = {};
    (rows || []).forEach((r: { key: string; value: string }) => { settings[r.key] = r.value; });

    const apiUrl = settings.sendy_api_url || process.env.SENDY_API_URL || '';
    const apiKey = settings.sendy_api_key || process.env.SENDY_API_KEY || '';
    const listId = settings.sendy_list_id || process.env.SENDY_LIST_ID || '';

    if (!apiUrl || !apiKey || !listId) {
      return NextResponse.json({
        ok: false,
        reason: 'missing_config',
        apiUrl: apiUrl ? '✅ set' : '❌ missing',
        apiKey: apiKey ? '✅ set' : '❌ missing',
        listId: listId ? '✅ set' : '❌ missing',
        db_settings: settings,
        env_apiUrl: process.env.SENDY_API_URL ? '✅ set' : '❌ missing',
        env_apiKey: process.env.SENDY_API_KEY ? '✅ set' : '❌ missing',
        env_listId: process.env.SENDY_LIST_ID ? '✅ set' : '❌ missing',
      });
    }

    // Test Sendy connection
    const url = `${apiUrl.replace(/\/+$/, '')}/api/subscribers/active-subscriber-count.php`;
    const body = new URLSearchParams({ api_key: apiKey, list_id: listId });
    const res = await fetch(url, { method: 'POST', body });
    const text = await res.text();

    return NextResponse.json({
      ok: !isNaN(Number(text.trim())),
      apiUrl: apiUrl,
      listId: listId,
      sendyResponse: text.trim(),
      httpStatus: res.status,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
