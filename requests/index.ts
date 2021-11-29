import { App, SuggestedAppItem } from 'types/app'
import { Manager } from 'types/manager'
import { Collection } from 'types/shared'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const getManagers = async () => {
  const response = await fetch('/api/managers')
  const data: { managers?: Manager[]; message?: string } = await response.json()

  return data
}

const getAppsForManager = async (managerId = 'ALL') => {
  const response = await fetch(`/api/apps/${managerId}`)
  const data: { apps?: App[]; message?: string } = await response.json()

  return data
}

const submitNewManager = async (body: Manager) => {
  const response = await fetch('/api/managers', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data: { managers?: Manager[]; message?: string } = await response.json()

  return data
}

const submitNewApp = async (body: App) => {
  const response = await fetch('/api/apps', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data: { apps?: App[]; message?: string } = await response.json()

  return data
}

const submitEditManager = async (manager: Manager) => {
  const response = await fetch(`/api/managers/${manager.id}/edit`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(manager),
  })

  const data: { managers?: Manager[]; message?: string } = await response.json()

  return data
}

const submitEditApp = async (app: App) => {
  const response = await fetch(`/api/apps/${app.id}/edit`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(app),
  })

  const data: { apps?: App[]; message?: string } = await response.json()

  return data
}

const submitDeleteManager = async (managerId: string) => {
  const response = await fetch(`/api/managers/${managerId}`, {
    method: 'DELETE',
    headers,
  })

  const data: { managers?: Manager[]; apps?: App[]; message?: string } = await response.json()

  return data
}

const submitDeleteApp = async (appId: string) => {
  const response = await fetch(`/api/apps/${appId}`, {
    method: 'DELETE',
    headers,
  })

  const data: { apps?: App[]; message?: string } = await response.json()

  return data
}

const setupExportFile = async (contents: { collections: Collection[] }) => {
  const response = await fetch(`/api/data/export`, {
    method: 'POST',
    headers,
    body: JSON.stringify(contents),
  })

  const data = await response.blob()

  return data
}

const getSuggestionCount = async () => {
  const response = await fetch('/api/apps/suggestions/count', {
    method: 'GET',
    headers,
  })

  const data: { count?: number; message?: string } = await response.json()

  return data
}

const getSuggestions = async () => {
  const response = await fetch('/api/apps/suggestions', {
    method: 'GET',
    headers,
  })

  const data: { suggestions?: SuggestedAppItem[]; message?: string } = await response.json()

  return data
}

const submitNewSuggestion = async (body: App) => {
  const response = await fetch('/api/apps/suggestions', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data: { ok?: boolean; message?: string } = await response.json()

  return data
}

const acceptSuggestion = async (suggestionId: string) => {
  const response = await fetch(`/api/apps/suggestions/${suggestionId}`, {
    method: 'PATCH',
    headers,
  })

  const data: { suggestions?: SuggestedAppItem[]; message?: string } = await response.json()

  return data
}

const rejectSuggestion = async (suggestionId: string) => {
  const response = await fetch(`/api/apps/suggestions/${suggestionId}`, {
    method: 'DELETE',
    headers,
  })

  const data: { suggestions?: SuggestedAppItem[]; message?: string } = await response.json()

  return data
}

export {
  getManagers,
  getAppsForManager,
  submitNewManager,
  submitNewApp,
  submitEditManager,
  submitEditApp,
  submitDeleteManager,
  submitDeleteApp,
  setupExportFile,
  getSuggestionCount,
  getSuggestions,
  submitNewSuggestion,
  acceptSuggestion,
  rejectSuggestion,
}
