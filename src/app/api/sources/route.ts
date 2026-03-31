import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { isMigrationPending, migrationPendingResponse } from '@/lib/db-utils';

export async function GET() {
  try {
    const user = await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection requires Supabase configuration' }, { status: 503 });
    }

    // Fetch all subscribers with their tags grouped by source
    const { data: subscribers, error } = await supabaseAdmin
      .from('subscribers')
      .select('source, created_at, subscriber_tags(tags(name))')
      .eq('user_id', user.id)
      .not('source', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMigrationPending(error)) return migrationPendingResponse();
      console.error('Failed to fetch sources:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by source
    const sourceMap = new Map<string, {
      source: string;
      subscriber_count: number;
      tag_counts: Map<string, number>;
      last_capture_at: string | null;
    }>();

    for (const sub of subscribers || []) {
      const src = sub.source || 'unknown';
      if (!sourceMap.has(src)) {
        sourceMap.set(src, {
          source: src,
          subscriber_count: 0,
          tag_counts: new Map(),
          last_capture_at: null,
        });
      }

      const entry = sourceMap.get(src)!;
      entry.subscriber_count++;

      // Track latest capture date
      if (sub.created_at && (!entry.last_capture_at || sub.created_at > entry.last_capture_at)) {
        entry.last_capture_at = sub.created_at;
      }

      // Count tags
      const subTags = (sub.subscriber_tags || []) as unknown as Array<{ tags: { name: string } | null }>;
      for (const st of subTags) {
        if (st.tags?.name) {
          const tagName = st.tags.name;
          entry.tag_counts.set(tagName, (entry.tag_counts.get(tagName) || 0) + 1);
        }
      }
    }

    // Build response: sort by subscriber_count descending
    const result = Array.from(sourceMap.values())
      .map(entry => {
        // Get top 3 tags by count
        const sortedTags = Array.from(entry.tag_counts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name);

        return {
          source: entry.source,
          subscriber_count: entry.subscriber_count,
          recent_tags: sortedTags,
          last_capture_at: entry.last_capture_at,
        };
      })
      .sort((a, b) => b.subscriber_count - a.subscriber_count);

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    if (isMigrationPending(error)) return migrationPendingResponse();
    console.error('Failed to fetch sources:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch sources';
    const statusCode = message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
