import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PRODUCE } from '@/lib/db/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();
    const state = searchParams.get('state');

    let results = [...INITIAL_PRODUCE];

    if (category && category !== 'ALL') {
      results = results.filter((p) => p.category === category);
    }
    if (state && state !== 'ALL') {
      results = results.filter((p) => p.state.toLowerCase() === state.toLowerCase());
    }
    if (search) {
      results = results.filter(
        (p) =>
          p.cropName.toLowerCase().includes(search) ||
          p.variety.toLowerCase().includes(search) ||
          p.locationName.toLowerCase().includes(search) ||
          p.farmerName.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProduce = {
      id: `prod_${Date.now()}`,
      ...body,
      freshnessScore: Math.min(100, Math.round(body.imageQualityScore || 95)),
      status: 'AVAILABLE',
    };

    return NextResponse.json({ success: true, data: newProduce }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
