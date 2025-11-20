import { supabase } from './supabase'
import type { User } from './types'

export async function signUp(email: string, password: string, name: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  if (authData.user) {
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
      })

    if (userError) throw userError
  }

  return authData
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
