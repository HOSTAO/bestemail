import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export async function GET(request: NextRequest) {
  try {
    const rows = await query(
      "SELECT key, value FROM settings WHERE key IN ('sendy_api_url','sendy_api_key','sendy_list_id','sendy_brand_id')"
    );
    const settings: Record<string, string> = {};
    rows.rows.forEach((r: { key: string; value: string }) => { settings[r.key] = r.value; });

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
      });
    }

    const resp = await fetch(`${apiUrl}/api/subscribers/active-subscriber-count.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ api_key: apiKey, list_id: listId }),
    });
    const text = await resp.text();
    return NextResponse.json({ ok: true, sendy_response: text });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to test Sendy' }, { status: 500 });
  }
}
