'use client'

import { useState, useEffect } from 'react'
import { Search, ExternalLink, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { toast } from 'sonner'

interface ReceitaBiblioteca {
  id: string
  titulo: string
  ingredientes: string
  modo_preparo: string
  foto_url: string | null
  fonte: string | null
}

export default function BibliotecaPage() {
  const [receitas, setReceitas] = useState<ReceitaBiblioteca[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    loadReceitas()
  }, [])

  const loadReceitas = async () => {
    try {
      const { data, error } = await supabase
        .from('receitas_biblioteca')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Se não houver receitas, adicionar algumas de exemplo
      if (!data || data.length === 0) {
        await seedReceitas()
        loadReceitas()
        return
      }
      
      setReceitas(data || [])
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
    } finally {
      setLoading(false)
    }
  }

  const seedReceitas = async () => {
    const receitasExemplo = [
      {
        titulo: 'Bolo de Chocolate Simples',
        ingredientes: '3 ovos, 2 xícaras de açúcar, 2 xícaras de farinha de trigo, 1 xícara de chocolate em pó, 1 xícara de óleo, 1 xícara de água quente, 1 colher de sopa de fermento',
        modo_preparo: '1. Bata os ovos com o açúcar. 2. Adicione o óleo e misture. 3. Acrescente a farinha, o chocolate e misture. 4. Por último, adicione a água quente e o fermento. 5. Asse em forno preaquecido a 180°C por 40 minutos',
        foto_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
        fonte: 'TudoGostoso'
      },
      {
        titulo: 'Arroz de Couve-Flor',
        ingredientes: '1 couve-flor média, 2 colheres de azeite, 2 dentes de alho, Sal e pimenta a gosto, Cheiro verde',
        modo_preparo: '1. Rale a couve-flor no ralador grosso. 2. Aqueça o azeite e refogue o alho. 3. Adicione a couve-flor ralada. 4. Tempere com sal e pimenta. 5. Cozinhe por 5-7 minutos. 6. Finalize com cheiro verde',
        foto_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
        fonte: 'Panelinha'
      },
      {
        titulo: 'Frango Grelhado com Ervas',
        ingredientes: '4 filés de frango, 3 colheres de azeite, 2 dentes de alho, Alecrim fresco, Tomilho, Sal e pimenta',
        modo_preparo: '1. Tempere o frango com sal, pimenta e alho. 2. Adicione as ervas frescas. 3. Deixe marinar por 30 minutos. 4. Grelhe em fogo médio por 6-8 minutos de cada lado. 5. Sirva quente',
        foto_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
        fonte: 'Paneloterapia'
      },
      {
        titulo: 'Salada Caesar Clássica',
        ingredientes: 'Alface romana, 100g de parmesão, Croutons, 2 filés de frango, Molho caesar, Suco de limão',
        modo_preparo: '1. Lave e corte a alface. 2. Grelhe o frango e corte em tiras. 3. Misture a alface com o molho caesar. 4. Adicione o frango, croutons e parmesão. 5. Finalize com limão',
        foto_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
        fonte: 'TudoGostoso'
      },
      {
        titulo: 'Risoto de Cogumelos',
        ingredientes: '2 xícaras de arroz arbóreo, 300g de cogumelos, 1 cebola, 1 litro de caldo de legumes, 100ml de vinho branco, Parmesão ralado, Manteiga',
        modo_preparo: '1. Refogue a cebola na manteiga. 2. Adicione o arroz e torre levemente. 3. Acrescente o vinho e deixe evaporar. 4. Adicione o caldo aos poucos, mexendo sempre. 5. Refogue os cogumelos separadamente. 6. Misture ao risoto com parmesão',
        foto_url: 'https://images.unsplash.com/photo-1476124369491-c4f9c6c6c6c6?w=400&h=300&fit=crop',
        fonte: 'Panelinha'
      },
      {
        titulo: 'Brownie de Chocolate',
        ingredientes: '200g de chocolate meio amargo, 150g de manteiga, 3 ovos, 1 xícara de açúcar, 1/2 xícara de farinha, 1 pitada de sal',
        modo_preparo: '1. Derreta o chocolate com a manteiga. 2. Bata os ovos com o açúcar. 3. Misture o chocolate derretido. 4. Adicione a farinha e o sal. 5. Asse a 180°C por 25-30 minutos',
        foto_url: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=300&fit=crop',
        fonte: 'Paneloterapia'
      }
    ]

    try {
      await supabase.from('receitas_biblioteca').insert(receitasExemplo)
    } catch (error) {
      console.error('Erro ao adicionar receitas de exemplo:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite algo para buscar')
      return
    }

    setSearching(true)
    try {
      const response = await fetch('/api/search-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchTerm,
          page: 1
        })
      })

      if (!response.ok) throw new Error('Erro ao buscar receitas')

      const data = await response.json()
      
      if (data.recipes && data.recipes.length > 0) {
        // Salvar no Supabase
        const { error } = await supabase
          .from('receitas_biblioteca')
          .insert(data.recipes)

        if (!error) {
          toast.success(`${data.recipes.length} novas receitas encontradas!`)
          loadReceitas()
        }
      } else {
        toast.error('Nenhuma receita encontrada')
      }
    } catch (error) {
      console.error('Erro ao buscar receitas:', error)
      toast.error('Erro ao buscar receitas')
    } finally {
      setSearching(false)
    }
  }

  const filteredReceitas = receitas.filter(receita =>
    receita.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receita.ingredientes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedReceitas = filteredReceitas.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const totalPages = Math.ceil(filteredReceitas.length / itemsPerPage)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A]">Biblioteca de Receitas</h1>
        <p className="text-[#505050]">Explore receitas de chefs e sites renomados</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#505050] w-5 h-5" />
          <Input
            placeholder="Buscar receitas na internet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 bg-white border-[#E5E5E5] text-[#1A1A1A]"
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={searching || !searchTerm.trim()}
          className="bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {searching ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {/* Receitas Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#505050]">Carregando receitas...</p>
        </div>
      ) : paginatedReceitas.length === 0 ? (
        <Card className="p-12 text-center bg-white border-[#E5E5E5]">
          <h3 className="text-xl font-semibold mb-2 text-[#1A1A1A]">Nenhuma receita encontrada</h3>
          <p className="text-[#505050]">Tente buscar por outro termo</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedReceitas.map((receita) => (
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
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg text-[#1A1A1A] flex-1">{receita.titulo}</h3>
                    {receita.fonte && (
                      <span className="text-xs bg-[#0088FF]/10 text-[#0088FF] px-2 py-1 rounded-full">
                        {receita.fonte}
                      </span>
                    )}
                  </div>
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
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Receita Completa
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-[#E5E5E5] text-[#1A1A1A]"
              >
                Anterior
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    onClick={() => setPage(p)}
                    className={p === page ? 'bg-[#FF7F50] hover:bg-[#FF6A3D] text-white' : 'border-[#E5E5E5] text-[#1A1A1A]'}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-[#E5E5E5] text-[#1A1A1A]"
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
