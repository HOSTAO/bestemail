import { NextRequest, NextResponse } from 'next/server';
import { addSubscriberToSendy } from '@/lib/sendy';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

const MAX_CSV_SIZE = 512_000;
const MAX_CONTACTS = 5000;

function parseCsv(csv: string) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cols[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const csv = String(body.csv || '');
    const syncToSendy = Boolean(body.syncToSendy);

    if (!csv.trim()) {
      return NextResponse.json({ error: 'CSV content required' }, { status: 400 });
    }

    if (csv.length > MAX_CSV_SIZE) {
      return NextResponse.json({ error: 'CSV payload is too large for MVP import' }, { status: 413 });
    }

    const rows = parseCsv(csv).slice(0, MAX_CONTACTS);
    const contacts = rows
      .map((row) => {
        const email = (row.email || row.mail || '').trim().toLowerCase();
        if (!email || !isValidEmail(email)) return null;

        return {
          email,
          name: (row.name || '').trim().slice(0, 120),
          city: (row.city || '').trim().slice(0, 80),
          business_type: (row.businesstype || row.business_type || '').trim().slice(0, 80),
          tags: Array.from(new Set(
            (row.tags || '')
              .split('|')
              .map((t) => t.trim().slice(0, 50))
              .filter(Boolean)
              .slice(0, 20)
          )),
        };
      })
      .filter(Boolean) as Array<{ email: string; name: string; city: string; business_type: string; tags: string[] }>;

    if (contacts.length === 0) {
      return NextResponse.json({ error: 'No valid contacts found in CSV' }, { status: 400 });
    }

    const imported = await db.importContacts(user.id, contacts);
    let sendySynced = 0;

    if (syncToSendy) {
      for (const contact of contacts) {
        try {
          const res = await addSubscriberToSendy({ email: contact.email, name: contact.name, userId: user.email });
          if (res.ok) sendySynced += 1;
        } catch {
          // best-effort sync only
        }
      }
    }

    return NextResponse.json({ imported, sendySynced, skipped: rows.length - contacts.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import contacts';
    const status = message === 'Unauthorized' ? 401 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
