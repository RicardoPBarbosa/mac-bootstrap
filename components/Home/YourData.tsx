import type { FC } from 'react'
import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { IoFolderOpen, IoFolderOpenOutline } from 'react-icons/io5'

import { Collection } from 'types/shared'
import useCollectionStore from 'store/collection'

import { confirm } from '../ConfirmModal'
import CollectionModal from './CollectionModal'

const MAX_ALLOWED_COLLECTIONS = 5

type Props = {
  collection: Collection | undefined
  setCollection: (collectionId: string) => void
}

const YourData: FC<Props> = ({ collection, setCollection }) => {
  const collections = useCollectionStore((state) => state.collections)
  const addNewCollection = useCollectionStore((state) => state.addNewCollection)
  const removeCollection = useCollectionStore((state) => state.removeCollection)
  const editCollection = useCollectionStore((state) => state.editCollection)
  const [collectionModal, setCollectionModal] = useState<boolean>(false)
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(null)
  const [currentCollection, setCurrentCollection] = useState<Collection | undefined>(collection)

  const handleChangeCurrentCollection = (collection: Collection) => {
    setCurrentCollection(collection)
    setCollection(collection.id)
  }

  const submitNewCollection = (name: string) => {
    if (collections.length + 1 <= MAX_ALLOWED_COLLECTIONS) {
      addNewCollection(name)
      setCollectionModal(false)
    }
  }

  const submitEditCollection = (id: string, name: string) => {
    editCollection(id, name)
    setCurrentCollection((curr) => (curr ? { ...curr, name } : undefined))
    setCollectionToEdit(null)
    setCollectionModal(false)
  }

  const handleEditRequest = () => {
    if (currentCollection) {
      setCollectionToEdit(currentCollection)
      setCollectionModal(true)
    }
  }

  const handleCloseEditing = () => {
    setCollectionModal(false)
    setCollectionToEdit(null)
  }

  const deleteCollection = async () => {
    if (currentCollection?.id) {
      if (await confirm('Are you sure you want to delete the collection?')) {
        const otherCollection = collections.find(
          (collection) => collection.id !== currentCollection.id
        )
        if (otherCollection) {
          setCurrentCollection(otherCollection)
          setCollection(otherCollection.id)
        }
        removeCollection(currentCollection.id)
      }
    }
  }

  return (
    <>
      <div className="absolute z-0 top-0 left-0 w-full bg-gradient-to-b from-gray-800 to-gray-700">
        <div className="py-20 w-full max-w-6xl m-auto">
          <div className="grid grid-flow-row grid-cols-5 lg:grid-cols-6 gap-4">
            {collections.map((collection) => (
              <div key={collection.id} className="flex-1 relative">
                <button
                  onClick={() => handleChangeCurrentCollection(collection)}
                  className={`w-full flex flex-col items-center relative${
                    currentCollection?.id === collection.id ? ' text-white' : ' text-gray-700'
                  } transition-all duration-300 hover:scale-105`}
                >
                  <IoFolderOpen size="100%" />
                  <div className="absolute inset-0 top-6 z-10 flex justify-center items-center mx-5">
                    <span
                      className={`text-sm font-medium tracking-wide${
                        currentCollection?.id === collection.id
                          ? ' text-gray-800'
                          : ' text-gray-300'
                      }`}
                    >
                      {collection.name}
                    </span>
                  </div>
                </button>
                {currentCollection?.id === collection.id && currentCollection.id !== 'default' ? (
                  <div className="absolute -bottom-4 flex -left-4 -right-4 m-auto space-x-2">
                    <button
                      className="flex-1 flex justify-center items-center space-x-2 py-1 text-sm text-gray-100 bg-gray-600 rounded-md transition-all hover:bg-gray-500"
                      onClick={handleEditRequest}
                    >
                      <BiEditAlt size={18} /> <span>Edit</span>
                    </button>
                    <button
                      className="flex-1 flex justify-center items-center space-x-2 py-1 text-sm text-gray-100 bg-gray-600 rounded-md transition-all hover:bg-gray-500"
                      onClick={deleteCollection}
                    >
                      <BiTrash size={18} /> <span>Delete</span>
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
            <button
              onClick={() => setCollectionModal(true)}
              className="w-full flex flex-col items-center text-white relative disabled:opacity-10 disabled:cursor-default transition-all duration-300 hover:opacity-70"
              disabled={collections.length === MAX_ALLOWED_COLLECTIONS}
            >
              <IoFolderOpenOutline className="new-coll-icon" size="100%" />
              <div className="absolute inset-0 top-7 z-10 flex flex-col justify-center items-center space-y-1">
                <AiOutlinePlus size={26} />
                <span className="text-sm tracking-wide">New Collection</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <CollectionModal
        collection={collectionToEdit}
        isOpen={collectionModal}
        close={handleCloseEditing}
        triggerNewCollectionSubmit={submitNewCollection}
        triggerUpdateCollection={submitEditCollection}
      />
    </>
  )
}

export default YourData
