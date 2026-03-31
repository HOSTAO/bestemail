// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Verify sequence ownership and get it
    const { data: sequence } = await supabaseAdmin
      .from('sequences')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!sequence) {
      return NextResponse.json({ error: 'Sequence not found' }, { status: 404 });
    }

    const body = await request.json();

    // Support single or bulk enrollment
    let subscriberIds: string[] = [];
    if (Array.isArray(body.subscriber_ids)) {
      subscriberIds = body.subscriber_ids.filter((s: unknown) => typeof s === 'string' && s.trim());
    } else if (typeof body.subscriber_id === 'string' && body.subscriber_id.trim()) {
      subscriberIds = [body.subscriber_id.trim()];
    }

    if (subscriberIds.length === 0) {
      return NextResponse.json({ error: 'At least one subscriber_id is required' }, { status: 400 });
    }

    // Get the first email step to calculate next_send_at
    const { data: firstStep } = await supabaseAdmin
      .from('sequence_emails')
      .select('delay_days, delay_hours, send_time')
      .eq('sequence_id', id)
      .order('step_number', { ascending: true })
      .limit(1)
      .single();

    const now = new Date();
    let nextSendAt = now;

    if (firstStep) {
      nextSendAt = new Date(now.getTime());
      nextSendAt.setDate(nextSendAt.getDate() + (firstStep.delay_days || 0));
      nextSendAt.setHours(nextSendAt.getHours() + (firstStep.delay_hours || 0));

      // If send_time is set, override the time portion
      if (firstStep.send_time) {
        const [hours, minutes] = firstStep.send_time.split(':').map(Number);
        nextSendAt.setHours(hours, minutes, 0, 0);
        // If the calculated time is in the past, move to next day
        if (nextSendAt <= now && firstStep.delay_days === 0 && firstStep.delay_hours === 0) {
          nextSendAt.setDate(nextSendAt.getDate() + 1);
        }
      }
    }

    // Check for already enrolled subscribers
    const { data: existingEnrollments } = await supabaseAdmin
      .from('sequence_enrollments')
      .select('subscriber_id')
      .eq('sequence_id', id)
      .eq('status', 'active')
      .in('subscriber_id', subscriberIds);

    const alreadyEnrolled = new Set(existingEnrollments?.map(e => e.subscriber_id) || []);
    const newSubscriberIds = subscriberIds.filter(sid => !alreadyEnrolled.has(sid));

    if (newSubscriberIds.length === 0) {
      return NextResponse.json({ error: 'All subscribers are already enrolled in this sequence' }, { status: 409 });
    }

    // Create enrollments
    const enrollments = newSubscriberIds.map(subscriberId => ({
      sequence_id: id,
      subscriber_id: subscriberId,
      current_step: 1,
      status: 'active',
      next_send_at: nextSendAt.toISOString(),
      enrolled_at: now.toISOString(),
    }));

    const { data: created, error } = await supabaseAdmin
      .from('sequence_enrollments')
      .insert(enrollments)
      .select();

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to enroll subscribers:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update subscriber_count on the sequence
    const { count } = await supabaseAdmin
      .from('sequence_enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('sequence_id', id);

    await supabaseAdmin
      .from('sequences')
      .update({ subscriber_count: count || 0, updated_at: new Date().toISOString() })
      .eq('id', id);

    // Log subscriber_events for each enrollment
    const events = newSubscriberIds.map(subscriberId => ({
      subscriber_id: subscriberId,
      user_id: user.id,
      event_type: 'sequence_started',
      event_data: { sequence_id: id, sequence_name: sequence.name },
      created_at: now.toISOString(),
    }));

    await supabaseAdmin.from('subscriber_events').insert(events).select();

    return NextResponse.json({
      data: {
        enrolled: created?.length || 0,
        skipped: alreadyEnrolled.size,
        enrollments: created,
      },
    }, { status: 201 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to enroll subscribers:', error);
    const message = error instanceof Error ? error.message : 'Failed to enroll subscribers';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
