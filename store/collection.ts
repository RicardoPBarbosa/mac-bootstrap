/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { devtools, persist } from 'zustand/middleware'
import create, { GetState, SetState, StateCreator, StoreApi } from 'zustand'

import { Collection } from 'types/shared'
import { CollectionState } from 'types/store'
import { addToCollection, createNewCollection, editCollection, removeFromCollection } from './utils'

const log =
  (config: StateCreator<CollectionState>) =>
    (
      set: SetState<CollectionState>,
      get: GetState<CollectionState>,
      api: StoreApi<CollectionState>
    ) =>
      config(
        (args) => {
          set(args)
          if (process.env.NODE_ENV !== 'production') {
            console.log('🐻 collection state', get().collections)
          }
        },
        get,
        api
      )

const DEFAULT: Collection[] = [{
  id: 'default',
  name: 'Default',
  data: []
}]

const useCollectionStore = create<CollectionState>(
  devtools(
    log(
      persist(
        (set, get) => ({
          collections: DEFAULT,
          addNewCollection: (name: string) => {
            const newCollection = createNewCollection(get().collections, name)
            set((state) => ({ collections: [...state.collections, newCollection] }))
          },
          removeCollection: (collectionId: string) => {
            set((state) => ({ collections: state.collections.filter((collection) => collection.id !== collectionId) }))
          },
          editCollection: (collectionId: string, name: string) => {
            const updatedCollections = editCollection(get().collections, collectionId, name)
            set(() => ({ collections: updatedCollections }))
          },
          uploadCollections: (collections: Collection[]) => {
            set(() => ({ collections }))
          },
          addAppToCollection: (collectionId: string, managerId: string, appId: string) => {
            const updatedCollections = addToCollection(get().collections, collectionId, managerId, appId)
            set(() => ({ collections: updatedCollections }))
          },
          removeAppFromCollection: (collectionId: string, managerId: string, appId: string) => {
            const updatedCollections = removeFromCollection(get().collections, collectionId, managerId, appId)
            set(() => ({ collections: updatedCollections }))
          },
        }),
        { name: 'user-collection', version: Number(process.env.npm_package_version) || 1 }
      )
    )
  )
)

export default useCollectionStore
