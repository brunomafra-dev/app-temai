'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import Image from 'next/image'

interface Receita {
  id: string
  titulo: string
  ingredientes: string
  modo_preparo: string
  foto_url: string | null
  created_at: string
}

export default function MinhasReceitasPage() {
  const { user } = useAuth()
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    ingredientes: '',
    modo_preparo: '',
    foto_url: ''
  })

  useEffect(() => {
    if (user) {
      loadReceitas()
    }
  }, [user])

  const loadReceitas = async () => {
    try {
      const { data, error } = await supabase
        .from('receitas_usuario')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReceitas(data || [])
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
      toast.error('Erro ao carregar receitas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('receitas_usuario')
        .insert({
          user_id: user?.id,
          titulo: formData.titulo,
          ingredientes: formData.ingredientes,
          modo_preparo: formData.modo_preparo,
          foto_url: formData.foto_url || null
        })

      if (error) throw error

      toast.success('Receita adicionada com sucesso!')
      setIsDialogOpen(false)
      setFormData({ titulo: '', ingredientes: '', modo_preparo: '', foto_url: '' })
      loadReceitas()
    } catch (error) {
      console.error('Erro ao adicionar receita:', error)
      toast.error('Erro ao adicionar receita')
    }
  }

  const filteredReceitas = receitas.filter(receita =>
    receita.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receita.ingredientes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#505050]">Faça login para ver suas receitas</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Minhas Receitas</h1>
          <p className="text-[#505050]">Gerencie suas receitas favoritas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF7F50] hover:bg-[#FF6A3D] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Receita
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-[#E5E5E5] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#1A1A1A]">Nova Receita</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo" className="text-[#1A1A1A]">Título da Receita</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Bolo de Chocolate"
                  required
                  className="bg-white border-[#E5E5E5] text-[#1A1A1A]"
                />
              </div>
              
              <div>
                <Label htmlFor="ingredientes" className="text-[#1A1A1A]">Ingredientes</Label>
                <Textarea
                  id="ingredientes"
                  value={formData.ingredientes}
                  onChange={(e) => setFormData({ ...formData, ingredientes: e.target.value })}
                  placeholder="Liste os ingredientes, um por linha"
                  required
                  className="min-h-[120px] bg-white border-[#E5E5E5] text-[#1A1A1A]"
                />
              </div>
              
              <div>
                <Label htmlFor="modo_preparo" className="text-[#1A1A1A]">Modo de Preparo</Label>
                <Textarea
                  id="modo_preparo"
                  value={formData.modo_preparo}
                  onChange={(e) => setFormData({ ...formData, modo_preparo: e.target.value })}
                  placeholder="Descreva o passo a passo"
                  required
                  className="min-h-[150px] bg-white border-[#E5E5E5] text-[#1A1A1A]"
                />
              </div>
              
              <div>
                <Label htmlFor="foto_url" className="text-[#1A1A1A]">URL da Foto (opcional)</Label>
                <Input
                  id="foto_url"
                  value={formData.foto_url}
                  onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                  placeholder="https://exemplo.com/foto.jpg"
                  className="bg-white border-[#E5E5E5] text-[#1A1A1A]"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 border-[#E5E5E5] text-[#1A1A1A]"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
                >
                  Salvar Receita
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#505050] w-5 h-5" />
        <Input
          placeholder="Buscar receitas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-[#E5E5E5] text-[#1A1A1A]"
        />
      </div>

      {/* Receitas Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#505050]">Carregando receitas...</p>
        </div>
      ) : filteredReceitas.length === 0 ? (
        <Card className="p-12 text-center bg-white border-[#E5E5E5]">
          <ChefHat className="w-16 h-16 mx-auto mb-4 text-[#505050]" />
          <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">
            {searchTerm ? 'Nenhuma receita encontrada' : 'Nenhuma receita ainda'}
          </h3>
          <p className="text-[#505050] mb-4">
            {searchTerm ? 'Tente buscar por outro termo' : 'Comece adicionando sua primeira receita'}
          </p>
          {!searchTerm && (
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Receita
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReceitas.map((receita) => (
            <Card key={receita.id} className="overflow-hidden bg-white border-[#E5E5E5] hover:shadow-lg transition-shadow">
              {receita.foto_url && (
                <div className="relative h-48 w-full bg-[#FAFAFA]">
                  <Image
                    src={receita.foto_url}
                    alt={receita.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg text-[#1A1A1A]">{receita.titulo}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-[#505050]">Ingredientes:</p>
                    <p className="text-sm text-[#505050] line-clamp-3">{receita.ingredientes}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#505050]">Modo de Preparo:</p>
                    <p className="text-sm text-[#505050] line-clamp-3">{receita.modo_preparo}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-[#E5E5E5] text-[#0088FF] hover:bg-[#0088FF]/10"
                >
                  Ver Receita Completa
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
