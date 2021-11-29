import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from 'lib/db'
import { App } from 'types/app'
import { Error } from 'types/shared'
import sortByName from 'utils/sort-by-name'

type Data = {
  apps: App[]
}

const route = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed to this route' })
  }
  const newApp: App = req.body

  await db.apps.add(newApp)

  const data = (await db.apps.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  return res.status(200).json({ apps: data.sort(sortByName) })
}

export default route
