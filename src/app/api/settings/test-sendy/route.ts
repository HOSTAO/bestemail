import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { api_url, api_key, list_id } = body;

    if (!api_url || !api_key || !list_id) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Test the connection by getting subscriber count
    const formData = new URLSearchParams({
      api_key: api_key,
      list_id: list_id,
    });

    const response = await fetch(`${api_url}/api/subscribers/active-subscriber-count.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const text = await response.text();
    const count = parseInt(text);

    if (!isNaN(count)) {
      return NextResponse.json({
        success: true,
        message: `Connected successfully! ${count} active subscribers found.`,
        subscriberCount: count
      });
    } else {
      // Check specific error messages
      if (text.includes('Invalid API key')) {
        return NextResponse.json(
          { message: 'Invalid API key' },
          { status: 401 }
        );
      } else if (text.includes('List does not exist')) {
        return NextResponse.json(
          { message: 'List ID not found' },
          { status: 404 }
        );
      } else {
        return NextResponse.json(
          { message: `Sendy error: ${text}` },
          { status: 400 }
        );
      }
    }
  } catch (error: any) {
    console.error('Sendy test error:', error);
    return NextResponse.json(
      { message: `Connection failed: ${error.message || 'Network error'}` },
      { status: 500 }
    );
  }
}