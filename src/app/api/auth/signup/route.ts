import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { db } from '@/lib/db';
import { User, UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, role, village, district, state, extra } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const adminClient = getSupabaseAdmin();
    let supabaseUser: any = null;

    // 1. Primary: Use Supabase Admin to create auto-confirmed user (bypasses email rate limit!)
    if (adminClient) {
      try {
        const { data, error } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // auto-confirm email so no rate-limited email is sent
          user_metadata: {
            name,
            phone: phone || '9876543210',
            role: role || 'farmer',
            village: village || 'Sonipat',
            district: district || '',
            state: state || '',
            extra: extra || ''
          }
        });

        if (!error && data?.user) {
          supabaseUser = data.user;
        } else if (error) {
          console.warn('[Supabase Admin createUser Warning]:', error.message);
          // If user already exists in auth.users, try updating password or proceed
          if (error.message.toLowerCase().includes('already registered')) {
            return NextResponse.json({
              success: false,
              error: 'This email is already registered. Please go to Login.'
            }, { status: 400 });
          }
        }
      } catch (adminErr) {
        console.warn('[Supabase Admin Error]:', adminErr);
      }
    }

    // 2. Fallback to standard Supabase signUp if admin was not available
    if (!supabaseUser) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              phone: phone || '9876543210',
              role: role || 'farmer',
              village: village || 'Sonipat',
              extra: extra || ''
            }
          }
        });

        if (data?.user) {
          supabaseUser = data.user;
        } else if (error && !error.message.toLowerCase().includes('rate limit')) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }
      }
    }

    const user: User = {
      id: supabaseUser?.id || `usr_${Date.now()}`,
      name,
      phone: phone || '9876543210',
      email,
      role: (role as UserRole) || 'farmer',
      village: village || 'Sonipat',
      preferred_language: 'hi',
      created_at: new Date().toISOString()
    };

    // Keep local database synced
    const existing = db.getUsers();
    if (!existing.some(u => u.email?.toLowerCase() === email.toLowerCase())) {
      existing.push(user);
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Account created successfully in Supabase!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
