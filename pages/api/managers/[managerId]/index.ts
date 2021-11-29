import type { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseError } from '@firebase/util'

import { db } from 'lib/db'
import firestore from 'lib/firestore'
import sortByName from 'utils/sort-by-name'

import { App } from 'types/app'
import { Error } from 'types/shared'
import { Manager } from 'types/manager'

type Data = {
  managers: Manager[]
}

type AppData = {
  apps: App[]
}

const route = async (req: NextApiRequest, res: NextApiResponse<(Data & AppData) | Error>) => {
  if (req.method !== 'DELETE') {
    return res.status(405).send({ message: 'Only DELETE requests allowed to this route' })
  }
  const { managerId } = req.query

  try {
    await db.managers.doc(`${managerId}`).delete()

    // Delete all apps associated with the deleted manager
    const currentApps = await db.apps.where('managerId', '==', managerId).get()
    const batch = firestore.batch()
    currentApps.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()

    const managers = (await db.managers.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    const apps = (await db.apps.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return res
      .status(200)
      .json({ managers: managers.sort(sortByName), apps: apps.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

export default route
