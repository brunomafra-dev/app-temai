import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { query, page = 1 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query de busca é necessária' },
        { status: 400 }
      )
    }

    // Usar IA para gerar receitas baseadas na busca
    const prompt = `Você é um assistente especializado em culinária. Gere 6 receitas diferentes relacionadas a: "${query}".

Para cada receita, retorne em formato JSON com a seguinte estrutura:
{
  "titulo": "Nome da receita",
  "ingredientes": "Lista de ingredientes separados por vírgula",
  "modo_preparo": "Modo de preparo detalhado em texto corrido",
  "foto_url": "URL de uma foto representativa do Unsplash (use https://images.unsplash.com/photo-[ID]?w=400&h=300&fit=crop)",
  "fonte": "Nome de um site de culinária famoso (TudoGostoso, Panelinha, Paneloterapia, etc)"
}

Retorne um array JSON com as 6 receitas. Seja criativo e varie as receitas.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um chef especializado que conhece receitas de diversos sites de culinária. Sempre retorne respostas em formato JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 3000
    })

    const content = response.choices[0].message.content
    const recipes = parseRecipesFromAI(content)

    // Adicionar IDs únicos
    const recipesWithIds = recipes.map((recipe: any, index: number) => ({
      id: `${Date.now()}-${index}`,
      ...recipe,
      created_at: new Date().toISOString()
    }))

    return NextResponse.json({ recipes: recipesWithIds })
  } catch (error) {
    console.error('Erro ao buscar receitas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar receitas' },
      { status: 500 }
    )
  }
}

function parseRecipesFromAI(content: string | null): any[] {
  if (!content) return []
  
  try {
    // Tentar extrair JSON do conteúdo
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Se não encontrar array, tentar objeto único
    const objMatch = content.match(/\{[\s\S]*\}/)
    if (objMatch) {
      const obj = JSON.parse(objMatch[0])
      return Array.isArray(obj) ? obj : [obj]
    }
    
    return []
  } catch (error) {
    console.error('Erro ao parsear receitas:', error)
    return []
  }
}
