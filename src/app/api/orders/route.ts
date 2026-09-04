import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const buyer_id = searchParams.get('buyer_id') || undefined;
  const farmer_id = searchParams.get('farmer_id') || undefined;

  const orders = db.getOrders({ buyer_id, farmer_id });
  return NextResponse.json({ data: orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listing_id, buyer_id, quantity_kg, delivery_address } = body;

    const listing = db.getListingById(listing_id);
    if (!listing) {
      return NextResponse.json({ error: { message: 'Listing not found' } }, { status: 404 });
    }

    if (listing.quantity_kg < quantity_kg) {
      return NextResponse.json({ error: { message: 'Requested quantity exceeds available stock' } }, { status: 400 });
    }

    const buyer = db.getUserById(buyer_id);
    const total_price = Number(quantity_kg) * listing.price_per_kg;

    const order = db.createOrder({
      listing_id,
      buyer_id,
      buyer_name: buyer?.name || 'Consumer',
      crop_name: listing.crop_name,
      farmer_id: listing.farmer_id,
      farmer_name: listing.farmer_name,
      farmer_village: listing.farmer_village,
      quantity_kg: Number(quantity_kg),
      total_price,
      payment_status: 'test_paid',
      delivery_status: 'confirmed',
      delivery_address: delivery_address || buyer?.village || 'Standard Address',
    });

    return NextResponse.json({
      data: order,
      razorpay_order_id: `rzp_test_${Date.now()}`,
      currency: 'INR',
      amount: total_price * 100
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: { message: 'Failed to create order' } }, { status: 500 });
  }
}
