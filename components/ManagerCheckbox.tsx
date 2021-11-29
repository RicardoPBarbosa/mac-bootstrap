import type { FC } from 'react'
import Image from 'next/image'

import { Manager } from 'types/manager'
import loader from 'utils/img-loader'

type Props = {
  manager: Manager
  selected: boolean
  onClick: () => void
}

const ManagerCheckbox: FC<Props> = ({ manager, selected, onClick }) => (
  <button
    className={`flex items-center space-x-2 py-2 px-3 border mb-2 rounded-xl ${
      selected ? 'border-gray-700' : ''
    }`}
    type="button"
    onClick={onClick}
  >
    <div className="relative w-7 h-6">
      <Image
        loader={loader}
        src={manager.logo}
        alt={manager.name}
        layout="fill"
        className="object-contain w-full relative"
      />
    </div>
    <p className="font-medium text-sm tracking-wide">{manager.name}</p>
  </button>
)

export default ManagerCheckbox
