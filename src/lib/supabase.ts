import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser/Client-side Supabase Client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side Admin Client (bypasses RLS with service role key if configured)
export const getSupabaseAdmin = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey);
};
