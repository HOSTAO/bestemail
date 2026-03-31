import { createSession as createSignedSession, type AuthUser, validateCredentials as validatePrimaryCredentials } from './auth';

export function validateCredentials(email: string, password: string) {
  return validatePrimaryCredentials(email, password);
}

export async function createSession(user: AuthUser) {
  const session = await createSignedSession(user);
  return {
    token: session.token,
    user,
  };
}
