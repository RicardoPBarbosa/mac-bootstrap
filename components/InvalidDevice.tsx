import type { FC } from 'react'
import { FaRegAngry } from 'react-icons/fa'

const InvalidDevice: FC = () => (
  <div className="w-screen h-screen flex flex-col justify-center items-center overflow-hidden px-4">
    <h1 className="flex items-center space-x-4 font-bold text-4xl sm:text-5xl tracking-wider text-gray-800 mb-6">
      <span>Seriously?</span>
      <FaRegAngry size={45} />
    </h1>
    <h2 className="text-gray-700 tracking-wide w-full md:w-3/5">
      Trying to access a website which the <b>one and only</b> purpose is to setup a terminal
      command <b>EXCLUSIVELY</b> for macOS systems, from another kind of device{' '}
      <span className="font-bold text-xl">??</span>
    </h2>
  </div>
)

export default InvalidDevice
