import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/lib/db/mock-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get('buyerId');

    let results = [...INITIAL_ORDERS];
    if (buyerId) {
      results = results.filter((o) => o.buyerId === buyerId);
    }

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      buyerId = 'usr_buyer_bulk_01',
      buyerName = 'Direct Buyer',
      buyerType = 'BUYER_BULK',
      items = [],
      deliveryAddress = 'Direct Delivery Location',
      deliveryDistrict = 'Mumbai',
    } = body;

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (item.quantityKg || 0) * (item.unitPrice || 0),
      0
    );

    // Transparent cost breakdown: 82% to Farmer, 12% Logistics Pooling, 6% Platform Escrow & Quality
    const farmerPayoutAmount = Math.round(totalAmount * 0.82 * 10) / 10;
    const logisticsFee = Math.round(totalAmount * 0.12 * 10) / 10;
    const platformFee = Math.round(totalAmount * 0.06 * 10) / 10;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${buyerType === 'BUYER_BULK' ? 'BULK' : 'RET'}`,
      buyerId,
      buyerName,
      buyerType,
      items,
      totalAmount,
      farmerPayoutAmount,
      logisticsFee,
      platformFee,
      status: 'PLACED',
      paymentStatus: 'ESCROW_HELD',
      deliveryAddress,
      deliveryDistrict,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
