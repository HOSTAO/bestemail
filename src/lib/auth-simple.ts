import { createSession as createSignedSession, validateCredentials as validatePrimaryCredentials, validateSession as validateSignedSession, type AuthUser } from './auth';

export function validateCredentials(email: string, password: string) {
  return validatePrimaryCredentials(email, password);
}

export async function createSession(user: AuthUser) {
  const session = await createSignedSession(user);
  return session.token;
}

export async function validateSession(sessionId: string) {
  const user = await validateSignedSession(sessionId);

  if (!user) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function deleteSession(_sessionId?: string) {
  return;
}

export async function isAuthenticated(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId) return false;
  return (await validateSession(sessionId)) !== null;
}
