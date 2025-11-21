import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { ingredients, imageUrl } = await request.json()

    if (!ingredients && !imageUrl) {
      return NextResponse.json(
        { error: 'Ingredientes ou imagem são necessários' },
        { status: 400 }
      )
    }

    let prompt = ''
    
    if (imageUrl) {
      // Análise de imagem com ingredientes
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identifique os ingredientes nesta imagem e sugira 3 receitas diferentes que podem ser feitas com eles. Para cada receita, retorne em formato JSON com: nome, ingredientes (array), modo_preparo (array de passos), tempo_preparo, dificuldade.'
              },
              {
                type: 'image_url',
                image_url: { url: imageUrl }
              }
            ]
          }
        ],
        max_tokens: 2000
      })

      const content = response.choices[0].message.content
      const recipes = parseRecipesFromAI(content)
      return NextResponse.json({ recipes })
    } else {
      // Geração baseada em texto
      prompt = `Com base nos seguintes ingredientes: ${ingredients}

Sugira 3 receitas diferentes e criativas que podem ser feitas com esses ingredientes.

Para cada receita, retorne em formato JSON com a seguinte estrutura:
{
  "nome": "Nome da receita",
  "ingredientes": ["ingrediente 1", "ingrediente 2", ...],
  "modo_preparo": ["passo 1", "passo 2", ...],
  "tempo_preparo": "30 minutos",
  "dificuldade": "Fácil"
}

Retorne um array com as 3 receitas.`

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Você é um chef especializado em criar receitas criativas e práticas. Sempre retorne respostas em formato JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })

      const content = response.choices[0].message.content
      const recipes = parseRecipesFromAI(content)
      
      // Adicionar imagens sugestivas para cada receita
      const recipesWithImages = recipes.map((recipe: any) => ({
        ...recipe,
        imagem: getRecipeImage(recipe.nome)
      }))

      return NextResponse.json({ recipes: recipesWithImages })
    }
  } catch (error) {
    console.error('Erro ao gerar receitas:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar receitas' },
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

function getRecipeImage(recipeName: string): string {
  // Mapear tipos de receita para imagens do Unsplash
  const imageMap: { [key: string]: string } = {
    'bolo': 'photo-1578985545062-69928b1d9587',
    'torta': 'photo-1464349095431-e9a21285b5f3',
    'pão': 'photo-1509440159596-0249088772ff',
    'salada': 'photo-1546793665-c74683f339c1',
    'sopa': 'photo-1547592166-23ac45744acd',
    'massa': 'photo-1621996346565-e3dbc646d9a9',
    'arroz': 'photo-1516684732162-798a0062be99',
    'frango': 'photo-1598103442097-8b74394b95c6',
    'carne': 'photo-1588168333986-5078d3ae3976',
    'peixe': 'photo-1519708227418-c8fd9a32b7a2',
    'pizza': 'photo-1513104890138-7c749659a591',
    'hamburguer': 'photo-1568901346375-23c9450c58cd',
    'sanduiche': 'photo-1528735602780-2552fd46c7af',
    'smoothie': 'photo-1505252585461-04db1eb84625',
    'suco': 'photo-1600271886742-f049cd451bba'
  }

  const lowerName = recipeName.toLowerCase()
  
  for (const [key, photoId] of Object.entries(imageMap)) {
    if (lowerName.includes(key)) {
      return `https://images.unsplash.com/${photoId}?w=400&h=300&fit=crop`
    }
  }
  
  // Imagem padrão para receitas
  return 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop'
}
