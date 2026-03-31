import { NextResponse } from 'next/server';

/**
 * Check if a Supabase/PostgreSQL error indicates a missing table
 * (migration not yet run).
 */
export function isMigrationPending(error: unknown): boolean {
  if (!error) return false;
  const msg = typeof error === 'object' && error !== null
    ? (error as Record<string, unknown>).message || (error as Record<string, unknown>).msg || String(error)
    : String(error);
  const str = String(msg).toLowerCase();
  const code = typeof error === 'object' && error !== null
    ? String((error as Record<string, unknown>).code || '')
    : '';
  return (str.includes('relation') && str.includes('does not exist')) || code === '42P01';
}

const MIGRATION_RESPONSE_BODY = {
  error: 'migration_pending',
  message: 'Database migration required. Run migration 005 in Supabase SQL Editor.',
  migrationRequired: true,
};

export function migrationPendingResponse(headers?: Record<string, string>) {
  return NextResponse.json(MIGRATION_RESPONSE_BODY, {
    status: 503,
    ...(headers ? { headers } : {}),
  });
}
