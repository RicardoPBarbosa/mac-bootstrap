import type { NextApiRequest, NextApiResponse } from 'next'
import { FirebaseError } from '@firebase/util'

import { db } from 'lib/db'
import { App } from 'types/app'
import { Error } from 'types/shared'
import sortByName from 'utils/sort-by-name'

type Data = {
  suggestions: App[]
}

const route = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  const { id } = req.query
  if (req.method === 'PATCH') {
    return await acceptSuggestion(id as string, res)
  }
  if (req.method === 'DELETE') {
    return await rejectSuggestion(id as string, res)
  }
  return res.status(405).send({ message: 'Only PATCH or DELETE requests allowed to this route' })
}

const acceptSuggestion = async (id: string, res: NextApiResponse<Data | Error>) => {
  try {
    const suggestion = await db.suggestions.doc(`${id}`).get()
    if (!suggestion.exists) {
      return res.status(404).json({ message: 'Suggestion not found' })
    }
    await db.apps.add(suggestion.data() as App)
    await db.suggestions.doc(`${id}`).delete()
    const data = (await db.suggestions.get()).docs.map((doc) => doc.data())

    return res.status(200).json({ suggestions: data.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

const rejectSuggestion = async (id: string, res: NextApiResponse<Data | Error>) => {
  try {
    const suggestion = await db.suggestions.doc(`${id}`).get()
    if (!suggestion.exists) {
      return res.status(404).json({ message: 'Suggestion not found' })
    }
    await db.suggestions.doc(`${id}`).delete()
    const data = (await db.suggestions.get()).docs.map((doc) => doc.data())

    return res.status(200).json({ suggestions: data.sort(sortByName) })
  } catch (error) {
    return res.status(500).send({ message: (error as FirebaseError).message })
  }
}

export default route
