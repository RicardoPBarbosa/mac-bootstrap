import type { FC } from 'react'
import Image from 'next/image'
import { BiEditAlt, BiTrash, BiImageAlt } from 'react-icons/bi'

import { App } from 'types/app'
import { Manager } from 'types/manager'
import loader from 'utils/img-loader'

type Props = {
  list: Manager[] | App[]
  editItem: (item: Manager | App) => void
  deleteItem: (item: Manager | App) => void
}

const ManageTable: FC<Props> = ({ list, editItem, deleteItem }) => (
  <div className="flex flex-col space-y-3">
    {list.map((item) => (
      <div
        key={item.id}
        className="bg-white w-full py-4 px-3 rounded-xl flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {item.logo ? (
            <div className="relative w-6 h-6">
              <Image
                loader={loader}
                src={item.logo}
                alt={item.name}
                layout="fill"
                className="object-contain w-full relative"
              />
            </div>
          ) : (
            <BiImageAlt size={24} className="text-gray-600" />
          )}
          <p className="font-semibold text-gray-800">{item.name}</p>
          {(item as Manager).command ? (
            <small className="text-gray-400">{(item as Manager).command}</small>
          ) : null}
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={() => editItem(item)}
            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-black"
          >
            <BiEditAlt size={20} /> <span>Edit</span>
          </button>
          <button
            onClick={() => deleteItem(item)}
            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-400"
          >
            <BiTrash size={20} /> <span>Delete</span>
          </button>
        </div>
      </div>
    ))}
  </div>
)

export default ManageTable
