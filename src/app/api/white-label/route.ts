import { NextRequest, NextResponse } from 'next/server';
import { getWhiteLabelConfig } from '@/lib/white-label';

export async function GET(request: NextRequest) {
  try {
    const hostname = request.headers.get('host') || 'bestemail.in';
    const config = await getWhiteLabelConfig(hostname);
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching white label config:', error);
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
}