import { verifyFlutterwavePayment } from '../server/flutterwavePayments.js'

export { verifyFlutterwavePayment }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const result = await verifyFlutterwavePayment(body)
    res.status(result.ok ? 200 : 400).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Verification failed.' })
  }
}
