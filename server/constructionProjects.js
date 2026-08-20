import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

function env(name) {
  return String(process.env[name] || '').trim()
}

function supabaseUrl() {
  return env('SUPABASE_URL') || env('VITE_SUPABASE_URL')
}

function supabaseAnonKey() {
  return env('SUPABASE_ANON_KEY') || env('VITE_SUPABASE_ANON_KEY')
}

function supabaseServiceKey() {
  return env('SUPABASE_SERVICE_ROLE_KEY')
}

function bearerToken(authHeader) {
  return String(authHeader || '').replace(/^Bearer\s+/i, '').trim()
}

function serviceClient() {
  const url = supabaseUrl()
  const key = supabaseServiceKey()
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

function authedClient(authHeader) {
  const url = supabaseUrl()
  const anon = supabaseAnonKey()
  const token = bearerToken(authHeader)
  if (!url || !anon || !token) return null
  return createClient(url, anon, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || '')
  )
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

function buildProjectTitle(specs) {
  const type = specs?.buildingType || 'build'
  const beds = specs?.numberOfBedrooms
  const city = specs?.location?.city || specs?.location?.state || 'Nigeria'
  const sqm = specs?.totalSquareMeters
  const parts = []
  if (beds) parts.push(`${beds}-bed`)
  parts.push(String(type).replace(/_/g, ' '))
  if (sqm) parts.push(`${sqm} sqm`)
  parts.push(city)
  return parts.join(' · ').slice(0, 200)
}

function publicSpecs(specs) {
  if (!specs || typeof specs !== 'object') return {}
  return {
    buildingType: specs.buildingType || null,
    numberOfBedrooms: specs.numberOfBedrooms ?? null,
    numberOfBathrooms: specs.numberOfBathrooms ?? null,
    numberOfFloors: specs.numberOfFloors ?? null,
    totalSquareMeters: specs.totalSquareMeters ?? null,
    finishingQuality: specs.finishingQuality || null,
    location: {
      city: specs.location?.city || null,
      state: specs.location?.state || null,
    },
  }
}

function hasEstimateTotals(estimate) {
  return estimate && typeof estimate === 'object' && Number(estimate.grandTotal) > 0
}

function toClientProject(row, { includeEstimate }) {
  const project = {
    id: row.id,
    title: row.title,
    status: row.status,
    created_at: row.created_at,
    paid_at: row.paid_at || null,
    specs: includeEstimate ? row.specs : publicSpecs(row.specs),
  }
  if (includeEstimate && hasEstimateTotals(row.estimate)) {
    project.estimate = row.estimate
  }
  return project
}

async function sessionUser(authHeader) {
  const authed = authedClient(authHeader)
  if (!authed) return null
  const { data, error } = await authed.auth.getUser()
  if (error || !data?.user?.id) return null
  return data.user
}

export async function createConstructionProject({ title, specs, authToken }) {
  const supabase = serviceClient()
  if (!supabase) {
    return { ok: false, status: 503, error: 'Database is not configured.' }
  }
  if (!specs) {
    return { ok: false, status: 400, error: 'Missing project data.' }
  }

  const user = await sessionUser(authToken)
  const accessToken = randomUUID()
  const row = {
    title: String(title || buildProjectTitle(specs)).slice(0, 200),
    specs,
    estimate: {},
    status: 'awaiting_payment',
    user_id: user?.id || null,
    guest_email: normalizeEmail(user?.email) || null,
    access_token: accessToken,
  }

  const { data, error } = await supabase
    .from('construction_projects')
    .insert(row)
    .select('id, title, status, created_at')
    .single()

  if (error) {
    console.warn('DirectHome: could not create construction project', error.message)
    return { ok: false, status: 500, error: 'Could not save project.' }
  }

  return {
    ok: true,
    project: {
      ...data,
      accessToken,
    },
  }
}

export async function getConstructionProject({ projectId, authToken, accessToken }) {
  if (!isUuid(projectId)) {
    return { ok: false, status: 400, error: 'Invalid project id.' }
  }

  const supabase = serviceClient()
  if (!supabase) {
    return { ok: false, status: 503, error: 'Database is not configured.' }
  }

  const { data, error } = await supabase
    .from('construction_projects')
    .select(
      'id, title, status, created_at, paid_at, specs, estimate, user_id, access_token'
    )
    .eq('id', projectId)
    .maybeSingle()

  if (error || !data) {
    return { ok: false, status: 404, error: 'Project not found.' }
  }

  let allowed = false

  if (isUuid(accessToken) && data.access_token === accessToken) {
    allowed = true
  }

  if (!allowed) {
    const user = await sessionUser(authToken)
    if (user?.id && data.user_id === user.id) {
      allowed = true
    }
  }

  if (!allowed) {
    return { ok: false, status: 403, error: 'You do not have access to this project.' }
  }

  const paid = data.status === 'paid'
  return {
    ok: true,
    project: toClientProject(data, { includeEstimate: paid }),
  }
}

export async function markConstructionProjectPaid({
  projectId,
  txRef,
  flutterwaveTransactionId,
  userId,
  guestEmail,
}) {
  if (!isUuid(projectId)) {
    return { ok: false, error: 'Invalid project id.' }
  }

  const supabase = serviceClient()
  if (!supabase) {
    return { ok: false, error: 'Database is not configured.' }
  }

  const { data: existing, error: fetchError } = await supabase
    .from('construction_projects')
    .select('id, status, user_id, guest_email, specs')
    .eq('id', projectId)
    .maybeSingle()

  if (fetchError || !existing) {
    return { ok: false, error: 'Project not found.' }
  }

  if (existing.status === 'paid') {
    return { ok: true, alreadyPaid: true }
  }

  const patch = {
    status: 'paid',
    paid_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tx_ref: txRef || null,
    flutterwave_transaction_id: flutterwaveTransactionId || null,
  }

  if (isUuid(userId) && !existing.user_id) {
    patch.user_id = userId
  }

  const email = normalizeEmail(guestEmail)
  if (email && !existing.guest_email) {
    patch.guest_email = email
  }

  const { error } = await supabase.from('construction_projects').update(patch).eq('id', projectId)

  if (error) {
    console.warn('DirectHome: could not mark project paid', error.message)
    return { ok: false, error: 'Could not unlock project.' }
  }

  return { ok: true }
}

export async function listConstructionProjects({ authToken }) {
  const user = await sessionUser(authToken)
  if (!user?.id) {
    return { ok: false, status: 401, error: 'Sign in required.' }
  }

  const supabase = serviceClient()
  if (!supabase) {
    return { ok: false, status: 503, error: 'Database is not configured.' }
  }

  const { data, error } = await supabase
    .from('construction_projects')
    .select('id, title, status, created_at, paid_at, specs, estimate')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('DirectHome: list construction projects failed', error.message)
    return { ok: false, status: 500, error: 'Could not load projects.' }
  }

  return {
    ok: true,
    projects: (data || []).map((row) =>
      toClientProject(row, { includeEstimate: row.status === 'paid' })
    ),
  }
}

export { buildProjectTitle }

export async function claimGuestConstructionProjects({ authToken }) {
  const user = await sessionUser(authToken)
  if (!user?.email) {
    return { ok: false, status: 401, error: 'Sign in required.' }
  }

  const supabase = serviceClient()
  if (!supabase) {
    return { ok: false, status: 503, error: 'Database is not configured.' }
  }

  const email = normalizeEmail(user.email)
  const { data, error } = await supabase
    .from('construction_projects')
    .update({
      user_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .is('user_id', null)
    .eq('guest_email', email)
    .select('id')

  if (error) {
    console.warn('DirectHome: claim guest projects failed', error.message)
    return { ok: false, status: 500, error: 'Could not claim projects.' }
  }

  return { ok: true, claimed: data?.length || 0 }
}
