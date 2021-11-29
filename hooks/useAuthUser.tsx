import { createContext, useContext, FC } from 'react'
import useFirebaseAuth, { FirebaseAuthUser } from './useFirebaseAuth'

const AuthUserContext = createContext<FirebaseAuthUser>({
  authUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

const AuthUserProvider: FC = ({ children }) => {
  const auth = useFirebaseAuth()
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
}

export default AuthUserProvider

export const useAuth = () => useContext(AuthUserContext)
