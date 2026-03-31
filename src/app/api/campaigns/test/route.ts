import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { loadSecureSettings } from '@/lib/secure-settings';
import { createSendyCampaign } from '@/lib/sendy';

const SENDY_TEST_LIST_ID = process.env.SENDY_TEST_LIST_ID?.trim() || '';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { to, subject, html_content } = body;

    if (!to || !subject || !html_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!SENDY_TEST_LIST_ID) {
      return NextResponse.json(
        {
          error: 'Safe test-send is not configured. Set SENDY_TEST_LIST_ID to a dedicated Sendy test list before using test send.',
        },
        { status: 400 }
      );
    }

    const secureSettings = await loadSecureSettings(user.email);
    if (!secureSettings.api_url || !secureSettings.api_key) {
      return NextResponse.json(
        { error: 'Sendy is not configured yet. Save API URL and API key in Settings first.' },
        { status: 400 }
      );
    }

    const result = await createSendyCampaign({
      fromName: secureSettings.from_name || 'Bestemail',
      fromEmail: secureSettings.from_email || 'hello@bestemail.in',
      replyTo: secureSettings.from_email || 'hello@bestemail.in',
      subject: `[TEST for ${String(to).trim()}] ${subject}`,
      plainText: String(html_content).replace(/<[^>]*>/g, ''),
      htmlText: html_content,
      title: `Test send: ${subject}`,
      listIds: SENDY_TEST_LIST_ID,
      configOverride: {
        apiUrl: secureSettings.api_url,
        apiKey: secureSettings.api_key,
        listId: SENDY_TEST_LIST_ID,
        brandId: secureSettings.brand_id,
      },
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.text || 'Failed to send test email', reason: result.reason },
        { status: result.reason === 'config_missing' ? 400 : 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sendy accepted the test campaign for the dedicated test list.',
      response: result.text,
      target: 'sendy-test-list',
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
