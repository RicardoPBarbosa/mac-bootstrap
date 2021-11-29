import type { FC, SyntheticEvent } from 'react'

import { Collection } from 'types/shared'

import Modal from 'components/Modal'

type Props = {
  collection: Collection | null
  isOpen: boolean
  close: () => void
  triggerNewCollectionSubmit: (name: string) => void
  triggerUpdateCollection: (id: string, name: string) => void
}

const Label: FC = ({ children }) => (
  <p className="text-sm text-gray-500 font-semibold mb-2">{children}</p>
)

type FormInputs = {
  name: { value: string }
}

const CollectionModal: FC<Props> = ({
  collection,
  isOpen,
  close,
  triggerNewCollectionSubmit,
  triggerUpdateCollection,
}) => {
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const target = e.target as typeof e.target & FormInputs
    const name = target.name.value

    if (!name.trim().length) {
      return
    }

    if (collection) {
      if (collection.name !== name.trim()) {
        triggerUpdateCollection(collection.id, name.trim())
      }
      return
    }

    triggerNewCollectionSubmit(name.trim())
  }

  return (
    <Modal isOpen={isOpen} close={close} title={collection ? 'Edit Collection' : 'New Collection'}>
      <form onSubmit={handleSubmit}>
        <Label>Name</Label>
        <input
          type="text"
          name="name"
          placeholder="Ex: My Macbook"
          className="w-full rounded-xl bg-white py-3 px-3 mb-5 border-2 transition-all focus:border-gray-800 outline-none"
          defaultValue={collection ? collection.name : ''}
          autoFocus
        />
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="uppercase bg-gray-800 text-white py-3 text-sm tracking-wider font-medium px-6 transition-all hover:bg-gray-700 rounded-xl"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CollectionModal
