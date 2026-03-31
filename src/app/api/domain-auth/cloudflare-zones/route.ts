import { NextRequest, NextResponse } from 'next/server';

const CF_API = 'https://api.cloudflare.com/client/v4';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body.cloudflare_token === 'string' ? body.cloudflare_token.trim() : '';

    if (!token) {
      return NextResponse.json({ error: 'Cloudflare API token is required' }, { status: 400 });
    }

    const res = await fetch(`${CF_API}/zones?per_page=50`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!data.success) {
      const msg = data.errors?.[0]?.message || 'Invalid token or Cloudflare API error';
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    const zones = (data.result || []).map((z: { id: string; name: string; status: string; plan?: { name?: string } }) => ({
      id: z.id,
      name: z.name,
      status: z.status,
      plan: z.plan?.name || 'Free',
    }));

    return NextResponse.json({ zones }, { status: 200 });
  } catch (error) {
    console.error('Cloudflare zones fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch Cloudflare zones' }, { status: 500 });
  }
}
