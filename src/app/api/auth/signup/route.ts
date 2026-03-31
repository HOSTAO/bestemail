import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, company } = body;

    // Validation
    const cleanedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';
    const cleanedPassword = typeof password === 'string' ? password : '';
    const cleanedCompany = typeof company === 'string' ? company.trim() : '';

    if (!cleanedName || !normalizedEmail || !cleanedPassword) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (cleanedPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    try {
      const existingUser = await db.getUserByEmail(normalizedEmail);
      if (existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
    } catch (checkError) {
      console.log('Error checking existing user (may be expected):', checkError);
      // Continue anyway - might be local fallback
    }

    // Create user
    const newUser = await db.createUser({
      email: normalizedEmail,
      name: cleanedName,
      password: cleanedPassword,
      role: 'member',
    });

    if (!newUser || !newUser.id) {
      throw new Error('User creation returned invalid response');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        userId: newUser.id,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
    return NextResponse.json(
      { error: errorMessage || 'Failed to create account' },
      { status: 500 }
    );
  }
}
