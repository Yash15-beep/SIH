import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const listing = db.getListingById(params.id);
  if (!listing) {
    return NextResponse.json({ error: { message: 'Listing not found' } }, { status: 404 });
  }
  return NextResponse.json({ data: listing });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = db.updateListing(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: { message: 'Listing not found' } }, { status: 404 });
    }
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: { message: 'Failed to update listing' } }, { status: 500 });
  }
}
