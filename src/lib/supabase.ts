import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fwjbyxvxnuldoowoxowf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3amJ5eHZ4bnVsZG9vd294b3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDk2MjMsImV4cCI6MjA4MTQ4NTYyM30.PsepIR8a4T-PRBINFq0THwU8hfy9PAWKSHcIKlolrWk';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type { Database };
