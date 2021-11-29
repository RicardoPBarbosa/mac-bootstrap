import type { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseError } from '@firebase/util'

import { db } from 'lib/db'
import { App } from 'types/app'
import { Error } from 'types/shared'
import sortByName from 'utils/sort-by-name'

type Data = {
  apps: App[]
}

const route = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  if (req.method !== 'PATCH') {
    return res.status(405).send({ message: 'Only PATCH requests allowed to this route' })
  }
  const { managerId: appId } = req.query
  const body: App = req.body

  try {
    await db.apps.doc(`${appId}`).update(body)

    const data = (await db.apps.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return res.status(200).json({ apps: data.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

export default route
