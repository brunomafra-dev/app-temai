'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Crown, Zap } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function PremiumPage() {
  const { user } = useAuth()

  const plans = [
    {
      name: 'Iniciante',
      price: 'R$ 11,90',
      period: '/mês',
      icon: Sparkles,
      color: 'text-[#FF7F50]',
      bgColor: 'bg-[#FF7F50]',
      features: [
        'Biblioteca de receitas',
        'Escrever ingredientes',
        'Tirar foto para gerar receitas',
        'Suporte por email'
      ]
    },
    {
      name: 'Pro',
      price: 'R$ 14,90',
      period: '/mês',
      icon: Crown,
      color: 'text-[#0088FF]',
      bgColor: 'bg-[#0088FF]',
      popular: true,
      features: [
        'Tudo do plano Iniciante',
        'Gravar áudio reconhecendo ingredientes',
        'Alimentar receitas autorais',
        'Acessar receitas autorais de outros usuários',
        'Ganhar e exibir insígnias',
        'Suporte prioritário'
      ]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[#1A1A1A]">
          Escolha seu Plano
        </h1>
        <p className="text-lg text-[#505050] max-w-2xl mx-auto">
          Desbloqueie todo o potencial do TemAi e nunca mais fique sem ideias na cozinha
        </p>
      </div>

      {/* Trial Banner */}
      <Card className="p-6 bg-gradient-to-r from-[#FF7F50] to-[#FF6A3D] border-none text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Trial Gratuito - 3 Dias</h3>
              <p className="text-white/90">
                Experimente todos os recursos premium sem compromisso
              </p>
            </div>
          </div>
          <Button 
            size="lg"
            className="bg-white text-[#FF7F50] hover:bg-white/90 font-semibold"
          >
            Começar Trial Gratuito
          </Button>
        </div>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <Card 
              key={plan.name}
              className={`relative p-6 bg-white border-2 ${
                plan.popular ? 'border-[#0088FF] shadow-lg' : 'border-[#E5E5E5]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#0088FF] text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="text-center space-y-2">
                  <div className={`inline-flex p-3 rounded-full ${plan.bgColor}/10`}>
                    <Icon className={`w-8 h-8 ${plan.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-[#1A1A1A]">{plan.price}</span>
                    <span className="text-[#505050]">{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1 rounded-full ${plan.bgColor}`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[#505050] flex-1">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${plan.bgColor} hover:opacity-90 text-white font-semibold`}
                  size="lg"
                >
                  Assinar {plan.name}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <Card className="p-6 bg-white border-[#E5E5E5] mt-8">
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Perguntas Frequentes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-[#1A1A1A] mb-1">
              Posso cancelar a qualquer momento?
            </h4>
            <p className="text-[#505050]">
              Sim! Você pode cancelar sua assinatura a qualquer momento sem custos adicionais.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1A1A1A] mb-1">
              O que acontece após o trial gratuito?
            </h4>
            <p className="text-[#505050]">
              Após os 3 dias de trial, você pode escolher um dos planos pagos ou continuar com acesso limitado gratuito.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#1A1A1A] mb-1">
              Posso mudar de plano depois?
            </h4>
            <p className="text-[#505050]">
              Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
