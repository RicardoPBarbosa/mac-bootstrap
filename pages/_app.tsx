import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import 'styles/globals.css'
import AuthUserProvider from 'hooks/useAuthUser'

import InvalidDevice from 'components/InvalidDevice'

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const [isValid, setIsValid] = useState<boolean>(true)

  useEffect(() => {
    const handleResize = () => {
      setIsValid(window.innerWidth > 960 && !!window.navigator.platform.match(/^Mac/))
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isValid) {
    return <InvalidDevice />
  }

  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  )
}

export default App
