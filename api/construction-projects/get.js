import { getConstructionProject, PREVIEW_SET_COOKIE } from '../../server/constructionProjects.js'

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
      cookies: req.headers.cookie,
    })
    if (result.setPreviewCookie) {
      res.setHeader('Set-Cookie', PREVIEW_SET_COOKIE)
    }
    res.status(result.status || (result.ok ? 200 : 400)).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Could not load project.' })
  }
}
