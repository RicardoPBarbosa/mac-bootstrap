import { Collection } from './shared'

export type CollectionState = {
  collections: Collection[]
  addNewCollection: (name: string) => void
  removeCollection: (id: string) => void
  editCollection: (id: string, name: string) => void
  uploadCollections: (collections: Collection[]) => void
  addAppToCollection: (collectionId: string, managerId: string, appId: string) => void
  removeAppFromCollection: (collectionId: string, managerId: string, appId: string) => void
}

export type NotificationState = {
  message: string
  notify: (message: string) => void
}
