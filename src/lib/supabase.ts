import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          subscription_status: 'free' | 'trial' | 'premium'
          trial_ends_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          image_url: string | null
          difficulty: 'facil' | 'medio' | 'dificil'
          prep_time: number
          servings: number
          ingredients: string[]
          instructions: string[]
          category: string
          is_curated: boolean
          likes_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['recipes']['Row'], 'id' | 'created_at' | 'likes_count'>
        Update: Partial<Database['public']['Tables']['recipes']['Insert']>
      }
      badges: {
        Row: {
          id: string
          user_id: string
          badge_type: string
          earned_at: string
        }
        Insert: Omit<Database['public']['Tables']['badges']['Row'], 'id' | 'earned_at'>
        Update: Partial<Database['public']['Tables']['badges']['Insert']>
      }
      recipe_likes: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['recipe_likes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['recipe_likes']['Insert']>
      }
      comments: {
        Row: {
          id: string
          user_id: string
          recipe_id: string
          content: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['comments']['Insert']>
      }
    }
  }
}
