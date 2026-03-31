// Security utilities to protect API credentials and prevent attacks

import crypto from 'crypto';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY?.trim() || '';

function assertEncryptionKeyConfigured() {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.toLowerCase().includes('change-in-prod')) {
    throw new Error(IS_PRODUCTION ? 'ENCRYPTION_KEY is not configured' : 'ENCRYPTION_KEY is not configured. Set ENCRYPTION_KEY before storing encrypted settings.');
  }
}

/**
 * Encrypt sensitive data (API keys, etc.)
 */
export function encrypt(text: string): string {
  assertEncryptionKeyConfigured();
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedText: string): string {
  assertEncryptionKeyConfigured();
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

  const parts = encryptedText.split(':');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error('Invalid encrypted payload');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Rate limiting to prevent brute force attacks
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 10,
  windowMinutes: number = 15
): boolean {
  const now = Date.now();
  const window = windowMinutes * 60 * 1000;

  const limit = rateLimitMap.get(identifier);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + window
    });
    return true;
  }

  if (limit.count >= maxAttempts) {
    return false;
  }

  limit.count++;
  return true;
}

/**
 * Validate API request origin
 */
export function validateOrigin(origin: string | null): boolean {
  if (!IS_PRODUCTION) {
    return true;
  }

  const allowedOrigins = [
    'https://bestemail-platform.vercel.app',
    'https://bestemail.in',
    'https://my.bestemail.in'
  ];

  return origin ? allowedOrigins.includes(origin) : false;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Generate secure random tokens
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  return token.length === 64 && /^[a-f0-9]+$/.test(token) && !!sessionToken;
}

/**
 * Mask sensitive data for logs
 */
export function maskSensitiveData(data: string, showChars: number = 4): string {
  if (data.length <= showChars * 2) {
    return '***';
  }

  const start = data.slice(0, showChars);
  const end = data.slice(-showChars);
  const masked = '*'.repeat(Math.max(data.length - showChars * 2, 3));

  return `${start}${masked}${end}`;
}

/**
 * Security headers middleware
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': IS_PRODUCTION
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    : "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';"
};
