import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { query } from './postgres';

export type ApiKeyUser = {
  id: string;
  userId: string;
  keyName: string;
};

function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export function generateApiKey(): { plainKey: string; keyHash: string; keyPrefix: string } {
  const randomHex = crypto.randomBytes(16).toString('hex');
  const plainKey = `be_live_${randomHex}`;
  const keyHash = hashApiKey(plainKey);
  const keyPrefix = plainKey.slice(0, 12);
  return { plainKey, keyHash, keyPrefix };
}

export async function validateApiKey(
  request: NextRequest
): Promise<{ userId: string; keyId: string; keyName: string } | null> {
  const authHeader = request.headers.get('authorization');
  const xApiKey = request.headers.get('x-api-key');

  let apiKey: string | null = null;

  if (authHeader?.startsWith('Bearer be_')) {
    apiKey = authHeader.slice(7);
  } else if (xApiKey?.startsWith('be_')) {
    apiKey = xApiKey;
  }

  if (!apiKey) {
    return null;
  }

  const keyHash = hashApiKey(apiKey);

  try {
    const result = await query(
      `SELECT id, user_id, name FROM api_keys
       WHERE key_hash = $1 AND is_active = true`,
      [keyHash]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    // Update last_used_at in the background (fire-and-forget)
    query(
      `UPDATE api_keys SET last_used_at = NOW() WHERE id = $1`,
      [row.id]
    ).catch(() => {});

    return {
      userId: row.user_id,
      keyId: row.id,
      keyName: row.name,
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return null;
  }
}
