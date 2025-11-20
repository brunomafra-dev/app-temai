'use client'

import { useState } from 'react'
import { Camera, Mic, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function Home() {
  const { user } = useAuth()
  const [inputType, setInputType] = useState<'photo' | 'text' | 'audio' | null>(null)
  const [textInput, setTextInput] = useState('')

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
            TemAi?
          </h1>
          <p className="text-xl text-gray-400 max-w-md">
            Nunca Mais Diga Que Não Tem Comida em Casa
          </p>
        </div>

        <Card className="w-full max-w-md p-8 bg-gray-900 border-gray-800">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Bem-vindo!</h2>
            <p className="text-gray-400 text-center">
              Entre ou crie sua conta para começar a gerar receitas incríveis
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                  Criar Conta
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
          O que posso fazer com isso?
        </h1>
        <p className="text-gray-400">
          Envie seus ingredientes e descubra receitas incríveis
        </p>
      </div>

      {/* Input Type Selection */}
      {!inputType && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card 
            className="p-6 bg-gray-900 border-gray-800 hover:border-orange-500 transition-all cursor-pointer group"
            onClick={() => setInputType('photo')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 group-hover:from-orange-500/30 group-hover:to-pink-600/30 transition-all">
                <Camera className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Tirar Foto</h3>
                <p className="text-sm text-gray-400">IA identifica os ingredientes</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 bg-gray-900 border-gray-800 hover:border-orange-500 transition-all cursor-pointer group"
            onClick={() => setInputType('text')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 group-hover:from-orange-500/30 group-hover:to-pink-600/30 transition-all">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Escrever</h3>
                <p className="text-sm text-gray-400">Digite sua lista</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 bg-gray-900 border-gray-800 hover:border-orange-500 transition-all cursor-pointer group"
            onClick={() => setInputType('audio')}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 group-hover:from-orange-500/30 group-hover:to-pink-600/30 transition-all">
                <Mic className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Falar</h3>
                <p className="text-sm text-gray-400">Grave sua lista</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Text Input */}
      {inputType === 'text' && (
        <Card className="p-6 bg-gray-900 border-gray-800">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Liste seus ingredientes</h3>
            <Textarea
              placeholder="Ex: 2 ovos, 1 xícara de farinha, 200ml de leite..."
              className="min-h-[200px] bg-gray-800 border-gray-700"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-gray-700"
                onClick={() => {
                  setInputType(null)
                  setTextInput('')
                }}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                disabled={!textInput.trim()}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Receitas
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Photo Input */}
      {inputType === 'photo' && (
        <Card className="p-6 bg-gray-900 border-gray-800">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Tire uma foto dos ingredientes</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-4">Clique para tirar foto ou fazer upload</p>
              <input type="file" accept="image/*" capture="environment" className="hidden" id="photo-input" />
              <label htmlFor="photo-input">
                <Button variant="outline" className="border-gray-700" asChild>
                  <span>Selecionar Foto</span>
                </Button>
              </label>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-gray-700"
              onClick={() => setInputType(null)}
            >
              Voltar
            </Button>
          </div>
        </Card>
      )}

      {/* Audio Input */}
      {inputType === 'audio' && (
        <Card className="p-6 bg-gray-900 border-gray-800">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Grave sua lista de ingredientes</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
              <Mic className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 mb-4">Clique para começar a gravar</p>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700">
                <Mic className="w-4 h-4 mr-2" />
                Iniciar Gravação
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-gray-700"
              onClick={() => setInputType(null)}
            >
              Voltar
            </Button>
          </div>
        </Card>
      )}

      {/* Trial Banner */}
      {user.subscription_status === 'trial' && (
        <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-pink-600/10 border-orange-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">🎉 Trial Gratuito Ativo</p>
              <p className="text-sm text-gray-400">
                Aproveite todos os recursos premium por 3 dias
              </p>
            </div>
            <Link href="/assinatura">
              <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-600">
                Ver Planos
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
