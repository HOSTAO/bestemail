import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createSendyCampaign } from '@/lib/sendy';
import { loadSecureSettings } from '@/lib/secure-settings';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    // Auth via cron secret
    const secret = request.nextUrl.searchParams.get('secret');
    if (!secret || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const now = new Date().toISOString();

    // Find all active enrollments where next_send_at <= NOW
    // and the parent sequence is active
    const { data: enrollments, error: enrollError } = await supabaseAdmin
      .from('sequence_enrollments')
      .select(`
        id,
        sequence_id,
        subscriber_id,
        current_step,
        next_send_at
      `)
      .eq('status', 'active')
      .lte('next_send_at', now);

    if (enrollError) {
      if (isMigrationPending(enrollError)) return migrationPendingResponse();
      console.error('Failed to fetch enrollments:', enrollError);
      return NextResponse.json({ error: enrollError.message }, { status: 500 });
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ processed: 0, message: 'No enrollments to process' });
    }

    let processed = 0;
    let errors = 0;

    // Group enrollments by sequence_id for efficiency
    const bySequence: Record<string, typeof enrollments> = {};
    for (const e of enrollments) {
      if (!bySequence[e.sequence_id]) bySequence[e.sequence_id] = [];
      bySequence[e.sequence_id].push(e);
    }

    for (const [sequenceId, seqEnrollments] of Object.entries(bySequence)) {
      // Get the sequence (must be active)
      const { data: sequence } = await supabaseAdmin
        .from('sequences')
        .select('*')
        .eq('id', sequenceId)
        .eq('status', 'active')
        .single();

      if (!sequence) {
        // Sequence not active, skip these enrollments
        continue;
      }

      // Get all email steps for this sequence
      const { data: steps } = await supabaseAdmin
        .from('sequence_emails')
        .select('*')
        .eq('sequence_id', sequenceId)
        .order('step_number', { ascending: true });

      if (!steps || steps.length === 0) continue;

      // Get settings for the sequence owner
      const settings = await loadSecureSettings(sequence.user_id);

      for (const enrollment of seqEnrollments) {
        try {
          // Find the current step email
          const currentEmail = steps.find(s => s.step_number === enrollment.current_step);
          if (!currentEmail) {
            // No more steps, mark complete
            await supabaseAdmin
              .from('sequence_enrollments')
              .update({ status: 'completed', completed_at: now, updated_at: now })
              .eq('id', enrollment.id);
            continue;
          }

          // Get subscriber info
          const { data: subscriber } = await supabaseAdmin
            .from('subscribers')
            .select('email, name')
            .eq('id', enrollment.subscriber_id)
            .single();

          if (!subscriber) {
            await supabaseAdmin
              .from('sequence_enrollments')
              .update({ status: 'cancelled', updated_at: now })
              .eq('id', enrollment.id);
            continue;
          }

          // Personalize subject and body
          const personalizedSubject = currentEmail.subject
            .replace(/\{\{name\}\}/gi, subscriber.name || 'there')
            .replace(/\{\{email\}\}/gi, subscriber.email);
          const personalizedBody = (currentEmail.body_html || '')
            .replace(/\{\{name\}\}/gi, subscriber.name || 'there')
            .replace(/\{\{email\}\}/gi, subscriber.email);

          // Send via Sendy
          const result = await createSendyCampaign({
            fromName: settings.from_name,
            fromEmail: settings.from_email,
            replyTo: settings.from_email,
            subject: personalizedSubject,
            plainText: personalizedSubject,
            htmlText: personalizedBody,
            title: `Seq: ${sequence.name} - Step ${enrollment.current_step}`,
            userId: sequence.user_id,
          });

          if (!result.ok) {
            console.error(`Failed to send sequence email for enrollment ${enrollment.id}:`, result.text);
            errors++;
            continue;
          }

          // Log subscriber event
          await supabaseAdmin.from('subscriber_events').insert({
            subscriber_id: enrollment.subscriber_id,
            user_id: sequence.user_id,
            event_type: 'sequence_email_sent',
            event_data: {
              sequence_id: sequenceId,
              sequence_name: sequence.name,
              step_number: enrollment.current_step,
              subject: personalizedSubject,
            },
            created_at: now,
          });

          // Advance to next step
          const nextStepNumber = enrollment.current_step + 1;
          const nextStep = steps.find(s => s.step_number === nextStepNumber);

          if (nextStep) {
            // Calculate next_send_at
            const nextSend = new Date();
            nextSend.setDate(nextSend.getDate() + (nextStep.delay_days || 0));
            nextSend.setHours(nextSend.getHours() + (nextStep.delay_hours || 0));

            if (nextStep.send_time) {
              const [hours, minutes] = nextStep.send_time.split(':').map(Number);
              nextSend.setHours(hours, minutes, 0, 0);
              if (nextSend <= new Date()) {
                nextSend.setDate(nextSend.getDate() + 1);
              }
            }

            await supabaseAdmin
              .from('sequence_enrollments')
              .update({
                current_step: nextStepNumber,
                next_send_at: nextSend.toISOString(),
                updated_at: now,
              })
              .eq('id', enrollment.id);
          } else {
            // No more steps, mark complete
            await supabaseAdmin
              .from('sequence_enrollments')
              .update({
                status: 'completed',
                current_step: nextStepNumber,
                completed_at: now,
                updated_at: now,
              })
              .eq('id', enrollment.id);

            // Log completion event
            await supabaseAdmin.from('subscriber_events').insert({
              subscriber_id: enrollment.subscriber_id,
              user_id: sequence.user_id,
              event_type: 'sequence_completed',
              event_data: {
                sequence_id: sequenceId,
                sequence_name: sequence.name,
                total_steps: steps.length,
              },
              created_at: now,
            });
          }

          processed++;
        } catch (err) {
          if (isMigrationPending(err)) return migrationPendingResponse();
          console.error(`Error processing enrollment ${enrollment.id}:`, err);
          errors++;
        }
      }
    }

    return NextResponse.json({
      processed,
      errors,
      message: `Processed ${processed} enrollment(s), ${errors} error(s)`,
    });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Sequence processor error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
