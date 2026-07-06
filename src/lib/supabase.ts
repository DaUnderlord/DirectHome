import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';
import { supabaseUrl, supabaseAnonKey } from '../utils/env';

if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  console.error(
    'DirectHome: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in production.'
  );
}

export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type { Database };
