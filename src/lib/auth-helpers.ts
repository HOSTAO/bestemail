import { cookies } from 'next/headers';
import { validateSession } from './auth';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('session_id')?.value ||
    cookieStore.get('auth-token')?.value ||
    cookieStore.get('be_session')?.value;

  if (!sessionToken) return null;

  return validateSession(sessionToken);
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
