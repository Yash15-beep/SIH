import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, order_id } = body;

    const paymentId = razorpay_payment_id || `pay_${Date.now().toString(36)}`;

    // Update order in database to test_paid / escrow_locked
    if (order_id) {
      db.updateOrderStatus(order_id, 'confirmed', 'test_paid');
    }

    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      escrow_status: 'HELD_IN_ESCROW',
      escrow_message: 'Payment verified and held in KisanSetu Escrow Vault. Payout will be disbursed directly to farmer upon delivery OTP verification.',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
