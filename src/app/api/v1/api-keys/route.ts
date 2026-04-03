import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { generateApiKey } from '@/lib/api-auth';
import { query } from '@/lib/postgres';

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonError('Invalid JSON body', 400);
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) {
      return jsonError('API key name is required', 400);
    }

    if (name.length > 255) {
      return jsonError('Name must be 255 characters or less', 400);
    }

    // Limit API keys per user
    const countResult = await query(
      `SELECT COUNT(*) as count FROM api_keys WHERE user_id = $1 AND is_active = true`,
      [user.id]
    );
    if (parseInt(countResult.rows[0].count, 10) >= 10) {
      return jsonError('Maximum of 10 active API keys allowed', 400);
    }

    const { plainKey, keyHash, keyPrefix } = generateApiKey();

    await query(
      `INSERT INTO api_keys (user_id, name, key_hash, key_prefix)
       VALUES ($1, $2, $3, $4)`,
      [user.id, name, keyHash, keyPrefix]
    );

    return NextResponse.json(
      {
        success: true,
        key: plainKey,
        name,
        prefix: keyPrefix,
        message: 'Store this key securely. It will not be shown again.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API keys POST error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create API key';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return jsonError(message, statusCode);
  }
}

export async function GET() {
  try {
    const user = await requireAuth();

    const result = await query(
      `SELECT id, name, key_prefix, is_active, last_used_at, created_at
       FROM api_keys
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ success: true, data: result.rows }, { status: 200 });
  } catch (error) {
    console.error('API keys GET error:', error);
    const message = error instanceof Error ? error.message : 'Failed to list API keys';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return jsonError(message, statusCode);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return jsonError('API key ID is required', 400);
    }

    const result = await query(
      `UPDATE api_keys SET is_active = false
       WHERE id = $1 AND user_id = $2
       RETURNING id, name`,
      [keyId, user.id]
    );

    if (result.rows.length === 0) {
      return jsonError('API key not found', 404);
    }

    return NextResponse.json(
      { success: true, message: `API key "${result.rows[0].name}" revoked` },
      { status: 200 }
    );
  } catch (error) {
    console.error('API keys DELETE error:', error);
    const message = error instanceof Error ? error.message : 'Failed to revoke API key';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return jsonError(message, statusCode);
  }
}
