// Estimator leads: contact details users leave before seeing a free estimate.
// Stored in public.estimator_leads (service role only), one row per email.

const PERSONAS = new Set(['homeowner', 'diaspora', 'developer', 'contractor', 'other'])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Validate and normalise lead details from the client. Returns { ok, lead } or { ok: false, error }. */
export function normalizeLead(input) {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'Please enter your details to see your estimate.' }
  }
  const fullName = clean(input.fullName, 120)
  const email = clean(input.email, 200).toLowerCase()
  const phone = clean(input.phone, 30)
  const persona = clean(input.persona, 20)
  const state = clean(input.state, 60)

  if (fullName.length < 2) return { ok: false, error: 'Please enter your full name.' }
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'Please enter a valid email address.' }
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7 || digits.length > 15) {
    return { ok: false, error: 'Please enter a valid phone or WhatsApp number.' }
  }
  if (!PERSONAS.has(persona)) return { ok: false, error: 'Please tell us who you are.' }
  if (state.length < 2) return { ok: false, error: 'Please choose your state.' }

  return {
    ok: true,
    lead: {
      full_name: fullName,
      email,
      phone,
      persona,
      state,
      marketing_consent: input.marketingConsent === true,
    },
  }
}

/**
 * Insert or update a lead by email. Keeps the first consent timestamp, and only
 * turns consent on (never silently off) from an estimator submission.
 */
export async function upsertLead(supabase, lead, { userId, specs } = {}) {
  const now = new Date().toISOString()
  const { data: existing, error: findError } = await supabase
    .from('estimator_leads')
    .select('id, estimate_count, marketing_consent, consent_at, user_id')
    .eq('email', lead.email)
    .maybeSingle()

  if (findError) {
    console.warn('DirectHome: lead lookup failed', findError.message)
    return { ok: false, error: 'Could not save your details.' }
  }

  const activity = {
    updated_at: now,
    last_estimate_at: now,
    last_building_type: specs?.buildingType || null,
    last_build_city: specs?.location?.city || specs?.location?.state || null,
  }

  if (existing) {
    const consent = existing.marketing_consent || lead.marketing_consent
    const { error } = await supabase
      .from('estimator_leads')
      .update({
        ...activity,
        full_name: lead.full_name,
        phone: lead.phone,
        persona: lead.persona,
        state: lead.state,
        marketing_consent: consent,
        consent_at: existing.consent_at || (lead.marketing_consent ? now : null),
        user_id: existing.user_id || userId || null,
        estimate_count: (existing.estimate_count || 0) + 1,
      })
      .eq('id', existing.id)
    if (error) {
      console.warn('DirectHome: lead update failed', error.message)
      return { ok: false, error: 'Could not save your details.' }
    }
    return { ok: true, id: existing.id }
  }

  const { data, error } = await supabase
    .from('estimator_leads')
    .insert({
      ...activity,
      ...lead,
      consent_at: lead.marketing_consent ? now : null,
      user_id: userId || null,
      estimate_count: 1,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.warn('DirectHome: lead insert failed', error?.message)
    return { ok: false, error: 'Could not save your details.' }
  }
  return { ok: true, id: data.id }
}

export async function linkLeadToProject(supabase, leadId, projectId) {
  if (!leadId || !projectId) return
  await supabase.from('estimator_leads').update({ last_project_id: projectId }).eq('id', leadId)
  await supabase.from('construction_projects').update({ lead_id: leadId }).eq('id', projectId)
}
