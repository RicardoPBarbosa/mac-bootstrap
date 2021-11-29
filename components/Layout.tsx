import { useRef } from 'react'
import Link from 'next/link'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/router'
import type { FC, ChangeEvent } from 'react'
import { AiFillApple } from 'react-icons/ai'
import { GrPowerShutdown } from 'react-icons/gr'
import { BiImport, BiExport } from 'react-icons/bi'

import isValid from 'utils/img-valid'
import parseStateCollection from 'utils/parse-collection'
import { setupExportFile } from 'requests'
import { AuthUser } from 'hooks/useFirebaseAuth'
import useCollectionStore from 'store/collection'

import Notification from './Notification'

const buttonStyles =
  'flex-1 flex justify-center py-2 items-center space-x-2 text-sm text-gray-100 font-medium tracking-wider transition-all leading-loose hover:text-gray-400'

type Props = {
  user?: AuthUser | null
  signOut?: (() => void) | undefined
}

const Layout: FC<Props> = ({ children, user = null, signOut = () => {} }) => {
  const { pathname } = useRouter()
  const isAdmin = pathname.includes('admin')
  const inputRef = useRef<HTMLInputElement>(null)
  const collections = useCollectionStore((state) => state.collections)
  const uploadCollections = useCollectionStore((state) => state.uploadCollections)

  const exportData = async () => {
    const file = await setupExportFile({ collections })
    saveAs(file, 'mac-bootstrap.export.json')
  }

  const importData = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return
    }
    if (isValid(event.target.files[0])) {
      const fileReader = new FileReader()
      fileReader.readAsText(event.target.files[0], 'UTF-8')
      fileReader.onloadend = () => {
        const uploaded = parseStateCollection(fileReader.result as string)
        if (uploaded) {
          uploadCollections(uploaded)
        }
      }
    }
  }

  return (
    <div className="relative">
      <div className="h-14 w-full absolute top-0 m-auto z-10">
        <div className="flex items-center py-2 px-4 xl:px-0 justify-between w-full h-full max-w-6xl m-auto">
          <div className="flex items-end space-x-2">
            <Link href="/" passHref>
              <a href="#">
                <h1
                  className={`uppercase tracking-widest text-sm ${
                    isAdmin ? 'text-gray-800' : 'text-gray-100'
                  } font-bold flex items-end leading-4 space-x-1`}
                >
                  <AiFillApple size={20} /> <span>Bootstrap</span>
                </h1>
              </a>
            </Link>
            {!isAdmin && (
              <span className="text-xs text-gray-400">
                No more wasting time manually configuring your new mac
              </span>
            )}
          </div>
          {isAdmin ? (
            <div className="flex">
              <Link href="/" passHref>
                <a
                  href="#"
                  className="uppercase text-sm text-gray-800 tracking-wider transition-all hover:opacity-70 leading-loose"
                >
                  Home
                </a>
              </Link>
              {user && (
                <button
                  className="border-l border-gray-300 pl-4 ml-4 text-sm text-gray-100 font-semibold tracking-wider transition-all hover:opacity-70"
                  onClick={signOut}
                  title="Sign Out"
                >
                  <GrPowerShutdown size={24} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex space-x-5">
              <input
                ref={inputRef}
                type="file"
                accept="application/JSON"
                onChange={importData}
                className="hidden"
              />
              <button
                onClick={() => (inputRef.current ? inputRef.current.click() : {})}
                className={buttonStyles}
              >
                <BiImport size={20} />
                <span>Import</span>
              </button>
              <button className={buttonStyles} onClick={exportData}>
                <BiExport size={20} />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="pt-20 w-full max-w-6xl m-auto px-4 xl:px-0 min-h-screen pb-10">
        {children}
      </div>
      <div className="w-full max-w-6xl m-auto py-3 text-center text-sm text-gray-500">
        <a
          href="https://ricardopbarbosa.com"
          target="_blank"
          className="transition-all hover:text-gray-900"
          rel="noreferrer"
        >
          ricardopbarbosa
        </a>{' '}
        @ {new Date().getFullYear()}
      </div>
      <Notification />
    </div>
  )
}

export default Layout
