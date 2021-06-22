import { createContext } from 'react'

export type User = {
  name: string
  avatar: string
  id: string
}

type AuthContext = {
  user?: User
  sign: () => Promise<void>
}

export const authContext = createContext<AuthContext>({ sign: async () => {} })
