import type { FC } from 'react'
import Image from 'next/image'
import { BiCheck, BiImageAlt } from 'react-icons/bi'

import { App } from 'types/app'
import loader from 'utils/img-loader'

import AppSkeleton from './AppSkeleton'

type Item = App[]

type Props = {
  items: Item
  onClickAction?: (itemId: string) => void | undefined
  activeItem?: string[]
  selectedApps?: string[]
  loading: boolean
}

const NonSelectableItem: FC = ({ children }) => (
  <div className="py-4 px-5 flex bg-white rounded-2xl items-center space-x-3 transition-all duration-300 shadow-sm ease-in-out">
    {children}
  </div>
)

type ItemProps = Partial<Props> & {
  item: App
}

const SelectableItem: FC<ItemProps> = ({ onClickAction, item, activeItem, children }) => (
  <div
    onClick={onClickAction ? () => onClickAction(item.id || '') : undefined}
    className={`cursor-pointer py-4 px-5 flex bg-white rounded-2xl items-center space-x-3 transition-all duration-300 shadow-sm ease-in-out${
      activeItem?.includes(item.id || '') ? ' border-gray-600' : ''
    } hover:shadow-lg`}
  >
    {children}
    <button
      className={`w-6 h-6 rounded-full border-2 text-white${
        activeItem?.includes(item.id || '') ? ' bg-gray-800 border-gray-800' : ' border-gray-200'
      }`}
    >
      {activeItem?.includes(item.id || '') ? <BiCheck size={18} /> : null}
    </button>
  </div>
)

const ListItem: FC<ItemProps> = ({ onClickAction, item, activeItem, children }) =>
  onClickAction ? (
    <SelectableItem item={item} activeItem={activeItem} onClickAction={onClickAction}>
      {children}
    </SelectableItem>
  ) : (
    <NonSelectableItem>{children}</NonSelectableItem>
  )

const AppListing: FC<Props> = ({ items, onClickAction, activeItem, selectedApps, loading }) => (
  <>
    <div className="grid grid-flow-row grid-cols-4 gap-5">
      {!loading &&
        items
          .filter((item) => (!selectedApps ? item : selectedApps.includes(item.id || '')))
          .map((item) => (
            <ListItem
              key={item.id}
              item={item}
              activeItem={activeItem}
              onClickAction={onClickAction}
            >
              {item.logo ? (
                <div className="relative w-9 h-9">
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
              <p className="font-semibold text-gray-800 flex-1 text-left">{item.name}</p>
            </ListItem>
          ))}
      {loading && [...Array(4)].map((_, i) => <AppSkeleton key={i} />)}
    </div>
    {!loading &&
      !items.filter((item) => (!selectedApps ? item : selectedApps.includes(item.id || '')))
        .length && (
        <div className="flex justify-center items-center h-20">
          <p className="text-gray-700 uppercase font-semibold tracking-wide">
            No apps {!selectedApps ? 'available' : 'selected'}
          </p>
        </div>
      )}
  </>
)

export default AppListing
