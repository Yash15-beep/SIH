import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    return NextResponse.json({ success: true, message: 'Signed out successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
