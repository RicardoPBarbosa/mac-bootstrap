import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from 'lib/db'
import { Error } from 'types/shared'
import { App, SuggestedAppItem } from 'types/app'
import sortByName from 'utils/sort-by-name'

type Result = {
  suggestions: SuggestedAppItem[]
}

const route = async (
  req: NextApiRequest,
  res: NextApiResponse<Result | { ok: boolean } | Error>
) => {
  if (req.method === 'GET') {
    return await getAllSuggestions(res)
  }
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed to this route' })
  }

  const newApp: App = req.body
  if (await appExists(newApp)) {
    return res.status(400).json({ message: 'The suggested app already exists' })
  }
  await db.suggestions.add(newApp)
  return res.status(201).json({ ok: true })
}

const appExists = async (newApp: App): Promise<boolean> => {
  const apps = await db.apps.where('managerId', '==', newApp.managerId).get()
  if (
    apps.docs.some(
      (app) =>
        app.data().name.toLowerCase().includes(newApp.name.toLowerCase()) ||
        app.data().packageName.toLowerCase().includes(newApp.packageName.toLowerCase())
    )
  ) {
    return true
  }
  const suggestions = await db.suggestions.where('managerId', '==', newApp.managerId).get()
  return suggestions.docs.some(
    (suggestion) =>
      suggestion.data().name.toLowerCase().includes(newApp.name.toLowerCase()) ||
      suggestion.data().packageName.toLowerCase().includes(newApp.packageName.toLowerCase())
  )
}

const getAllSuggestions = async (res: NextApiResponse<Result>) => {
  const suggestions = await db.suggestions.get()
  const managers = await db.managers.get()
  const suggestedAppsWithManager = suggestions.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    manager:
      managers.docs.find((manager) => manager.id === doc.data().managerId)?.data().name || '',
  }))

  return res.status(200).json({ suggestions: suggestedAppsWithManager.sort(sortByName) })
}

export default route
