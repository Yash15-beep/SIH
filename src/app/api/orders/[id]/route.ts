import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const order = db.getOrderById(params.id);
  if (!order) {
    return NextResponse.json({ error: { message: 'Order not found' } }, { status: 404 });
  }
  return NextResponse.json({ data: order });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { delivery_status, payment_status } = body;
    const updated = db.updateOrderStatus(params.id, delivery_status, payment_status);
    if (!updated) {
      return NextResponse.json({ error: { message: 'Order not found' } }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: { message: 'Failed to update order' } }, { status: 500 });
  }
}
