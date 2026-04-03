import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { query } from '@/lib/postgres';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function trimString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const auth = await validateApiKey(request);
    if (!auth) {
      return jsonError('Invalid or missing API key', 401);
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email || !isValidEmail(email)) {
      return jsonError('A valid email is required', 400);
    }

    const firstName = trimString(body.first_name, 120);
    const lastName = trimString(body.last_name, 120);
    const phone = trimString(body.phone, 30);
    const company = trimString(body.company, 200);
    const source = trimString(body.source, 100) || 'api';
    const customFields =
      typeof body.custom_fields === 'object' && body.custom_fields !== null
        ? body.custom_fields
        : {};

    const result = await query(
      `INSERT INTO subscribers (user_id, email, first_name, last_name, phone, company, source, custom_fields, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active')
       ON CONFLICT (user_id, email)
       DO UPDATE SET
         first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), subscribers.first_name),
         last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), subscribers.last_name),
         phone = COALESCE(NULLIF(EXCLUDED.phone, ''), subscribers.phone),
         company = COALESCE(NULLIF(EXCLUDED.company, ''), subscribers.company),
         source = COALESCE(NULLIF(EXCLUDED.source, ''), subscribers.source),
         custom_fields = subscribers.custom_fields || EXCLUDED.custom_fields,
         updated_at = NOW()
       RETURNING *`,
      [auth.userId, email, firstName, lastName, phone, company, source, JSON.stringify(customFields)]
    );

    const subscriber = result.rows[0];

    // Handle tags if provided
    const tags = Array.isArray(body.tags) ? body.tags.filter((t: unknown) => typeof t === 'string' && t.trim()) : [];
    if (tags.length > 0 && subscriber) {
      for (const tagName of tags) {
        try {
          // Find or create tag
          const tagResult = await query(
            `INSERT INTO tags (user_id, name) VALUES ($1, $2)
             ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            [auth.userId, tagName.trim()]
          );
          const tagId = tagResult.rows[0]?.id;
          if (tagId) {
            await query(
              `INSERT INTO subscriber_tags (subscriber_id, tag_id) VALUES ($1, $2)
               ON CONFLICT (subscriber_id, tag_id) DO NOTHING`,
              [subscriber.id, tagId]
            );
          }
        } catch (tagError) {
          console.error('Failed to assign tag:', tagName, tagError);
        }
      }
    }

    return NextResponse.json({ success: true, subscriber }, { status: 201 });
  } catch (error) {
    console.error('API v1 POST /subscribers error:', error);
    return jsonError('Internal server error', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await validateApiKey(request);
    if (!auth) {
      return jsonError('Invalid or missing API key', 401);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10) || 100, 1000);

    const conditions: string[] = ['user_id = $1'];
    const params: any[] = [auth.userId];
    let paramIndex = 2;

    if (search) {
      conditions.push(
        `(email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`
      );
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status && ['active', 'unsubscribed', 'bounced', 'complained'].includes(status)) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    params.push(limit);

    const sql = `SELECT * FROM subscribers
      WHERE ${conditions.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${paramIndex}`;

    const result = await query(sql, params);

    return NextResponse.json({ success: true, data: result.rows }, { status: 200 });
  } catch (error) {
    console.error('API v1 GET /subscribers error:', error);
    return jsonError('Internal server error', 500);
  }
}
