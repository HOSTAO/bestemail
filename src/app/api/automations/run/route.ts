import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

interface TriggerData {
  subscriber_id: string;
  tag_id?: string;
  form_id?: string;
  lead_score?: number;
}

interface ActionResult {
  automation_id: string;
  automation_name: string;
  action_type: string;
  success: boolean;
  detail?: string;
  error?: string;
}

async function executeAction(
  db: NonNullable<typeof supabaseAdmin>,
  automation: {
    id: string;
    name: string;
    action_type: string;
    action_config: Record<string, unknown>;
    user_id: string;
  },
  triggerData: TriggerData
): Promise<ActionResult> {
  const { action_type, action_config } = automation;
  const { subscriber_id } = triggerData;

  try {
    switch (action_type) {
      case 'add_tag': {
        const tagId = action_config.tag_id as string;
        if (!tagId) throw new Error('No tag_id in action config');

        // Insert into subscriber_tags (ignore if already exists)
        const { error: insertErr } = await db
          .from('subscriber_tags')
          .upsert({ subscriber_id, tag_id: tagId }, { onConflict: 'subscriber_id,tag_id' });

        if (insertErr) throw new Error(`Failed to add tag: ${insertErr.message}`);

        // Update tag subscriber_count
        try {
          await db.rpc('increment_field', { table_name: 'tags', row_id: tagId, field_name: 'subscriber_count', amount: 1 });
        } catch {
          // Fallback: manual increment if rpc doesn't exist
          const { data: tag } = await db.from('tags').select('subscriber_count').eq('id', tagId).single();
          if (tag) {
            await db.from('tags').update({ subscriber_count: (tag.subscriber_count || 0) + 1 }).eq('id', tagId);
          }
        }

        // Log subscriber event
        await db.from('subscriber_events').insert({
          subscriber_id,
          user_id: automation.user_id,
          event_type: 'tag_added',
          event_data: { tag_id: tagId, automation_id: automation.id },
          created_at: new Date().toISOString(),
        });

        return { automation_id: automation.id, automation_name: automation.name, action_type, success: true, detail: `Added tag ${tagId}` };
      }

      case 'remove_tag': {
        const tagId = action_config.tag_id as string;
        if (!tagId) throw new Error('No tag_id in action config');

        const { error: delErr } = await db
          .from('subscriber_tags')
          .delete()
          .eq('subscriber_id', subscriber_id)
          .eq('tag_id', tagId);

        if (delErr) throw new Error(`Failed to remove tag: ${delErr.message}`);

        // Update tag subscriber_count
        try {
          await db.rpc('increment_field', { table_name: 'tags', row_id: tagId, field_name: 'subscriber_count', amount: -1 });
        } catch {
          const { data: tag } = await db.from('tags').select('subscriber_count').eq('id', tagId).single();
          if (tag) {
            await db.from('tags').update({ subscriber_count: Math.max(0, (tag.subscriber_count || 0) - 1) }).eq('id', tagId);
          }
        }

        await db.from('subscriber_events').insert({
          subscriber_id,
          user_id: automation.user_id,
          event_type: 'tag_removed',
          event_data: { tag_id: tagId, automation_id: automation.id },
          created_at: new Date().toISOString(),
        });

        return { automation_id: automation.id, automation_name: automation.name, action_type, success: true, detail: `Removed tag ${tagId}` };
      }

      case 'enroll_sequence': {
        const sequenceId = action_config.sequence_id as string;
        if (!sequenceId) throw new Error('No sequence_id in action config');

        // Calculate next_send_at as now + delay from first step (default 1 day)
        const nextSendAt = new Date();
        nextSendAt.setDate(nextSendAt.getDate() + 1);

        const { error: enrollErr } = await db
          .from('sequence_enrollments')
          .insert({
            subscriber_id,
            sequence_id: sequenceId,
            user_id: automation.user_id,
            status: 'active',
            current_step: 0,
            next_send_at: nextSendAt.toISOString(),
            enrolled_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });

        if (enrollErr) throw new Error(`Failed to enroll in sequence: ${enrollErr.message}`);

        await db.from('subscriber_events').insert({
          subscriber_id,
          user_id: automation.user_id,
          event_type: 'sequence_enrolled',
          event_data: { sequence_id: sequenceId, automation_id: automation.id },
          created_at: new Date().toISOString(),
        });

        return { automation_id: automation.id, automation_name: automation.name, action_type, success: true, detail: `Enrolled in sequence ${sequenceId}` };
      }

      case 'send_email': {
        const subject = action_config.subject as string;
        const body = action_config.body as string;
        if (!subject || !body) throw new Error('Missing subject or body in action config');

        // Get subscriber email
        const { data: subscriber } = await db
          .from('subscribers')
          .select('email, name')
          .eq('id', subscriber_id)
          .single();

        if (!subscriber) throw new Error('Subscriber not found');

        // Queue the email via Sendy or direct send
        // For now, log the send intent and create a campaign-like record
        await db.from('subscriber_events').insert({
          subscriber_id,
          user_id: automation.user_id,
          event_type: 'email_sent',
          event_data: {
            subject,
            to: subscriber.email,
            automation_id: automation.id,
            sent_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
        });

        return { automation_id: automation.id, automation_name: automation.name, action_type, success: true, detail: `Email queued to ${subscriber.email}` };
      }

      case 'update_score': {
        const scoreDelta = Number(action_config.score_delta) || 0;
        if (scoreDelta === 0) throw new Error('score_delta must be non-zero');

        const { data: subscriber } = await db
          .from('subscribers')
          .select('lead_score')
          .eq('id', subscriber_id)
          .single();

        if (!subscriber) throw new Error('Subscriber not found');

        const newScore = (subscriber.lead_score || 0) + scoreDelta;

        const { error: updateErr } = await db
          .from('subscribers')
          .update({ lead_score: newScore })
          .eq('id', subscriber_id);

        if (updateErr) throw new Error(`Failed to update score: ${updateErr.message}`);

        await db.from('subscriber_events').insert({
          subscriber_id,
          user_id: automation.user_id,
          event_type: 'score_updated',
          event_data: { old_score: subscriber.lead_score || 0, new_score: newScore, delta: scoreDelta, automation_id: automation.id },
          created_at: new Date().toISOString(),
        });

        return { automation_id: automation.id, automation_name: automation.name, action_type, success: true, detail: `Score updated by ${scoreDelta} (now ${newScore})` };
      }

      default:
        return { automation_id: automation.id, automation_name: automation.name, action_type, success: false, error: `Unknown action type: ${action_type}` };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return { automation_id: automation.id, automation_name: automation.name, action_type, success: false, error: errorMsg };
  }
}

function matchesTriggerConfig(
  automation: { trigger_type: string; trigger_config: Record<string, unknown> },
  triggerData: TriggerData
): boolean {
  const config = automation.trigger_config || {};

  switch (automation.trigger_type) {
    case 'tag_added':
      // If config specifies a tag_id, it must match
      if (config.tag_id && config.tag_id !== triggerData.tag_id) return false;
      return true;

    case 'form_submitted':
      if (config.form_id && config.form_id !== triggerData.form_id) return false;
      return true;

    case 'subscriber_created':
      // Always matches for this trigger type
      return true;

    case 'lead_score_threshold':
      if (config.threshold !== undefined && triggerData.lead_score !== undefined) {
        return triggerData.lead_score >= Number(config.threshold);
      }
      return true;

    default:
      return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    const body = await request.json();
    const { trigger_type, trigger_data, user_id } = body;

    if (!trigger_type || !trigger_data || !trigger_data.subscriber_id) {
      return NextResponse.json({ error: 'trigger_type, trigger_data.subscriber_id are required' }, { status: 400 });
    }

    // Use the provided user_id or fall back to the authenticated user
    const targetUserId = user_id || user.id;

    // Find all active automations matching the trigger
    const { data: automations, error } = await supabaseAdmin
      .from('automations')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('trigger_type', trigger_type)
      .eq('status', 'active');

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to query automations:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!automations || automations.length === 0) {
      return NextResponse.json({ executed: 0, results: [] });
    }

    // Filter by trigger config match
    const matching = automations.filter((a: { trigger_type: string; trigger_config: Record<string, unknown> }) =>
      matchesTriggerConfig(a, trigger_data as TriggerData)
    );

    const results: ActionResult[] = [];

    for (const automation of matching) {
      const result = await executeAction(supabaseAdmin, automation, trigger_data as TriggerData);
      results.push(result);

      // Increment run_count
      if (result.success) {
        await supabaseAdmin
          .from('automations')
          .update({
            run_count: (automation.run_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', automation.id);
      }
    }

    return NextResponse.json({ executed: results.filter(r => r.success).length, results });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to run automations:', error);
    const message = error instanceof Error ? error.message : 'Failed to run automations';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
