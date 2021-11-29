import type { NextApiRequest, NextApiResponse } from 'next'

import { Error } from 'types/shared'

const route = (req: NextApiRequest, res: NextApiResponse<string | Error>) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed to this route' })
  }
  const data: string = req.body

  res.setHeader('Content-Type', 'application/JSON')
  res.setHeader('Content-Disposition', 'attachment; filename=mac-bootstrap.export.json')
  return res.status(200).send(data)
}

export default route
