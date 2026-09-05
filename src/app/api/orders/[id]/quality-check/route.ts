import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scanWithFreshVision, verifyExpectedCrop } from '@/lib/fresh-vision';
import { VisionVerification } from '@/types';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  const file = formData.get('file');
  const stage = formData.get('stage');
  if (!(file instanceof File) || (stage !== 'dispatch' && stage !== 'receipt')) {
    return NextResponse.json({ message: 'Provide a produce photo and verification stage.' }, { status: 400 });
  }

  const order = db.getOrderById(params.id);
  const listing = order && db.getListingById(order.listing_id);
  if (!order || !listing) return NextResponse.json({ message: 'Order or original listing not found.' }, { status: 404 });

  try {
    const result = verifyExpectedCrop(await scanWithFreshVision(file, listing.crop_name), listing.crop_name);
    const freshness_match = Boolean(listing.freshness_key) && result.freshness_key === listing.freshness_key;
    const verification: VisionVerification = {
      status: result.status === 'ok' && freshness_match ? 'verified' : 'mismatch',
      checked_at: new Date().toISOString(),
      expected_crop: listing.crop_name,
      detected_crop: result.produce,
      freshness: result.freshness,
      freshness_key: result.freshness_key,
      crop_match: result.crop_match === true,
      freshness_match,
      detail: !listing.freshness_key
        ? 'The original listing has no Fresh Vision baseline, so this order cannot be quality-verified.'
        : result.status !== 'ok'
          ? result.detail || 'Fresh Vision could not verify this produce.'
          : freshness_match
            ? `Verified: ${result.produce} matches the original ${result.freshness} condition.`
            : `Freshness changed from ${listing.freshness} to ${result.freshness}.`
    };
    db.updateOrderVerification(order.id, stage, verification);
    return NextResponse.json({ data: verification });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Fresh Vision is unavailable. Start the AI service and try again.' },
      { status: 503 }
    );
  }
}
