import type { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseError } from '@firebase/util'

import { db } from 'lib/db'
import { Error } from 'types/shared'
import { Manager } from 'types/manager'
import sortByName from 'utils/sort-by-name'

type Data = {
  managers: Manager[]
}

const route = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  if (req.method !== 'PATCH') {
    return res.status(405).send({ message: 'Only PATCH requests allowed to this route' })
  }
  const { managerId } = req.query
  const body: Manager = req.body

  try {
    await db.managers.doc(`${managerId}`).update(body)

    const data = (await db.managers.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    return res.status(200).json({ managers: data.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

export default route
