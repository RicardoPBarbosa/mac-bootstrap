import slugify from 'utils/slugify'
import { Collection, CollectionItem } from 'types/shared'

const createNewCollection = (collections: Collection[], name: string) => {
  const id = generateId(name, collections)
  return {
    id,
    name,
    data: [],
  }
}

const addToCollection = (
  collections: Collection[],
  collectionId: string,
  managerId: string,
  appId: string
): Collection[] => {
  const index = collections.findIndex((collection) => collection.id === collectionId)
  if (index > -1) {
    const collection: Collection = { ...collections[index] }
    const managerIndex = collection.data.findIndex((collId) => collId.managerId === managerId)
    if (managerIndex > -1) {
      const updatedCollectionItem = collection.data[managerIndex]
      if (!updatedCollectionItem.apps.some((item) => item === appId)) {
        updatedCollectionItem.apps.push(appId)
        collection.data[managerIndex] = updatedCollectionItem
        collections[index] = collection
      }
    } else {
      const newCollection: CollectionItem = { managerId, apps: [appId] }
      collection.data.push(newCollection)
    }
  }
  return collections
}

const removeFromCollection = (
  collections: Collection[],
  collectionId: string,
  managerId: string,
  appId: string
): Collection[] => {
  const index = collections.findIndex((collection) => collection.id === collectionId)
  if (index > -1) {
    const collection: Collection = { ...collections[index] }
    const managerIndex = collection.data.findIndex((collId) => collId.managerId === managerId)
    if (managerIndex > -1) {
      const updatedCollectionItem = collection.data[managerIndex]
      const appIndex = updatedCollectionItem.apps.findIndex((item) => item === appId)
      if (appIndex > -1) {
        updatedCollectionItem.apps.splice(appIndex, 1)
        if (!updatedCollectionItem.apps.length) {
          collection.data.splice(managerIndex, 1)
        } else {
          collection.data[managerIndex] = updatedCollectionItem
        }
        collections[index] = collection
      }
    }
  }
  return collections
}

const editCollection = (collections: Collection[], collectionId: string, name: string) => {
  const index = collections.findIndex((collection) => collection.id === collectionId)
  if (index > -1) {
    const collection: Collection = { ...collections[index] }
    collection.name = name
    collections[index] = collection
  }
  return collections
}

const generateId = (name: string, collections: Collection[]) => {
  let id = slugify(name)
  const match = collections.find((collection) => collection.id === id)
  if (match) {
    id = `${id}-${Math.floor(new Date().valueOf() * Math.random())}`
  }
  return id
}

export { createNewCollection, addToCollection, removeFromCollection, editCollection }
