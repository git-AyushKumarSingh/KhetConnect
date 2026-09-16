import { NextRequest, NextResponse } from 'next/server';
import { generate30DayForecast, SUPPORTED_CROPS, SUPPORTED_REGIONS } from '@/lib/algorithms/demand-forecaster';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get('crop') || 'onions';
    const region = searchParams.get('region') || SUPPORTED_REGIONS[0];

    const forecast = generate30DayForecast(crop, region);

    return NextResponse.json({
      success: true,
      data: {
        forecast,
        supportedCrops: SUPPORTED_CROPS,
        supportedRegions: SUPPORTED_REGIONS,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/analytics/demand-forecast:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch demand forecast' },
      { status: 500 }
    );
  }
}
