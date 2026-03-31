import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // Try database first
    let authenticatedUser = null;
    
    try {
      const user = await db.getUserByEmail(email);
      if (user) {
        const passwordValid = await db.verifyPassword(password, (user as any).password_hash || (user as any).passwordHash);
        if (passwordValid) {
          authenticatedUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
      }
    } catch (error) {
      console.error('Database auth error:', error);
    }

    // Fallback to env admin
    if (!authenticatedUser) {
      const adminEmail = (process.env.BESTEMAIL_ADMIN_EMAIL || 'admin@bestemail.in').toLowerCase();
      const adminPassword = process.env.BESTEMAIL_ADMIN_PASSWORD || 'ChangeMe123!';
      
      if (email === adminEmail && password === adminPassword) {
        // Create admin user if not exists
        try {
          const existingAdmin = await db.getUserByEmail(adminEmail);
          if (!existingAdmin) {
            const newAdmin = await db.createUser({
              email: adminEmail,
              name: process.env.BESTEMAIL_ADMIN_NAME || 'Admin',
              password: adminPassword,
              role: 'admin'
            });
            authenticatedUser = {
              id: newAdmin.id,
              email: newAdmin.email,
              name: newAdmin.name,
              role: newAdmin.role
            };
          } else {
            authenticatedUser = {
              id: existingAdmin.id,
              email: existingAdmin.email,
              name: existingAdmin.name,
              role: existingAdmin.role
            };
          }
        } catch {
          // If database fails, use env fallback
          authenticatedUser = {
            id: 'env_admin',
            email: adminEmail,
            name: process.env.BESTEMAIL_ADMIN_NAME || 'Admin',
            role: 'admin' as const
          };
        }
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const sessionToken = createSessionToken(authenticatedUser.id, authenticatedUser.email);
    const cookieStore = await cookies();
    cookieStore.set('be_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: authenticatedUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}