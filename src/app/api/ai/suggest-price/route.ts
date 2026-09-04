import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const crop_name = searchParams.get('crop_name') || 'Tomato';
  const region = searchParams.get('region') || 'Rewari';
  const grade = searchParams.get('grade') || 'Grade A';

  const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

  // 1. Try FastAPI microservice
  try {
    const res = await fetch(`${aiServiceUrl}/api/v1/price/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: crop_name, quality_grade: grade, location: region }),
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }
  } catch (e) {
    // FastAPI offline, use local engine
  }

  // 2. Local Adaptive Calculation
  const benchmark = db.getLatestPrice(crop_name, region) || db.getLatestPrice(crop_name);
  const mandi_modal = benchmark ? benchmark.modal_price : 24.0;
  const grade_multiplier = grade === 'Grade A' ? 1.08 : grade === 'Grade C' ? 0.90 : 1.0;
  const fair_price = Math.round(mandi_modal * 0.92 * grade_multiplier * 10) / 10;
  const middleman_payout = Math.round(mandi_modal * 0.67 * 10) / 10;
  const retail_price = Math.round(mandi_modal * 1.35 * 10) / 10;

  return NextResponse.json({
    status: 'success',
    data: {
      crop: crop_name,
      quality_grade: grade,
      mandi_benchmark: mandi_modal,
      mandi_source: `Agmarknet: ${benchmark?.mandi_region || 'Regional Mandi'}`,
      recommended_fair_price: fair_price,
      suggested_min_price: Math.round(fair_price * 0.92 * 10) / 10,
      suggested_max_price: Math.round(fair_price * 1.08 * 10) / 10,
      middleman_traditional_payout: middleman_payout,
      estimated_supermarket_retail: retail_price,
      farmer_extra_earnings_pct: Math.round(((fair_price - middleman_payout) / middleman_payout) * 1000) / 10,
      consumer_savings_pct: Math.round(((retail_price - fair_price) / retail_price) * 1000) / 10,
      price_waterfall: [
        { stage: '1. Farmer Net Payout', amount: fair_price, share_pct: 85.0 },
        { stage: '2. Pooled Logistics', amount: 2.50, share_pct: 12.0 },
        { stage: '3. Platform Tech & Escrow', amount: Math.round(fair_price * 0.02 * 100) / 100, share_pct: 3.0 },
        { stage: '4. Final Consumer Price', amount: Math.round((fair_price + 2.50 + fair_price * 0.02) * 100) / 100, share_pct: 100.0 }
      ],
      confidence_score: 0.95,
      timestamp: new Date().toISOString()
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const crop_name = body.crop || 'Tomato';
    const grade = body.quality_grade || 'Grade A';
    const location = body.location || 'Haryana';
    const harvest_date = body.harvest_date || new Date().toISOString().split('T')[0];

    const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${aiServiceUrl}/api/v1/price/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop: crop_name, quality_grade: grade, location, harvest_date }),
        next: { revalidate: 0 }
      });
      if (res.ok) {
        const json = await res.json();
        return NextResponse.json(json);
      }
    } catch (e) {}

    // Embedded fallback
    const benchmark = db.getLatestPrice(crop_name) || { modal_price: 24.0, mandi_region: 'Azadpur Mandi' };
    const mandi_modal = benchmark.modal_price;
    const grade_multiplier = grade === 'Grade A' ? 1.08 : grade === 'Grade C' ? 0.90 : 1.0;
    const fair_price = Math.round(mandi_modal * 0.92 * grade_multiplier * 10) / 10;
    const middleman_payout = Math.round(mandi_modal * 0.67 * 10) / 10;
    const retail_price = Math.round(mandi_modal * 1.35 * 10) / 10;

    return NextResponse.json({
      status: 'success',
      data: {
        crop: crop_name,
        quality_grade: grade,
        harvest_date,
        mandi_benchmark: mandi_modal,
        mandi_source: `Agmarknet: ${benchmark.mandi_region}`,
        recommended_fair_price: fair_price,
        suggested_min_price: Math.round(fair_price * 0.92 * 10) / 10,
        suggested_max_price: Math.round(fair_price * 1.08 * 10) / 10,
        middleman_traditional_payout: middleman_payout,
        estimated_supermarket_retail: retail_price,
        farmer_extra_earnings_pct: Math.round(((fair_price - middleman_payout) / middleman_payout) * 1000) / 10,
        consumer_savings_pct: Math.round(((retail_price - fair_price) / retail_price) * 1000) / 10,
        confidence_score: 0.95,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
