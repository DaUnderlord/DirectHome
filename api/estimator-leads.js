import { listEstimatorLeads } from '../server/estimatorLeadsAdmin.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const result = await listEstimatorLeads(req.headers.authorization || req.headers.Authorization)
    res.setHeader('Cache-Control', 'no-store')
    res.status(result.status || (result.ok ? 200 : 400)).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Could not load leads.' })
  }
}
