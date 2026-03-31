import { NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export async function POST() {
  try {
    const result = await query("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'");
    return NextResponse.json({ success: true, tables: result.rows[0].count });
  } catch (error) {
    return NextResponse.json({ error: 'DB check failed' }, { status: 500 });
  }
}
