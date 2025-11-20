export type User = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
  subscription_status: 'free' | 'trial' | 'premium'
  trial_ends_at: string | null
}

export type Recipe = {
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
  user?: User
}

export type Badge = {
  id: string
  user_id: string
  badge_type: string
  earned_at: string
}

export type BadgeType = 
  | 'primeira_receita'
  | 'super_chef'
  | 'masterchef'
  | 'chef_lendario'
  | 'criador_semana'

export type BadgeInfo = {
  type: BadgeType
  name: string
  description: string
  icon: string
  requirement: number
}

export const BADGES: Record<BadgeType, BadgeInfo> = {
  primeira_receita: {
    type: 'primeira_receita',
    name: 'Primeira Receita',
    description: 'Enviou sua primeira receita',
    icon: '🌟',
    requirement: 1
  },
  super_chef: {
    type: 'super_chef',
    name: 'Super Chef',
    description: 'Enviou 10 receitas',
    icon: '👨‍🍳',
    requirement: 10
  },
  masterchef: {
    type: 'masterchef',
    name: 'MasterChef',
    description: 'Enviou 50 receitas',
    icon: '🏆',
    requirement: 50
  },
  chef_lendario: {
    type: 'chef_lendario',
    name: 'Chef Lendário',
    description: 'Enviou 100 receitas',
    icon: '👑',
    requirement: 100
  },
  criador_semana: {
    type: 'criador_semana',
    name: 'Criador da Semana',
    description: 'Receita mais curtida da semana',
    icon: '⭐',
    requirement: 1
  }
}

export type IngredientInput = {
  type: 'photo' | 'text' | 'audio'
  data: string | File
}

export type GeneratedRecipe = {
  name: string
  description: string
  image_url: string
  difficulty: 'facil' | 'medio' | 'dificil'
  prep_time: number
  servings: number
  ingredients: string[]
  instructions: string[]
  category: string
  alternatives?: string[]
}
