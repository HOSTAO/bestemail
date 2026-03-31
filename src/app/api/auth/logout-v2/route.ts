import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth-simple';

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;

  if (sessionId) {
    deleteSession(sessionId);
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('session_id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('be_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
