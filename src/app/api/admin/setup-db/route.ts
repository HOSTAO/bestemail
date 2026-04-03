import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export async function POST() {
  try {
    const result = await query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'");

    // Create api_keys table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        key_hash VARCHAR(255) NOT NULL,
        key_prefix VARCHAR(10) NOT NULL,
        last_used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
      );
    `);
    await query(`CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);`);

    return NextResponse.json({ success: true, tables: result.rows[0].count });
  } catch (error) {
    return NextResponse.json({ error: 'DB check failed' }, { status: 500 });
  }
}
