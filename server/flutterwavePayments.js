import { createClient } from '@supabase/supabase-js'

const TOOL_REPORT_PRICE_NGN = 399
const TOOL_IDS = new Set(['construction-estimator', 'rent-calculator'])

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

function isLocalDev() {
  return env('NODE_ENV') !== 'production' && !env('VERCEL')
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    String(value || '')
  )
}

function mapFlutterwaveRecord(data, fallback = {}) {
  const toolId = data?.meta?.toolId || fallback.toolId || ''
  const customer = data?.customer || {}
  return {
    customer_name: String(customer.name || fallback.customerName || '').trim() || null,
    customer_email: String(customer.email || fallback.customerEmail || '').trim().toLowerCase(),
    customer_phone: String(customer.phone_number || fallback.customerPhone || '').trim() || null,
    amount: Number(data?.amount ?? TOOL_REPORT_PRICE_NGN),
    currency: data?.currency || 'NGN',
    tool_id: TOOL_IDS.has(toolId) ? toolId : fallback.toolId || 'unknown',
    status: data?.status === 'successful' ? 'completed' : String(data?.status || 'completed'),
    tx_ref: String(data?.tx_ref || fallback.txRef || ''),
    flutterwave_transaction_id: String(data?.id || fallback.transactionId || ''),
    payment_type: data?.payment_type || null,
    user_id: isUuid(data?.meta?.userId || fallback.userId) ? String(data.meta?.userId || fallback.userId) : null,
    created_at: data?.created_at || new Date().toISOString(),
  }
}

async function persistToolPayment(record) {
  const url = supabaseUrl()
  const serviceKey = supabaseServiceKey()
  if (!url || !serviceKey) {
    console.warn('DirectHome: SUPABASE_SERVICE_ROLE_KEY is missing. Payment was verified but not saved.')
    return { saved: false }
  }
  if (!record.customer_email || !record.flutterwave_transaction_id || !record.tx_ref) {
    return { saved: false }
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { error } = await supabase.from('tool_payments').upsert(
    {
      customer_name: record.customer_name,
      customer_email: record.customer_email,
      customer_phone: record.customer_phone,
      amount: record.amount,
      currency: record.currency,
      tool_id: record.tool_id,
      status: record.status,
      tx_ref: record.tx_ref,
      flutterwave_transaction_id: record.flutterwave_transaction_id,
      payment_type: record.payment_type,
      user_id: record.user_id,
    },
    { onConflict: 'flutterwave_transaction_id' }
  )

  if (error) {
    console.warn('DirectHome: could not save tool payment', error.message)
    return { saved: false, error: error.message }
  }
  return { saved: true }
}

export async function verifyFlutterwavePayment({
  transactionId,
  txRef,
  toolId,
  customerEmail,
  customerName,
  userId,
}) {
  const secret = env('FLUTTERWAVE_SECRET_KEY')
  if (!secret) {
    return { ok: false, error: 'Payments are not configured on the server.' }
  }
  if (!transactionId) {
    return { ok: false, error: 'Missing transaction id.' }
  }
  if (!TOOL_IDS.has(toolId)) {
    return { ok: false, error: 'Unknown tool.' }
  }

  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
    { headers: { Authorization: `Bearer ${secret}` } }
  )
  const payload = await response.json()
  const data = payload?.data

  if (payload?.status !== 'success' || data?.status !== 'successful') {
    return { ok: false, error: 'Payment could not be verified.' }
  }
  if (Number(data.amount) !== TOOL_REPORT_PRICE_NGN || data.currency !== 'NGN') {
    return { ok: false, error: 'Payment amount did not match.' }
  }
  if (txRef && data.tx_ref && String(data.tx_ref) !== String(txRef)) {
    return { ok: false, error: 'Payment reference did not match.' }
  }

  const paidTool = data.meta?.toolId || toolId
  if (paidTool !== toolId) {
    return { ok: false, error: 'Payment was for a different tool.' }
  }

  const record = mapFlutterwaveRecord(data, {
    toolId,
    txRef,
    transactionId,
    customerEmail,
    customerName,
    userId,
  })
  await persistToolPayment(record)

  return { ok: true, toolId }
}

async function requireAdmin(authHeader) {
  const token = String(authHeader || '').replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    return { ok: false, status: 401, error: 'Sign in as admin to view payments.' }
  }

  const url = supabaseUrl()
  const anon = supabaseAnonKey()
  if (!url || !anon) {
    return { ok: false, status: 503, error: 'Database is not configured.' }
  }

  const supabase = createClient(url, anon, { auth: { persistSession: false } })
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) {
    return { ok: false, status: 401, error: 'Session expired. Sign in again.' }
  }

  const authed = createClient(url, anon, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data: profile, error: profileError } = await authed
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    return { ok: false, status: 403, error: 'Admin access required.' }
  }

  return { ok: true }
}

async function fetchFlutterwaveTransactions() {
  const secret = env('FLUTTERWAVE_SECRET_KEY')
  if (!secret) return []

  const rows = []
  for (let page = 1; page <= 5; page += 1) {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions?status=successful&page=${page}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    )
    const payload = await response.json()
    const list = Array.isArray(payload?.data) ? payload.data : []
    if (list.length === 0) break
    rows.push(...list)
    const totalPages = Number(payload?.meta?.page_info?.total_pages || 1)
    if (page >= totalPages) break
  }

  return rows
    .filter((tx) => String(tx?.tx_ref || '').startsWith('DH-'))
    .map((tx) => mapFlutterwaveRecord(tx))
}

async function fetchSavedPayments() {
  const url = supabaseUrl()
  const serviceKey = supabaseServiceKey()
  const anon = supabaseAnonKey()
  if (!url || (!serviceKey && !anon)) return []

  const supabase = createClient(url, serviceKey || anon, { auth: { persistSession: false } })
  const { data, error } = await supabase
    .from('tool_payments')
    .select(
      'id, created_at, customer_name, customer_email, customer_phone, amount, currency, tool_id, status, tx_ref, flutterwave_transaction_id, payment_type, user_id'
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('DirectHome: could not load saved payments', error.message)
    return []
  }
  return data || []
}

export async function listToolPayments(authHeader) {
  const access = await requireAdmin(authHeader)
  if (!access.ok && !isLocalDev()) {
    return access
  }

  const [saved, remote] = await Promise.all([fetchSavedPayments(), fetchFlutterwaveTransactions()])
  const byId = new Map()

  for (const row of remote) {
    if (!row.flutterwave_transaction_id) continue
    byId.set(row.flutterwave_transaction_id, row)
    persistToolPayment(row).catch(() => {})
  }
  for (const row of saved) {
    if (row.flutterwave_transaction_id) {
      byId.set(row.flutterwave_transaction_id, row)
    }
  }

  const payments = [...byId.values()].sort((a, b) => {
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })

  return {
    ok: true,
    payments,
    warning: access.ok
      ? undefined
      : 'Showing Flutterwave records in local development. Restore the Direct Home Supabase project to save them permanently.',
  }
}
