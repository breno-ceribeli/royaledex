import { CardsResponse, ClashApiError, Player, PlayerProfile, BattleLog } from '../types/clash.types'

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

      if (response.status === 400) {
        error.message = 'Bad request. Check your parameters.'
        throw error
      }
      if (response.status === 403) {
        error.message = 'Access denied. API token may be invalid or expired.'
        throw error
      }
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
 *
 * @returns Lista de todas as cartas com detalhes e imagens
 * @throws ClashApiError com status 400, 403, 429 ou 503
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

/**
 * Normaliza e valida uma tag de jogador
 * Tags devem conter apenas caracteres específicos do Clash Royale
 * Lança ClashApiError com status 400 se inválida
 */
function normalizeTag(tag: string): string {
  // Remove espaços e converte para maiúsculo
  let normalized = tag.trim().toUpperCase()

  // Adiciona # se não tiver
  if (!normalized.startsWith('#')) {
    normalized = `#${normalized}`
  }

  // Valida caracteres permitidos (apenas a-z maiúsculas específicas + números)
  // Clash Royale usa: 0, 2, 8, 9, P, Y, L, Q, G, R, J, C, U, V
  const validChars = /^#[0289PYLQGRJCUV]+$/
  if (!validChars.test(normalized)) {
    throw {
      status: 400,
      message: 'Invalid player tag format. Tags can only contain: 0, 2, 8, 9, P, Y, L, Q, G, R, J, C, U, V'
    }
  }

  // URL-encoda para enviar na URL (# vira %23)
  return encodeURIComponent(normalized)
}

/**
 * Obtém informações de um jogador pela tag
 * NÃO usa cache pois dados do jogador mudam frequentemente
 * Retorna dados essenciais incluindo deck atual (sem badges, achievements, cards de coleção e progress)
 *
 * @param tag Tag do jogador (pode ser com ou sem #)
 * @returns Dados essenciais do jogador (perfil, estatísticas e deck)
 * @throws ClashApiError com status 400 se tag inválida
 */
export async function getPlayer(tag: string): Promise<PlayerProfile> {
  const encodedTag = normalizeTag(tag)

  console.log(`🔄 Fetching player ${tag} from Clash Royale API...`)
  const fullPlayer = await fetchFromClash<Player>(`/players/${encodedTag}`)

  const playerProfile: PlayerProfile = {
    tag: fullPlayer.tag,
    name: fullPlayer.name,
    expLevel: fullPlayer.expLevel,
    trophies: fullPlayer.trophies,
    bestTrophies: fullPlayer.bestTrophies,
    wins: fullPlayer.wins,
    losses: fullPlayer.losses,
    battleCount: fullPlayer.battleCount,
    threeCrownWins: fullPlayer.threeCrownWins,
    challengeCardsWon: fullPlayer.challengeCardsWon,
    challengeMaxWins: fullPlayer.challengeMaxWins,
    tournamentCardsWon: fullPlayer.tournamentCardsWon,
    tournamentBattleCount: fullPlayer.tournamentBattleCount,
    donations: fullPlayer.donations,
    donationsReceived: fullPlayer.donationsReceived,
    totalDonations: fullPlayer.totalDonations,
    warDayWins: fullPlayer.warDayWins,
    clanCardsCollected: fullPlayer.clanCardsCollected,
    clan: fullPlayer.clan,
    arena: fullPlayer.arena,
    leagueStatistics: fullPlayer.leagueStatistics,
    currentDeck: fullPlayer.currentDeck,
    currentFavouriteCard: fullPlayer.currentFavouriteCard,
    starPoints: fullPlayer.starPoints,
    expPoints: fullPlayer.expPoints,
    totalExpPoints: fullPlayer.totalExpPoints,
    currentPathOfLegendSeasonResult: fullPlayer.currentPathOfLegendSeasonResult,
    lastPathOfLegendSeasonResult: fullPlayer.lastPathOfLegendSeasonResult,
    bestPathOfLegendSeasonResult: fullPlayer.bestPathOfLegendSeasonResult,
    legacyTrophyRoadHighScore: fullPlayer.legacyTrophyRoadHighScore
  }

  console.log(`✅ Player data filtered: removed badges, achievements, cards collection, and progress`)
  return playerProfile
}

/**
 * Obtém o histórico de batalhas recentes de um jogador
 *
 * @param tag Tag do jogador (pode ser com ou sem #)
 * @returns Lista de batalhas recentes (geralmente últimas 25)
 * @throws ClashApiError com status 400 se tag inválida
 */
export async function getBattleLog(tag: string): Promise<BattleLog> {
  const encodedTag = normalizeTag(tag)

  console.log(`🔄 Fetching battle log for player ${tag} from Clash Royale API...`)
  const battleLog = await fetchFromClash<BattleLog>(`/players/${encodedTag}/battlelog`)

  console.log(`✅ Battle log retrieved: ${battleLog.length} battles found`)
  return battleLog
}
