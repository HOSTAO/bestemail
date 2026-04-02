import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeHtml(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 100_000) : '';
}

export async function GET() {
  try {
    const user = await requireAuth();
    const campaigns = await db.getCampaigns(user.id);
    return NextResponse.json(campaigns);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized';
    const status = message === 'Unauthorized' ? 401 : message.includes('requires Supabase') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const name = trimString(body.name, 120);
    const subject = trimString(body.subject, 200);
    const content = trimString(body.content, 100_000);
    const htmlContent = normalizeHtml(body.html_content);
    const segmentId = typeof body.segment_id === 'string' && body.segment_id.trim() ? body.segment_id.trim() : undefined;

    // Support scheduled_at — if provided with a valid ISO date, allow status "scheduled"
    let scheduledAt: string | undefined;
    let status: string = 'draft';
    if (typeof body.scheduled_at === 'string' && body.scheduled_at.trim()) {
      const parsed = new Date(body.scheduled_at);
      if (!isNaN(parsed.getTime())) {
        scheduledAt = parsed.toISOString();
        status = 'scheduled';
      }
    }

    if (!name) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ error: 'Campaign subject is required' }, { status: 400 });
    }

    const campaign = await db.createCampaign(user.id, {
      name,
      subject,
      content,
      html_content: htmlContent || undefined,
      segment_id: segmentId,
      status,
      scheduled_at: scheduledAt,
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign:', error);
    const message = error instanceof Error ? error.message : 'Failed to create campaign';
    const status = message === 'Unauthorized' ? 401 : message.includes('requires Supabase') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
