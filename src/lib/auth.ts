import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { createClientServer } from './supabase';
import { readDb } from './store';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function readEnv(key: string) {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

function hasRealValue(value: string) {
  const normalized = value.toLowerCase();
  return !!value && !normalized.includes('change-me') && !normalized.includes('[your-') && !normalized.includes('your_');
}

function readAdminEmail() {
  const primary = readEnv('ADMIN_EMAIL') || readEnv('BESTEMAIL_ADMIN_EMAIL');
  if (primary) return primary.toLowerCase();

  const list = readEnv('ADMIN_EMAILS');
  if (list) {
    const first = list.split(',').map((item) => item.trim().toLowerCase()).find(Boolean);
    if (first) return first;
  }

  return '';
}

const ADMIN_EMAIL = readAdminEmail();
const ADMIN_PASSWORD = readEnv('ADMIN_PASSWORD') || readEnv('BESTEMAIL_ADMIN_PASSWORD');
const SESSION_SECRET = readEnv('SESSION_SECRET') || readEnv('AUTH_SECRET');
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export type AuthUser = {
  id: string;
  email: string;
  role: 'admin' | 'super_admin' | 'member';
  name: string;
};

type SessionPayload = {
  v: 1;
  sub: string;
  email: string;
  role: AuthUser['role'];
  name: string;
  exp: number;
};

type StoredUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'member' | 'super_admin' | 'user';
  password_hash?: string;
  passwordHash?: string;
  password?: string;
};

function assertSessionSecretConfigured() {
  if (!hasRealValue(SESSION_SECRET)) {
    throw new Error(IS_PRODUCTION ? 'SESSION_SECRET is not configured' : 'SESSION_SECRET is not configured. Set SESSION_SECRET before using auth.');
  }
}

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value: string) {
  assertSessionSecretConfigured();
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function serializeSession(user: AuthUser, expiresAt: Date) {
  const payload: SessionPayload = {
    v: 1,
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    exp: expiresAt.getTime(),
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function parseSession(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  let expectedSignature = '';
  try {
    expectedSignature = sign(encodedPayload);
  } catch {
    return null;
  }

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;

    if (payload.v !== 1 || !payload.email || !payload.sub || !payload.exp) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function normalizeStoredUser(user: StoredUser | null | undefined): AuthUser | null {
  if (!user?.id || !user.email) {
    return null;
  }

  return {
    id: user.id,
    email: user.email.toLowerCase(),
    role: user.role === 'super_admin' ? 'super_admin' : user.role === 'admin' ? 'admin' : 'member',
    name: user.name?.trim() || user.email.split('@')[0],
  };
}

async function findStoredUserByEmail(email: string): Promise<StoredUser | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const client = createClientServer();

  if (client) {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data as StoredUser;
    }
  }

  const localUser = readDb().users.find((user) => user.email === normalizedEmail);
  return localUser || null;
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function validateCredentials(email: string, password: string): Promise<AuthUser | null> {
  const normalizedEmail = email.toLowerCase().trim();

  if (ADMIN_EMAIL && ADMIN_PASSWORD && normalizedEmail === ADMIN_EMAIL) {
    if (!verifyPassword(password, hashPassword(ADMIN_PASSWORD))) {
      return null;
    }

    return {
      id: 'admin-1',
      email: ADMIN_EMAIL,
      role: 'super_admin',
      name: 'Bestemail Admin',
    };
  }

  const storedUser = await findStoredUserByEmail(normalizedEmail);
  if (!storedUser) {
    return null;
  }

  const passwordHash = storedUser.password_hash || storedUser.passwordHash || storedUser.password;
  if (!passwordHash || !verifyPassword(password, passwordHash)) {
    return null;
  }

  return normalizeStoredUser(storedUser);
}

export async function createSession(user: AuthUser) {
  assertSessionSecretConfigured();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const token = serializeSession(user, expiresAt);
  return { token, expiresAt };
}

export async function validateSession(token: string): Promise<AuthUser | null> {
  const payload = parseSession(token);

  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name,
  };
}

export function createSessionToken(userId: string, email: string): string {
  assertSessionSecretConfigured();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  return serializeSession(
    {
      id: userId,
      email: email.toLowerCase(),
      role: 'member',
      name: email.split('@')[0],
    },
    expiresAt,
  );
}

export function verifySessionToken(token: string) {
  return parseSession(token);
}

export async function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const token = tokenFromHeader
    || request.cookies.get('session_id')?.value
    || request.cookies.get('auth-token')?.value
    || request.cookies.get('be_session')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const user = await validateSession(token);

  if (!user) {
    throw new Error('Invalid session');
  }

  return user;
}

export function isAdmin(user: AuthUser | null | undefined): boolean {
  return user?.role === 'admin' || user?.role === 'super_admin';
}

export function isSuperAdmin(user: AuthUser | null | undefined): boolean {
  return user?.role === 'super_admin';
}
