import { CardsResponse, ClashApiError } from '../types/clash.types'

// Cache global para lista de cartas — válido por 1 hora
interface CacheEntry<T> {
  data: T
  timestamp: number
}

let cardsCache: CacheEntry<CardsResponse> | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hora em ms

/**
 * Função base para fazer chamadas à API do Clash Royale
 * Centraliza autenticação e tratamento de erros
 */
async function fetchFromClash<T>(endpoint: string): Promise<T> {
  const baseUrl = process.env.CLASH_BASE_URL
  const token = process.env.CLASH_TOKEN

  if (!baseUrl || !token) {
    throw new Error('CLASH_BASE_URL or CLASH_TOKEN not configured')
  }

  const url = `${baseUrl}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    // Trata erros HTTP
    if (!response.ok) {
      const error: ClashApiError = { status: response.status, message: '' }

      if (response.status === 404) {
        error.message = 'Resource not found'
        throw error
      }
      if (response.status === 429) {
        error.message = 'Rate limit exceeded. Please try again later.'
        throw error
      }
      if (response.status === 503) {
        error.message = 'Clash Royale API is temporarily unavailable'
        throw error
      }
      error.message = 'Failed to fetch from Clash Royale API'
      throw error
    }

    return await response.json() as T
  } catch (error) {
    // Re-lança erros já tratados
    if (error && typeof error === 'object' && 'status' in error) {
      throw error as ClashApiError
    }
    // Erro de rede ou outro erro desconhecido
    const networkError: ClashApiError = {
      status: 500,
      message: 'Network error or API unreachable'
    }
    throw networkError
  }
}

/**
 * Obtém todas as cartas do jogo
 * Usa cache em memória (válido por 1 hora)
 */
export async function getCards(): Promise<CardsResponse> {
  const now = Date.now()

  // Verifica se cache ainda é válido
  if (cardsCache && (now - cardsCache.timestamp) < CACHE_DURATION) {
    console.log('✅ Returning cards from cache')
    return cardsCache.data
  }

  // Cache expirado ou inexistente — busca da API
  console.log('🔄 Fetching cards from Clash Royale API...')
  const data = await fetchFromClash<CardsResponse>('/cards')

  // Atualiza cache
  cardsCache = {
    data,
    timestamp: now
  }

  return data
}
