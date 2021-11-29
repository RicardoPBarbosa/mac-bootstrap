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
  if (req.method === 'POST') {
    return await postNewManager(req, res)
  }

  try {
    const data = (await db.managers.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))

    return res.status(200).json({ managers: data.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

const postNewManager = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  const newManager: Manager = req.body

  await db.managers.add(newManager)

  const data = (await db.managers.get()).docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  return res.status(200).json({ managers: data.sort(sortByName) })
}

export default route
