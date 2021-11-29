import { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { IoMdClose } from 'react-icons/io'
import { BsArrowLeft } from 'react-icons/bs'
import { VscPackage } from 'react-icons/vsc'
import { BiCheck, BiImageAlt } from 'react-icons/bi'

import loader from 'utils/img-loader'
import { useAuth } from 'hooks/useAuthUser'
import { SuggestedAppItem } from 'types/app'
import useNotificationStore from 'store/notification'
import { acceptSuggestion, getSuggestions, rejectSuggestion } from 'requests'

import Layout from 'components/Layout'

const Suggestions: FC = () => {
  const router = useRouter()
  const { authUser, loading, signOut } = useAuth()
  const notify = useNotificationStore((state) => state.notify)
  const [suggestions, setSuggestions] = useState<SuggestedAppItem[]>([])

  const getSuggestionsFromAPI = async () => {
    const data = await getSuggestions()

    if (data.suggestions) {
      setSuggestions(data.suggestions)
    }
    if (data.message) {
      notify(data.message)
    }
  }

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/admin/auth')
    }
    if (!loading && authUser) {
      getSuggestionsFromAPI()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, authUser, loading])

  const acceptApp = async (suggestionId: string | undefined) => {
    if (!suggestionId) {
      return
    }

    const data = await acceptSuggestion(suggestionId)

    if (data.suggestions) {
      setSuggestions(data.suggestions)
    }
    if (data.message) {
      notify(data.message)
    }
  }

  const rejectApp = async (suggestionId: string | undefined) => {
    if (!suggestionId) {
      return
    }
    const data = await rejectSuggestion(suggestionId)

    if (data.suggestions) {
      setSuggestions(data.suggestions)
    }
    if (data.message) {
      notify(data.message)
    }
  }

  return (
    <>
      <Head>
        <title> Bootstrap - Suggestions</title>
      </Head>
      <Layout user={authUser} signOut={signOut}>
        <div className="flex items-center space-x-3">
          <Link href="/admin">
            <a
              href="#"
              className="flex justify-center items-center text-gray-800 w-10 h-10 rounded-full transition-all hover:bg-gray-100"
            >
              <BsArrowLeft size={22} />
            </a>
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 tracking-wider">Suggested Apps</h2>
        </div>
        <div className="grid grid-flow-row grid-cols-3 gap-3 mt-3">
          {suggestions.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-lg flex flex-col items-center py-3 px-4"
            >
              {app.logo ? (
                <div className="relative w-full h-14">
                  <Image
                    loader={loader}
                    src={app.logo}
                    alt={app.name}
                    layout="fill"
                    className="object-contain w-full relative"
                  />
                </div>
              ) : (
                <BiImageAlt size={32} className="text-gray-600" />
              )}
              <p className="font-semibold py-2 text-lg text-gray-800 tracking-wide">{app.name}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2 border-b">
                <VscPackage size={18} />
                <span>{app.manager}</span>
              </div>
              <code className="text-sm text-gray-500 leading-5">{app.packageName}</code>
              <div className="flex w-full space-x-2 mt-3">
                <button
                  className="border py-2 flex-1 flex justify-center items-center text-green-600 rounded-xl border-green-600 transition-all hover:bg-green-50"
                  onClick={() => acceptApp(app.id)}
                >
                  <BiCheck size={26} />
                </button>
                <button
                  className="border py-2 flex-1 flex justify-center items-center text-red-600 rounded-xl border-red-600 transition-all hover:bg-red-50"
                  onClick={() => rejectApp(app.id)}
                >
                  <IoMdClose size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {!suggestions.length && (
          <div className="flex justify-center items-center h-16">
            <p className="text-gray-700 uppercase font-semibold tracking-wide">
              No suggestions to show
            </p>
          </div>
        )}
      </Layout>
    </>
  )
}

export default Suggestions
