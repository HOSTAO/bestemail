import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

const ALLOWED_TYPES = new Set(['popup', 'embedded', 'landing']);

export async function GET() {
  try {
    const user = await requireAuth();
    const forms = await db.getForms(user.id);
    return NextResponse.json(forms);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load forms';
    const status = message === 'Unauthorized' ? 401 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const type = typeof body.type === 'string' ? body.type.trim() : 'embedded';
    const targetList = typeof body.targetList === 'string' ? body.targetList.trim() : 'main';
    const redirectUrl = typeof body.redirectUrl === 'string' ? body.redirectUrl.trim() : '';
    const status = body.status === 'active' ? 'active' : 'draft';

    if (!name) {
      return NextResponse.json({ error: 'Form name is required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });
    }

    if (redirectUrl) {
      try {
        new URL(redirectUrl);
      } catch {
        return NextResponse.json({ error: 'Redirect URL must be a valid absolute URL' }, { status: 400 });
      }
    }

    const form = await db.createForm(user.id, {
      name,
      type: type as 'popup' | 'embedded' | 'landing',
      targetList: targetList || 'main',
      status,
      settings: {
        success_message: typeof body.successMessage === 'string' && body.successMessage.trim()
          ? body.successMessage.trim()
          : 'Thanks for signing up.',
        redirect_url: redirectUrl || undefined,
      },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create form';
    const status = message === 'Unauthorized' ? 401 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
