'use client'

import { useState, useRef } from 'react'
import { Camera, Mic, FileText, Sparkles, Upload, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Recipe {
  nome: string
  ingredientes: string[]
  modo_preparo: string[]
  tempo_preparo?: string
  dificuldade?: string
  imagem?: string
}

export default function Home() {
  const { user } = useAuth()
  const [inputType, setInputType] = useState<'photo' | 'text' | 'audio' | null>(null)
  const [textInput, setTextInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload para Supabase
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('receitas')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('receitas')
        .getPublicUrl(filePath)

      setImageUrl(publicUrl)
      toast.success('Foto carregada com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      toast.error('Erro ao carregar foto')
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateRecipe = async () => {
    if (!textInput.trim() && !selectedImage) {
      toast.error('Digite ingredientes ou selecione uma foto')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: textInput,
          imageUrl: imageUrl
        })
      })

      if (!response.ok) throw new Error('Erro ao gerar receitas')

      const data = await response.json()
      
      if (data.recipes && data.recipes.length > 0) {
        setRecipes(data.recipes)
        setShowResults(true)
        toast.success(`${data.recipes.length} receitas geradas!`)
      } else {
        toast.error('Nenhuma receita foi gerada')
      }
    } catch (error) {
      console.error('Erro ao gerar receita:', error)
      toast.error('Erro ao gerar receita')
    } finally {
      setGenerating(false)
    }
  }

  const resetForm = () => {
    setInputType(null)
    setTextInput('')
    setSelectedImage(null)
    setImageUrl(null)
    setRecipes([])
    setShowResults(false)
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-[#FF7F50]">
            TemAi?
          </h1>
          <p className="text-xl text-[#505050] max-w-md">
            Nunca Mais Diga Que Não Tem Comida em Casa
          </p>
        </div>

        <Card className="w-full max-w-md p-8 bg-white border-[#E5E5E5]">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-[#1A1A1A]">Bem-vindo!</h2>
            <p className="text-[#505050] text-center">
              Entre ou crie sua conta para começar a gerar receitas incríveis
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/auth/login">
                <Button className="w-full bg-[#FF7F50] hover:bg-[#FF6A3D] text-white">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full border-[#E5E5E5] hover:bg-[#FAFAFA] text-[#1A1A1A]">
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Mostrar resultados das receitas
  if (showResults && recipes.length > 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Receitas Sugeridas</h1>
            <p className="text-[#505050]">Escolha uma das receitas abaixo</p>
          </div>
          <Button 
            variant="outline" 
            onClick={resetForm}
            className="border-[#E5E5E5] text-[#1A1A1A]"
          >
            Nova Busca
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <Card key={index} className="overflow-hidden bg-white border-[#E5E5E5] hover:shadow-lg transition-all">
              {recipe.imagem && (
                <div className="relative h-48 w-full bg-[#FAFAFA]">
                  <Image
                    src={recipe.imagem}
                    alt={recipe.nome}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{recipe.nome}</h3>
                  {recipe.tempo_preparo && (
                    <p className="text-sm text-[#505050]">⏱️ {recipe.tempo_preparo}</p>
                  )}
                  {recipe.dificuldade && (
                    <p className="text-sm text-[#505050]">📊 {recipe.dificuldade}</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">Ingredientes:</h4>
                  <ul className="text-sm text-[#505050] space-y-1">
                    {recipe.ingredientes.slice(0, 4).map((ing, i) => (
                      <li key={i}>• {ing}</li>
                    ))}
                    {recipe.ingredientes.length > 4 && (
                      <li className="text-[#0088FF]">+ {recipe.ingredientes.length - 4} mais...</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">Modo de Preparo:</h4>
                  <ol className="text-sm text-[#505050] space-y-1">
                    {recipe.modo_preparo.slice(0, 3).map((step, i) => (
                      <li key={i}>{i + 1}. {step}</li>
                    ))}
                    {recipe.modo_preparo.length > 3 && (
                      <li className="text-[#0088FF]">+ {recipe.modo_preparo.length - 3} passos...</li>
                    )}
                  </ol>
                </div>

                <Button className="w-full bg-[#FF7F50] hover:bg-[#FF6A3D] text-white">
                  Ver Receita Completa
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-[#FF7F50]">
          O que posso fazer com isso?
        </h1>
        <p className="text-[#505050]">
          Envie seus ingredientes e descubra receitas incríveis
        </p>
      </div>

      {/* Input Type Selection */}
      {!inputType && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card 
            className="p-6 bg-white border-[#E5E5E5] hover:border-[#FF7F50] transition-all cursor-pointer group"
            onClick={() => setInputType('photo')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-4 rounded-full bg-[#FF7F50]/10 group-hover:bg-[#FF7F50]/20 transition-all">
                <Camera className="w-8 h-8 text-[#FF7F50]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A1A]">Tirar Foto</h3>
                <p className="text-sm text-[#505050]">IA identifica os ingredientes</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 bg-white border-[#E5E5E5] hover:border-[#FF7F50] transition-all cursor-pointer group"
            onClick={() => setInputType('text')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-4 rounded-full bg-[#FF7F50]/10 group-hover:bg-[#FF7F50]/20 transition-all">
                <FileText className="w-8 h-8 text-[#FF7F50]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A1A]">Escrever</h3>
                <p className="text-sm text-[#505050]">Digite sua lista</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 bg-white border-[#E5E5E5] hover:border-[#0088FF] transition-all cursor-pointer group"
            onClick={() => setInputType('audio')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-4 rounded-full bg-[#0088FF]/10 group-hover:bg-[#0088FF]/20 transition-all">
                <Mic className="w-8 h-8 text-[#0088FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A1A]">Falar</h3>
                <p className="text-sm text-[#505050]">Grave sua lista (Premium)</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Text Input */}
      {inputType === 'text' && (
        <Card className="p-6 bg-white border-[#E5E5E5]">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#1A1A1A]">Liste seus ingredientes</h3>
            <Textarea
              placeholder="Ex: 2 ovos, 1 xícara de farinha, 200ml de leite..."
              className="min-h-[200px] bg-white border-[#E5E5E5] text-[#1A1A1A] placeholder:text-[#505050]"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#FAFAFA]"
                onClick={() => {
                  setInputType(null)
                  setTextInput('')
                }}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
                disabled={!textInput.trim() || generating}
                onClick={handleGenerateRecipe}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generating ? 'Gerando...' : 'Gerar Receitas'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Photo Input */}
      {inputType === 'photo' && (
        <Card className="p-6 bg-white border-[#E5E5E5]">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#1A1A1A]">Tire uma foto dos ingredientes</h3>
            
            {selectedImage ? (
              <div className="relative">
                <Image 
                  src={selectedImage} 
                  alt="Preview" 
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null)
                    setImageUrl(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#E5E5E5] rounded-lg p-12 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-[#505050]" />
                <p className="text-[#505050] mb-4">Clique para tirar foto ou fazer upload</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  id="photo-input"
                  onChange={handleImageSelect}
                />
                <Button 
                  variant="outline" 
                  className="border-[#E5E5E5] text-[#1A1A1A]"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Carregando...' : 'Selecionar Foto'}
                </Button>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#FAFAFA]"
                onClick={() => {
                  setInputType(null)
                  setSelectedImage(null)
                  setImageUrl(null)
                }}
              >
                Voltar
              </Button>
              {selectedImage && (
                <Button 
                  className="flex-1 bg-[#FF7F50] hover:bg-[#FF6A3D] text-white"
                  onClick={handleGenerateRecipe}
                  disabled={generating}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generating ? 'Gerando...' : 'Gerar Receitas'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Audio Input */}
      {inputType === 'audio' && (
        <Card className="p-6 bg-white border-[#E5E5E5]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#1A1A1A]">Grave sua lista de ingredientes</h3>
              <span className="text-xs bg-[#0088FF] text-white px-2 py-1 rounded-full">PRO</span>
            </div>
            <div className="border-2 border-dashed border-[#E5E5E5] rounded-lg p-12 text-center">
              <Mic className="w-16 h-16 mx-auto mb-4 text-[#505050]" />
              <p className="text-[#505050] mb-4">Recurso disponível no plano Pro</p>
              <Link href="/premium">
                <Button className="bg-[#0088FF] hover:bg-[#0077DD] text-white">
                  <Mic className="w-4 h-4 mr-2" />
                  Ver Planos Premium
                </Button>
              </Link>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#FAFAFA]"
              onClick={() => setInputType(null)}
            >
              Voltar
            </Button>
          </div>
        </Card>
      )}

      {/* Trial Banner */}
      {user.subscription_status === 'trial' && (
        <Card className="p-4 bg-[#FF7F50]/10 border-[#FF7F50]/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1A1A1A]">🎉 Trial Gratuito Ativo</p>
              <p className="text-sm text-[#505050]">
                Aproveite todos os recursos premium por 3 dias
              </p>
            </div>
            <Link href="/premium">
              <Button size="sm" className="bg-[#FF7F50] hover:bg-[#FF6A3D] text-white">
                Ver Planos
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
