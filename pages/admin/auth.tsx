import { useEffect } from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { AiOutlineGoogle } from 'react-icons/ai'

import { useAuth } from 'hooks/useAuthUser'
import Notification from 'components/Notification'

const Auth: NextPage = () => {
  const { authUser, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && authUser) {
      router.push('/admin')
    }
  }, [router, authUser, loading])

  return (
    <>
      <Head>
        <title> Bootstrap - Sign In</title>
      </Head>
      <div className="h-screen flex justify-center items-center bg-gradient-to-b from-gray-800 to-gray-700">
        <button
          className="flex items-center space-x-2 p-4 transition-all hover:opacity-80"
          onClick={signInWithGoogle}
        >
          <AiOutlineGoogle className="text-gray-300" size={24} />
          <p className="text-white tracking-wider font-medium">Sign In</p>
        </button>
      </div>
      <Notification />
    </>
  )
}

export default Auth
