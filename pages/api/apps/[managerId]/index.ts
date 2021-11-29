import type { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseError } from '@firebase/util'

import { db } from 'lib/db'
import { App } from 'types/app'
import { Error } from 'types/shared'
import sortByName from 'utils/sort-by-name'

type Data = {
  apps: App[]
}

const ALL_APPS = 'ALL'

const route = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  if (req.method === 'DELETE') {
    return await deleteApp(req, res)
  }
  const { managerId } = req.query

  try {
    if (managerId === ALL_APPS) {
      const data = (await db.apps.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))

      return res.status(200).json({
        apps: data.sort(sortByName),
      })
    }

    const data = (await db.apps.where('managerId', '==', managerId).get()).docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))

    return res.status(200).json({ apps: data.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

const deleteApp = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  const { managerId: appId } = req.query

  try {
    await db.apps.doc(`${appId}`).delete()

    const data = (await db.apps.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return res.status(200).json({ apps: data.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

export default route
