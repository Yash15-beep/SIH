import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { db } from '@/lib/db';
import { User, UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, village, district, state } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Try Supabase Auth if credentials configured
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role: role || 'farmer',
            village,
            district,
            state
          }
        }
      });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      const user: User = {
        id: data.user?.id || `usr_${Date.now()}`,
        name,
        phone: phone || '9876543210',
        email,
        role: (role as UserRole) || 'farmer',
        village: village || 'Sonipat',
        preferred_language: 'hi',
        created_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        user,
        session: data.session,
        message: 'Account created successfully via Supabase Auth!'
      });
    }

    // 2. Resilient Fallback Store (for immediate local offline testing)
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      phone: phone || '9876543210',
      email,
      role: (role as UserRole) || 'farmer',
      village: village || 'Sonipat',
      preferred_language: 'hi',
      created_at: new Date().toISOString()
    };

    // Store in memory
    const existing = db.getUsers();
    if (!existing.some(u => u.email === email)) {
      existing.push(newUser);
    }

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Account created successfully (KisanSetu Local Auth Engine)'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
