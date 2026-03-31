import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';
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
        .slice(0, 20)
    )
  );
}

export async function GET() {
  try {
    const user = await requireAuth();
    const contacts = await db.getContacts(user.id);
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const contact = await db.createContact(user.id, {
      email,
      name: typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '',
      city: typeof body.city === 'string' ? body.city.trim().slice(0, 80) : '',
      business_type: typeof body.businessType === 'string' ? body.businessType.trim().slice(0, 80) : '',
      tags: normalizeTags(body.tags),
    });

    try {
      const syncResult = await addSubscriberToSendy({
        email,
        name: typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '',
        userId: user.email,
      });

      if (!syncResult.ok && syncResult.reason && syncResult.reason !== 'config_missing') {
        console.error('Sendy sync failed:', syncResult.text);
      }
    } catch (sendyError) {
      console.error('Sendy sync failed:', sendyError);
    }

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Failed to create contact:', error);
    const message = error instanceof Error ? error.message : 'Failed to create contact';
    const status = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
