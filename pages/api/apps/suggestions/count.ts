import type { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseError } from '@firebase/util'

import { Error } from 'types/shared'
import { db } from 'lib/db'

const route = async (req: NextApiRequest, res: NextApiResponse<{ count: number } | Error>) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ message: 'Only GET requests allowed to this route' })
  }

  try {
    const data = await db.suggestions.get()

    return res.status(200).json({ count: data.docs.length })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

export default route
