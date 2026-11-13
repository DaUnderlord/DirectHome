import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from './flutterwavePayments.js'

function env(name) {
  return String(process.env[name] || '').trim()
}

/** Admin-only list of estimator leads, newest first. */
export async function listEstimatorLeads(authHeader) {
  const access = await requireAdmin(authHeader)
  if (!access.ok) return access

  const url = env('SUPABASE_URL') || env('VITE_SUPABASE_URL')
  const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !serviceKey) {
    return { ok: false, status: 503, error: 'Database is not configured (SUPABASE_SERVICE_ROLE_KEY).' }
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })
  const rows = []
  const pageSize = 1000
  for (let from = 0; from < 20000; from += pageSize) {
    const { data, error } = await supabase
      .from('estimator_leads')
      .select(
        'id, created_at, updated_at, email, full_name, phone, persona, state, marketing_consent, consent_at, user_id, estimate_count, last_estimate_at, last_building_type, last_build_city'
      )
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1)
    if (error) {
      console.warn('DirectHome: could not load leads', error.message)
      return { ok: false, status: 500, error: 'Could not load leads.' }
    }
    rows.push(...(data || []))
    if (!data || data.length < pageSize) break
  }

  return { ok: true, leads: rows }
}
