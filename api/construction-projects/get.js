import { getConstructionProject } from '../../server/constructionProjects.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const projectId = req.query?.id || req.query?.projectId
    const accessHeader = req.headers['x-project-access']
    const accessToken = Array.isArray(accessHeader) ? accessHeader[0] : accessHeader
    const result = await getConstructionProject({
      projectId,
      authToken: req.headers.authorization,
      accessToken,
    })
    res.status(result.status || (result.ok ? 200 : 400)).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Could not load project.' })
  }
}
