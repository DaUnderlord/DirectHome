import { listConstructionProjects } from '../../server/constructionProjects.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const result = await listConstructionProjects({
      authToken: req.headers.authorization,
    })
    res.status(result.status || (result.ok ? 200 : 400)).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Could not load projects.' })
  }
}
