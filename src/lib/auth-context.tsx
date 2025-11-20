'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/lib/types'
import { getCurrentUser } from '@/lib/auth'

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await refreshUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
