import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeHtml(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 100_000) : '';
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const campaign = await db.getCampaign(user.id, id);

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to load campaign:', error);
    const message = error instanceof Error ? error.message : 'Failed to load campaign';
    const status = message === 'Unauthorized' ? 401 : message.includes('requires Supabase') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;
    const body = await request.json();

    const name = trimString(body.name, 120);
    const subject = trimString(body.subject, 200);
    const content = trimString(body.content, 100_000);
    const htmlContent = normalizeHtml(body.html_content);
    const segmentId = typeof body.segment_id === 'string' && body.segment_id.trim() ? body.segment_id.trim() : undefined;
    const status = body.status === 'draft' ? 'draft' : 'draft';
    const scheduledAt = typeof body.scheduled_at === 'string' && body.scheduled_at.trim() ? body.scheduled_at.trim() : null;

    if (!name) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ error: 'Campaign subject is required' }, { status: 400 });
    }

    const campaign = await db.updateCampaign(user.id, id, {
      name,
      subject,
      content,
      html_content: htmlContent || undefined,
      segment_id: segmentId,
      status,
      scheduled_at: scheduledAt,
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to update campaign:', error);
    const message = error instanceof Error ? error.message : 'Failed to update campaign';
    const status = message === 'Unauthorized' ? 401 : message.includes('requires Supabase') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
