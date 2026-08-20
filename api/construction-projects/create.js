import { createConstructionProject } from '../../server/constructionProjects.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const result = await createConstructionProject({
      title: body.title,
      specs: body.specs,
      authToken: req.headers.authorization,
    })
    res.status(result.status || (result.ok ? 200 : 400)).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Could not create project.' })
  }
}
