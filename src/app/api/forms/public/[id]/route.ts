import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addSubscriberToSendy } from '@/lib/sendy';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeTags(input: unknown) {
  if (!Array.isArray(input)) {
    return [] as string[];
  }

  return Array.from(
    new Set(
      input
        .map((tag: unknown) => String(tag).trim().slice(0, 50))
        .filter(Boolean)
        .slice(0, 10)
    )
  );
}

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const form = await db.getPublicForm(id);

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const settings = ('settings' in form && form.settings) ? form.settings : {};
    const fields = Array.isArray(form.fields) ? form.fields : [];

    return NextResponse.json({
      id: form.id,
      name: form.name,
      type: ('type' in form && form.type) || (typeof settings.type === 'string' ? settings.type : 'embedded'),
      fields,
      targetList: ('targetList' in form && form.targetList) || (typeof settings.target_list === 'string' ? settings.target_list : 'main'),
      successMessage: typeof settings.success_message === 'string'
        ? settings.success_message
        : (typeof settings.successMessage === 'string' ? settings.successMessage : 'Thanks for signing up.'),
      redirectUrl: typeof settings.redirect_url === 'string'
        ? settings.redirect_url
        : (typeof settings.redirectUrl === 'string' ? settings.redirectUrl : ''),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load public form';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const result = await db.submitPublicForm(id, {
      email,
      name: typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '',
      city: typeof body.city === 'string' ? body.city.trim().slice(0, 80) : '',
      businessType: typeof body.businessType === 'string' ? body.businessType.trim().slice(0, 80) : '',
      tags: normalizeTags(body.tags),
    });

    if (!result) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    try {
      await addSubscriberToSendy({
        email,
        name: typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '',
        userId: result.ownerUserId,
      });
    } catch (sendyError) {
      console.error('Public form Sendy sync failed:', sendyError);
    }

    return NextResponse.json({
      ok: true,
      formId: result.formId,
      targetList: result.targetList,
      redirectUrl: result.redirectUrl,
      successMessage: result.successMessage,
      contact: {
        id: result.contact.id,
        email: result.contact.email,
        name: ('name' in result.contact && typeof result.contact.name === 'string') ? result.contact.name : '',
      },
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit form';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
