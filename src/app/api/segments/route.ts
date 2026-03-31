import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-helpers';

const ALLOWED_FIELDS = new Set(['city', 'business_type', 'tag']);
const ALLOWED_OPERATORS = new Set(['equals', 'contains']);

export async function GET() {
  try {
    const user = await requireAuth();
    const segments = await db.getSegments(user.id);
    return NextResponse.json(segments);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load segments';
    const status = message === 'Unauthorized' ? 401 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const rules = Array.isArray(body.rules)
      ? body.rules
          .slice(0, 25)
          .map((rule: unknown) => {
            const item = (rule && typeof rule === 'object') ? rule as Record<string, unknown> : null;
            if (!item) return null;

            const field = typeof item.field === 'string' ? item.field.trim() : '';
            const operator = typeof item.operator === 'string' ? item.operator.trim() : 'equals';
            const value = typeof item.value === 'string' ? item.value.trim().slice(0, 120) : '';

            if (!ALLOWED_FIELDS.has(field) || !ALLOWED_OPERATORS.has(operator) || !value) {
              return null;
            }

            return { field, operator, value };
          })
          .filter(Boolean)
      : [];

    if (!name) {
      return NextResponse.json({ error: 'Segment name is required' }, { status: 400 });
    }

    if (rules.length === 0) {
      return NextResponse.json({ error: 'At least one valid rule is required' }, { status: 400 });
    }

    const segment = await db.createSegment(user.id, {
      name,
      rules,
    });

    return NextResponse.json(segment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create segment';
    const status = message === 'Unauthorized' ? 401 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
