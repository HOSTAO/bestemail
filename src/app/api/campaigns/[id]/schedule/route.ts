import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await request.json();

    const existing = await db.getCampaign(user.id, id);
    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (!body.scheduled_at || typeof body.scheduled_at !== 'string') {
      return NextResponse.json({ error: 'scheduled_at (ISO timestamp) is required' }, { status: 400 });
    }

    const parsed = new Date(body.scheduled_at);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for scheduled_at' }, { status: 400 });
    }

    if (parsed.getTime() < Date.now()) {
      return NextResponse.json({ error: 'scheduled_at must be in the future' }, { status: 400 });
    }

    const campaign = await db.updateCampaign(user.id, id, {
      ...existing,
      status: 'scheduled',
      scheduled_at: parsed.toISOString(),
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to schedule campaign:', error);
    const message = error instanceof Error ? error.message : 'Failed to schedule campaign';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
