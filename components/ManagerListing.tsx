import type { FC, SyntheticEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BiImageAlt } from 'react-icons/bi'
import { FiClipboard } from 'react-icons/fi'

import loader from 'utils/img-loader'
import { Manager } from 'types/manager'
import useNotificationStore from 'store/notification'

import ManagerSkeleton from './ManagerSkeleton'

type Item = Manager[]

type Props = {
  items: Item
  onClickAction?: (itemId: string) => void | undefined
  activeItem?: string[]
  loading: boolean
}

type ItemProps = Partial<Props> & {
  item: Manager
}

const SelectableItem: FC<ItemProps> = ({ onClickAction, item, activeItem, children }) => (
  <button
    onClick={onClickAction ? () => onClickAction(item.id || '') : undefined}
    className={`flex-1 bg-white py-6 px-4 border-2 flex flex-col justify-center items-center space-y-4 transition-all duration-300 rounded-2xl ease-in-out${
      activeItem?.includes(item.id || '') ? ' border-gray-700 shadow-lg' : ' border-white shadow-sm'
    } hover:shadow-lg`}
  >
    {children}
  </button>
)

const ManagerListing: FC<Props> = ({ items, onClickAction, activeItem, loading }) => {
  const { pathname } = useRouter()
  const isAdmin = pathname.includes('admin')
  const notify = useNotificationStore((state) => state.notify)

  const copyToClipboard = (event: SyntheticEvent, command: string) => {
    event.stopPropagation()
    navigator.clipboard.writeText(command)
    notify('Copied to your clipboard')
  }

  return (
    <>
      <div className="grid grid-flow-row grid-cols-4 gap-7">
        {!loading &&
          items.map((item) => (
            <SelectableItem
              key={item.id}
              item={item}
              activeItem={activeItem}
              onClickAction={onClickAction}
            >
              {item.logo ? (
                <div className="relative w-full h-9">
                  <Image
                    loader={loader}
                    src={item.logo}
                    alt={item.name}
                    layout="fill"
                    className="object-contain w-full relative"
                  />
                </div>
              ) : (
                <BiImageAlt size={32} className="text-gray-600" />
              )}
              <p className="font-semibold text-gray-800 text-lg tracking-wide">{item.name}</p>
              {!isAdmin ? (
                <div
                  className="flex items-center space-x-2 cursor-pointer py-1 px-3 rounded-2xl transition-all bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
                  onClick={(e) => copyToClipboard(e, (item as Manager).installCommand)}
                >
                  <FiClipboard size={18} />
                  <span>Install manager</span>
                </div>
              ) : null}
            </SelectableItem>
          ))}
        {loading && [...Array(4)].map((_, i) => <ManagerSkeleton key={i} />)}
      </div>
      {!loading && !items.length && (
        <div className="flex justify-center items-center h-16">
          <p className="text-gray-700 uppercase font-semibold tracking-wide">
            No Package Managers to show
          </p>
        </div>
      )}
    </>
  )
}

export default ManagerListing
