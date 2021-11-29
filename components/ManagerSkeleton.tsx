import type { FC } from 'react'

const ManagerSkeleton: FC = () => (
  <div className="flex-1 bg-gray-200 py-6 px-4 border-2 flex flex-col justify-center items-center space-y-4 transition-all duration-300 rounded-2xl ease-in-out border-white animate-pulse h-44" />
)

export default ManagerSkeleton
