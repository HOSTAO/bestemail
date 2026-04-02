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
    const validStatuses = ['draft', 'scheduled', 'sending', 'sent'];
    const status = validStatuses.includes(body.status) ? body.status : 'draft';
    let scheduledAt: string | null = null;
    if (typeof body.scheduled_at === 'string' && body.scheduled_at.trim()) {
      const parsed = new Date(body.scheduled_at);
      scheduledAt = !isNaN(parsed.getTime()) ? parsed.toISOString() : null;
    }

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

    const updates: Record<string, unknown> = {
      name: existing.name,
      subject: existing.subject,
      content: existing.content,
      html_content: existing.html_content,
      segment_id: existing.segment_id,
      status: existing.status,
      scheduled_at: existing.scheduled_at,
    };

    if (body.name !== undefined) updates.name = trimString(body.name, 120) || existing.name;
    if (body.subject !== undefined) updates.subject = trimString(body.subject, 200) || existing.subject;
    if (body.content !== undefined) updates.content = trimString(body.content, 100_000);
    if (body.html_content !== undefined) updates.html_content = normalizeHtml(body.html_content) || null;
    if (body.segment_id !== undefined) updates.segment_id = body.segment_id || null;
    if (body.status !== undefined) {
      const valid = ['draft', 'scheduled', 'sending', 'sent'];
      if (valid.includes(body.status)) updates.status = body.status;
    }
    if (body.scheduled_at !== undefined) {
      if (body.scheduled_at) {
        const parsed = new Date(body.scheduled_at);
        updates.scheduled_at = !isNaN(parsed.getTime()) ? parsed.toISOString() : null;
      } else {
        updates.scheduled_at = null;
      }
    }

    const campaign = await db.updateCampaign(user.id, id, updates);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to patch campaign:', error);
    const message = error instanceof Error ? error.message : 'Failed to update campaign';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await context.params;

    const existing = await db.getCampaign(user.id, id);
    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    await db.deleteCampaign(user.id, id);
    return NextResponse.json({ message: 'Campaign deleted' });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete campaign';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
