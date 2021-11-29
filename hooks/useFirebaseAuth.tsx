import { useState, useEffect } from 'react'
import { User, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'

import firebase from 'lib/firebase'
import useNotificationStore from 'store/notification'

export type AuthUser = {
  uid: string
  email: string | null
}

export type FirebaseAuthUser = {
  authUser: AuthUser | null
  loading: boolean
  signInWithGoogle?: () => void
  signOut?: () => void
}

const formatAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
})

const auth = getAuth(firebase)
const db = getFirestore(firebase)
const provider = new GoogleAuthProvider()

const userIsValid = async (email: string) => {
  const usersCollection = collection(db, 'users')
  const q = query(usersCollection, where('email', '==', email))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.docs.length) {
    return querySnapshot.docs[0].data()
  }

  return null
}

const useFirebaseAuth = (): FirebaseAuthUser => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const notify = useNotificationStore((state) => state.notify)

  const clear = () => {
    setAuthUser(null)
    setLoading(false)
  }

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      clear()
      return
    }

    setLoading(true)
    const formattedUser = formatAuthUser(authState)
    if (formattedUser.email && (await userIsValid(formattedUser.email))) {
      setAuthUser(formattedUser)
    } else {
      setLoading(false)
      notify('Invalid sign in')
    }
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        if (!credential) {
          notify('Invalid sign in')
        }
        const { email } = result.user

        if (email && (await userIsValid(email))) {
          return true
        } else {
          await signOut()
        }
      })
      .catch((error) => {
        if (!error.message.includes('popup-closed-by-user')) {
          notify(error.message)
        }
      })
  }

  const signOut = async () => {
    await auth.signOut().then(clear)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged)
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  }
}

export default useFirebaseAuth
