import { NextRequest, NextResponse } from 'next/server';
import { createSession, validateCredentials } from '@/lib/auth-simple';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    const user = await validateCredentials(email, password);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const sessionId = await createSession(user);
    const response = NextResponse.json({ success: true, message: 'Login successful' });

    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    const status = message.includes('not configured') ? 503 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
