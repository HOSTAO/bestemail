import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending } from '@/lib/db-utils';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ formId: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    const { formId } = await context.params;
    const body = await request.json();

    // Validate email
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'A valid email is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Lookup form
    const { data: form, error: formError } = await supabaseAdmin
      .from('forms')
      .select('*')
      .eq('id', formId)
      .maybeSingle();

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Check if form is active
    const status = form.status || form.settings?.status || 'draft';
    if (status !== 'active') {
      return NextResponse.json(
        { error: 'This form is not currently accepting submissions' },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const userId = form.user_id;
    const settings = form.settings || {};
    const now = new Date().toISOString();

    // Extract fields from body
    const firstName = typeof body.first_name === 'string' ? body.first_name.trim().slice(0, 120) : '';
    const lastName = typeof body.last_name === 'string' ? body.last_name.trim().slice(0, 120) : '';
    const company = typeof body.company === 'string' ? body.company.trim().slice(0, 200) : '';

    // Determine source from referrer
    const referer = request.headers.get('referer') || request.headers.get('referrer') || '';
    let sourceDomain = 'direct';
    let sourceUrl = '';
    if (referer) {
      try {
        const refUrl = new URL(referer);
        sourceDomain = refUrl.hostname;
        sourceUrl = referer;
      } catch {
        sourceDomain = 'unknown';
      }
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Collect custom fields (anything beyond known fields)
    const knownFields = new Set(['email', 'first_name', 'last_name', 'company', 'name']);
    const customFields: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!knownFields.has(key) && typeof value === 'string') {
        customFields[key] = value.trim().slice(0, 500);
      }
    }

    // Create or upsert subscriber in subscribers table
    const { data: existingSub, error: lookupError } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('user_id', userId)
      .eq('email', email)
      .maybeSingle();

    if (isMigrationPending(lookupError)) {
      return NextResponse.json(
        { success: false, error: 'Platform setup in progress. Please try again later.' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    let subscriberId: string;

    if (existingSub) {
      subscriberId = existingSub.id;
      // Update existing subscriber
      await supabaseAdmin
        .from('subscribers')
        .update({
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          company: company || undefined,
          source: sourceDomain,
          source_url: sourceUrl,
          ip_address: ip,
          last_activity_at: now,
          custom_fields: Object.keys(customFields).length > 0 ? customFields : undefined,
          updated_at: now,
        })
        .eq('id', existingSub.id);
    } else {
      // Insert new subscriber
      const { data: newSub, error: subError } = await supabaseAdmin
        .from('subscribers')
        .insert({
          user_id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          company,
          source: sourceDomain,
          source_url: sourceUrl,
          ip_address: ip,
          status: 'active',
          last_activity_at: now,
          custom_fields: Object.keys(customFields).length > 0 ? customFields : null,
        })
        .select('id')
        .single();

      if (isMigrationPending(subError)) {
        return NextResponse.json(
          { success: false, error: 'Platform setup in progress. Please try again later.' },
          { status: 503, headers: CORS_HEADERS }
        );
      }

      if (subError) {
        console.error('Failed to create subscriber:', subError);
        return NextResponse.json(
          { error: 'Failed to create subscriber' },
          { status: 500, headers: CORS_HEADERS }
        );
      }

      subscriberId = newSub.id;
    }

    // Apply configured tags
    const tagIds: string[] = [];
    if (Array.isArray(settings.tag_ids)) {
      tagIds.push(...settings.tag_ids);
    }
    if (Array.isArray(settings.submitted_contact_tags)) {
      // These might be tag names — try to resolve them
      for (const tagName of settings.submitted_contact_tags) {
        if (typeof tagName === 'string' && tagName.length < 40 && !tagName.includes(':')) {
          // Looks like a UUID tag_id
          tagIds.push(tagName);
        }
      }
    }

    if (tagIds.length > 0) {
      const tagInserts = tagIds.map((tagId) => ({
        subscriber_id: subscriberId,
        tag_id: tagId,
      }));

      await supabaseAdmin
        .from('subscriber_tags')
        .upsert(tagInserts, { onConflict: 'subscriber_id,tag_id', ignoreDuplicates: true });
    }

    // Enroll in linked sequence if configured
    if (settings.sequence_id) {
      const { data: existingEnrollment } = await supabaseAdmin
        .from('sequence_enrollments')
        .select('id')
        .eq('subscriber_id', subscriberId)
        .eq('sequence_id', settings.sequence_id)
        .maybeSingle();

      if (!existingEnrollment) {
        await supabaseAdmin.from('sequence_enrollments').insert({
          subscriber_id: subscriberId,
          sequence_id: settings.sequence_id,
          user_id: userId,
          status: 'active',
          current_step: 0,
          enrolled_at: now,
        });
      }
    }

    // Log form_submitted event
    await supabaseAdmin.from('subscriber_events').insert({
      subscriber_id: subscriberId,
      user_id: userId,
      event_type: 'form_submitted',
      data: {
        form_id: formId,
        form_name: form.name,
        source_domain: sourceDomain,
        source_url: sourceUrl,
        ip_address: ip,
        custom_fields: customFields,
      },
      created_at: now,
    });

    // Increment submissions count
    const currentCount = typeof form.submissions_count === 'number' ? form.submissions_count : 0;
    await supabaseAdmin
      .from('forms')
      .update({
        submissions_count: currentCount + 1,
        settings: {
          ...settings,
          last_submission_at: now,
          last_submission_source: sourceDomain,
        },
      })
      .eq('id', formId);

    return NextResponse.json(
      {
        success: true,
        message: settings.success_message || 'Thanks for signing up!',
        redirect_url: settings.redirect_url || null,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error) {
    if (isMigrationPending(error)) {
      return NextResponse.json(
        { success: false, error: 'Platform setup in progress. Please try again later.' },
        { status: 503, headers: CORS_HEADERS }
      );
    }
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
