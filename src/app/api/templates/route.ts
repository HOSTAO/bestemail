import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const client = supabaseAdmin || supabase;
    if (!client) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const industry = searchParams.get('industry');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let query = client.from('templates').select('*').eq('is_system', true);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (subcategory && subcategory !== 'All') {
      query = query.eq('subcategory', subcategory);
    }
    if (industry && industry !== 'All') {
      query = query.contains('industry_tags', [industry.toLowerCase()]);
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,subject.ilike.%${search}%,subcategory.ilike.%${search}%`);
    }

    query = query.order('is_featured', { ascending: false }).order('category').order('subcategory').order('name');

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates: data || [], count: data?.length || 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
