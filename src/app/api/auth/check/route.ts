import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth-simple';

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await validateSession(sessionId);

  if (!session) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set('session_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      name: session.name,
      role: session.role,
    },
  });
}
