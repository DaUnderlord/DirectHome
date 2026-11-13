import { supabase } from '../lib/supabase';

export interface EstimatorLeadRecord {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string;
  phone: string | null;
  persona: string | null;
  state: string | null;
  marketing_consent: boolean;
  consent_at: string | null;
  user_id: string | null;
  estimate_count: number;
  last_estimate_at: string | null;
  last_building_type: string | null;
  last_build_city: string | null;
}

export async function fetchEstimatorLeads(): Promise<{
  success: boolean;
  leads: EstimatorLeadRecord[];
  error?: string;
}> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  const response = await fetch('/api/estimator-leads', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const payload = (await response.json().catch(() => null)) as {
    ok?: boolean;
    leads?: EstimatorLeadRecord[];
    error?: string;
  } | null;

  if (!response.ok || !payload?.ok) {
    return { success: false, leads: [], error: payload?.error || 'Could not load leads.' };
  }
  return { success: true, leads: payload.leads || [] };
}
