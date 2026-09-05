import { NextRequest, NextResponse } from 'next/server';
import { scanWithFreshVision, verifyExpectedCrop } from '@/lib/fresh-vision';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const expectedCrop = formData.get('expected_crop');
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Please choose a produce photo.' }, { status: 400 });
  }

  try {
    const cropStr = typeof expectedCrop === 'string' ? expectedCrop : undefined;
    const result = await scanWithFreshVision(file, cropStr);
    return NextResponse.json(cropStr ? verifyExpectedCrop(result, cropStr) : result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Fresh Vision scan could not be processed.' },
      { status: 500 }
    );
  }
}
