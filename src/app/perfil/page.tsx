'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Award, Calendar, Mail, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  subscription_status?: string
}

interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  earned_at: string
}

export default function PerfilPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProfile()
      loadBadges()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBadges = async () => {
    // Badges de exemplo - você pode criar uma tabela no Supabase depois
    const exampleBadges: UserBadge[] = [
      {
        id: '1',
        name: 'Primeira Receita',
        description: 'Gerou sua primeira receita',
        icon: '🎉',
        earned_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Chef Iniciante',
        description: 'Gerou 5 receitas',
        icon: '👨‍🍳',
        earned_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Explorador',
        description: 'Visitou a biblioteca',
        icon: '📚',
        earned_at: new Date().toISOString()
      }
    ]
    setBadges(exampleBadges)
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#505050]">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Meu Perfil</h1>
        <p className="text-[#505050]">Gerencie suas informações e conquistas</p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 bg-white border-[#E5E5E5]">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="bg-[#FF7F50] text-white text-2xl">
              {getInitials(profile?.full_name, profile?.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A]">
                {profile?.full_name || 'Usuário'}
              </h2>
              {profile?.subscription_status && (
                <Badge className="mt-2 bg-[#0088FF] text-white">
                  {profile.subscription_status === 'trial' ? 'Trial Gratuito' : 
                   profile.subscription_status === 'pro' ? 'Plano Pro' : 
                   'Plano Iniciante'}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#505050]">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#505050]">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Membro desde {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      <Card className="p-6 bg-white border-[#E5E5E5]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-[#FF7F50]" />
            <h3 className="text-xl font-semibold text-[#1A1A1A]">Insígnias</h3>
          </div>

          {badges.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-16 h-16 mx-auto mb-4 text-[#E5E5E5]" />
              <p className="text-[#505050]">Você ainda não conquistou nenhuma insígnia</p>
              <p className="text-sm text-[#505050] mt-2">
                Continue usando o app para desbloquear conquistas!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className="p-4 bg-[#FAFAFA] border-[#E5E5E5] hover:border-[#FF7F50] transition-all">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1A1A1A]">{badge.name}</h4>
                      <p className="text-sm text-[#505050] mt-1">{badge.description}</p>
                      <p className="text-xs text-[#505050] mt-2">
                        Conquistado em {formatDate(badge.earned_at)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-[#E5E5E5] text-center">
          <div className="text-3xl font-bold text-[#FF7F50]">0</div>
          <p className="text-sm text-[#505050] mt-1">Receitas Geradas</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E5E5] text-center">
          <div className="text-3xl font-bold text-[#0088FF]">0</div>
          <p className="text-sm text-[#505050] mt-1">Receitas Salvas</p>
        </Card>
        <Card className="p-4 bg-white border-[#E5E5E5] text-center">
          <div className="text-3xl font-bold text-[#4A4A4A]">{badges.length}</div>
          <p className="text-sm text-[#505050] mt-1">Insígnias</p>
        </Card>
      </div>
    </div>
  )
}
