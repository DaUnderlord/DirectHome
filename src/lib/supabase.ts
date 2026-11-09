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

export function isAuthNetworkFailure(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as { name?: string; message?: string };
  const message = String(err.message || '');
  return (
    err.name === 'AuthRetryableFetchError' ||
    message.includes('Failed to fetch') ||
    message.includes('NetworkError') ||
    message.includes('ERR_NAME_NOT_RESOLVED')
  );
}

let abandonedUnreachableSession = false;

export async function abandonUnreachableAuthSession(reason: unknown): Promise<void> {
  if (abandonedUnreachableSession) return;
  abandonedUnreachableSession = true;

  console.warn('DirectHome: Supabase auth host is unreachable; stopping token refresh.', {
    url: supabaseUrl || '(missing VITE_SUPABASE_URL)',
    reason: reason instanceof Error ? reason.message : String(reason),
  });

  try {
    supabase.auth.stopAutoRefresh();
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    /* ignore — local storage is cleared below */
  }

  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_refresh_token');
  localStorage.removeItem('auth_expires_at');
}

/**
 * Undo abandonUnreachableAuthSession() after a successful sign-in. Without this, a slow
 * network earlier in the page's life left token refresh stopped for good, so the next
 * session silently expired an hour after logging back in.
 */
export function resumeAuthRefresh(): void {
  abandonedUnreachableSession = false;
  try {
    void supabase.auth.startAutoRefresh();
  } catch {
    /* ignore */
  }
}

/**
 * Best-effort reachability probe. It never signs anyone out: a slow mobile connection
 * (common on Nigerian networks) is not proof that a saved session is dead.
 */
export async function ensureSupabaseReachable(timeoutMs = 8000): Promise<boolean> {
  if (!hasSupabaseConfig) return false;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(`${safeSupabaseUrl}/auth/v1/health`, {
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

export function hasSupabaseConfiguration(): boolean {
  return hasSupabaseConfig;
}

export type { Database };
