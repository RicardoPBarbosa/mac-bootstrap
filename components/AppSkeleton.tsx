import type { FC } from 'react'

const AppSkeleton: FC = () => (
  <div className="cursor-pointer py-4 px-5 flex bg-gray-200 rounded-2xl items-center space-x-3 transition-all duration-300 ease-in-out animate-pulse h-16" />
)

export default AppSkeleton
