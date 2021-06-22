import { ReactNode, useState, useEffect } from 'react'

import { authContext, User } from './auth-context'
import { firebase, auth } from '../services/firebase'

export function AuthProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<User>()

  const signHandler = (user: firebase.User | null) => {
    if (user) {
      const { displayName, photoURL, uid } = user
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      }
      setUser({ name: displayName, avatar: photoURL, id: uid })
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => signHandler(user))
    return () => unsubscribe()
  }, [])

  const signWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)
    signHandler(result.user)
  }

  return (
    <authContext.Provider
      value={{ user, sign: signWithGoogle }}
      children={props.children}
    />
  )
}
