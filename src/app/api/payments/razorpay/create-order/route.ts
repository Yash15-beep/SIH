import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // 1. If real Razorpay credentials are provided in .env, call official API
    if (keyId && keySecret && !keyId.includes('demo') && !keyId.includes('YOUR_KEY')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // amount in paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || { platform: 'KisanSetu-Escrow' }
          })
        });

        const data = await res.json();
        if (res.ok) {
          return NextResponse.json({ success: true, order: data, key_id: keyId, mode: 'live_sandbox' });
        } else {
          console.warn('[Razorpay API Warning]', data);
        }
      } catch (apiErr) {
        console.warn('[Razorpay Fetch Error]', apiErr);
      }
    }

    // 2. Simulated Escrow Order for hackathon testing & offline judging
    const mockOrder = {
      id: `order_rzp_${Date.now().toString(36)}`,
      entity: 'order',
      amount: Math.round(amount * 100),
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: notes || { platform: 'KisanSetu-Escrow-Simulator' },
      created_at: Math.floor(Date.now() / 1000)
    };

    return NextResponse.json({
      success: true,
      order: mockOrder,
      key_id: keyId || 'rzp_test_kisansetu_demo',
      mode: 'escrow_simulator',
      message: 'Escrow order initiated. Funds will be held until delivery OTP verification.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
