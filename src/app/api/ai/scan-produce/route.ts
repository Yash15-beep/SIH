import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'Please choose a produce photo.' }, { status: 400 });
  }

  try {
    const upstream = new FormData();
    upstream.append('file', file, file.name);
    const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${aiServiceUrl}/api/v1/vision/scan`, { method: 'POST', body: upstream });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: 'Fresh Vision is unavailable. Start the AI service and try again.' },
      { status: 503 }
    );
  }
}
