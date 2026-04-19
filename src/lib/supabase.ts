import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';
const serviceRole = import.meta.env.SUPABASE_SERVICE_ROLE ?? '';

let _public: SupabaseClient | null = null;
let _admin: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_public) {
    if (!url || !anonKey) throw new Error('Supabase public env missing');
    _public = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return _public;
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const key = serviceRole || anonKey;
    if (!url || !key) throw new Error('Supabase admin env missing');
    _admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}

export const TABLES = {
  waitlist: 'meridian_waitlist',
  content: 'meridian_content',
} as const;
