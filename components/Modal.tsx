import { FC, useEffect } from 'react'
import { FiX } from 'react-icons/fi'

import Transition from './Transition'

type Props = {
  isOpen: boolean
  close: () => void
  title?: string
  closeBtn?: boolean
}

const Modal: FC<Props> = ({ isOpen, close, title, children, closeBtn = true }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Esc' || event.key === 'Escape') {
        close()
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button
        className={`${
          isOpen ? 'flex' : 'hidden'
        } absolute inset-0 w-full h-full bg-gray-700 bg-opacity-20 cursor-default z-20`}
        tabIndex={-1}
        onClick={close}
      />
      <Transition
        show={isOpen}
        enter="transition-opacity ease-in duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-1"
        leave="transition-opacity ease-in duration-150"
        leaveFrom="opacity-1"
        leaveTo="opacity-0"
      >
        <div
          style={{ height: 'fit-content' }}
          className="fixed z-20 max-w-lg w-full md:w-1/2 inset-0 m-auto bg-white px-6 py-4 shadow-lg rounded-2xl"
        >
          <div className="flex justify-between items-center mb-5">
            {title && (
              <h1 className="font-display text-xl font-medium tracking-wider text-gray-700">
                {title}
              </h1>
            )}
            {closeBtn && (
              <div className="flex-1 flex justify-end">
                <button
                  className="w-9 h-9 rounded-full hover:bg-gray-100 text-gray-500 flex justify-center items-center"
                  onClick={close}
                >
                  <FiX size={26} />
                </button>
              </div>
            )}
          </div>
          {children}
        </div>
      </Transition>
    </>
  )
}

export default Modal
