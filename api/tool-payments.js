import { listToolPayments } from '../server/flutterwavePayments.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const result = await listToolPayments(req.headers.authorization || req.headers.Authorization)
    res.status(result.status || (result.ok ? 200 : 400)).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Could not load payments.' })
  }
}
