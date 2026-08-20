import { claimGuestConstructionProjects } from '../../server/constructionProjects.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' })
    return
  }

  try {
    const result = await claimGuestConstructionProjects({
      authToken: req.headers.authorization,
    })
    res.status(result.status || (result.ok ? 200 : 400)).json(result)
  } catch {
    res.status(500).json({ ok: false, error: 'Could not claim projects.' })
  }
}
