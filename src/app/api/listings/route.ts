import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const crop_name = searchParams.get('crop_name') || undefined;
  const status = searchParams.get('status') || undefined;
  const farmer_id = searchParams.get('farmer_id') || undefined;

  const listings = db.getListings({ crop_name, status, farmer_id });
  return NextResponse.json({ data: listings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { farmer_id, crop_name, quantity_kg, price_per_kg, harvest_date, image_url } = body;

    if (!farmer_id || !crop_name || !quantity_kg) {
      return NextResponse.json({ error: { message: 'Missing required fields' } }, { status: 400 });
    }

    const farmer = db.getUserById(farmer_id);
    const benchmark = db.getLatestPrice(crop_name);

    const listing = db.createListing({
      farmer_id,
      farmer_name: farmer?.name || 'Farmer',
      farmer_village: farmer?.village || 'Haryana',
      farmer_pincode: farmer?.pincode || '122001',
      farmer_lat: farmer?.lat || 28.45,
      farmer_lng: farmer?.lng || 77.02,
      crop_name,
      quantity_kg: Number(quantity_kg),
      price_per_kg: Number(price_per_kg || (benchmark ? benchmark.modal_price - 1 : 20)),
      ai_suggested_price: benchmark ? benchmark.modal_price - 1 : undefined,
      mandi_benchmark_price: benchmark ? benchmark.modal_price : undefined,
      harvest_date: harvest_date || new Date().toISOString().split('T')[0],
      image_url: image_url || undefined,
    });

    return NextResponse.json({ data: listing }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: { message: 'Failed to create listing' } }, { status: 500 });
  }
}
