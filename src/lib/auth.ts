import { supabase } from './supabase'
import type { User } from './types'

export async function signUp(email: string, password: string, name: string) {
  // Criar usuário no auth COM confirmação de email obrigatória
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // URL de redirecionamento após confirmar email
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        name: name,
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  })

  if (authError) throw authError

  // Verificar se o usuário precisa confirmar email
  if (authData.user && !authData.user.confirmed_at) {
    console.log('Email de confirmação enviado para:', email)
    // Retornar informação de que email foi enviado
    return {
      ...authData,
      message: 'Email de confirmação enviado! Verifique sua caixa de entrada.'
    }
  }

  // Se o usuário foi criado e confirmado automaticamente
  if (authData.user) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Tentar inserir dados do usuário na tabela users
    try {
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        })

      if (userError) {
        console.error('Erro ao criar perfil:', userError)
      }
    } catch (err) {
      console.error('Erro ao inserir usuário:', err)
    }
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

  // Tentar buscar dados do usuário
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erro ao buscar usuário:', error)
    // Se não encontrar na tabela, criar entrada
    try {
      const { data: newUser } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email!.split('@')[0],
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single()
      
      return newUser
    } catch (insertError) {
      console.error('Erro ao criar usuário:', insertError)
      // Retornar dados básicos do auth
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email!.split('@')[0],
        subscription_status: 'trial',
        trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: user.created_at,
        updated_at: new Date().toISOString()
      }
    }
  }
  
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

// Função para reenviar email de confirmação
export async function resendConfirmationEmail(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) throw error
  return data
}
