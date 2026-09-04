import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const posts = db.getDemandPosts();
  return NextResponse.json({ data: posts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyer_id, crop_name, quantity_kg, frequency, delivery_address } = body;

    const buyer = db.getUserById(buyer_id);
    const post = db.createDemandPost({
      buyer_id,
      buyer_name: buyer?.name || 'Bulk Buyer',
      crop_name,
      quantity_kg: Number(quantity_kg),
      frequency: frequency || 'weekly',
      delivery_address: delivery_address || buyer?.village || 'Commercial Dock'
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: { message: 'Failed to create demand post' } }, { status: 500 });
  }
}
