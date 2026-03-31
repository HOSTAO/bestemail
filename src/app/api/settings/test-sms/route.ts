import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_token } = body;

    if (!api_token) {
      return NextResponse.json(
        { message: 'API token is required' },
        { status: 400 }
      );
    }

    // Test InstaSent API connection
    const response = await fetch('https://api.instasent.com/v1/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${api_token}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: `Connected! Balance: ${data.entity?.balance || 0} credits`,
        balance: data.entity?.balance
      });
    } else {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false,
          message: error.message || 'Invalid API token or connection failed' 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('SMS test error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to connect to InstaSent API' 
      },
      { status: 500 }
    );
  }
}