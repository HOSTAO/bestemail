import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/postgres';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const industry = searchParams.get('industry');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let sql = `SELECT * FROM templates WHERE is_system = true`;
    const params: unknown[] = [];
    let idx = 1;

    if (category && category !== 'All') {
      sql += ` AND category = $${idx}`;
      params.push(category);
      idx++;
    }
    if (subcategory && subcategory !== 'All') {
      sql += ` AND subcategory = $${idx}`;
      params.push(subcategory);
      idx++;
    }
    if (industry && industry !== 'All') {
      sql += ` AND industry_tags::text ILIKE $${idx}`;
      params.push(`%${industry.toLowerCase()}%`);
      idx++;
    }
    if (featured === 'true') {
      sql += ` AND is_featured = true`;
    }
    if (search) {
      sql += ` AND (name ILIKE $${idx} OR subject ILIKE $${idx} OR subcategory ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    sql += ` ORDER BY is_featured DESC, category, subcategory, name`;

    const result = await query(sql, params);
    const data = result.rows || [];

    return NextResponse.json({ templates: data, count: data.length });
  } catch (error: any) {
    // If templates table doesn't exist, return empty
    if (error?.code === '42P01' || (typeof error?.message === 'string' && error.message.includes('does not exist'))) {
      return NextResponse.json({ templates: [], count: 0 });
    }
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
