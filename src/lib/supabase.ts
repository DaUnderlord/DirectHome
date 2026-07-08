import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { supabaseUrl, supabaseAnonKey } from '../utils/env';

// If Supabase env vars aren't configured yet, we still create a "dummy" client
// so the app can render (pages will fall back to mock data when `allowMockDataFallback` is true).
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

const safeSupabaseUrl = hasSupabaseConfig ? supabaseUrl! : 'https://invalid.supabase.co';
const safeSupabaseAnonKey = hasSupabaseConfig ? supabaseAnonKey! : 'invalid-anon-key';

if (import.meta.env.PROD && !hasSupabaseConfig) {
  console.warn('DirectHome: Supabase is not configured yet. Using mock fallback.');
}

export const supabase = createClient<Database>(safeSupabaseUrl, safeSupabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type { Database };
