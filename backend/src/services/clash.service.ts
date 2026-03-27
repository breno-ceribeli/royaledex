import { CardsResponse, ClashApiError, Player, PlayerProfile, BattleLog, BattleLogStats, CardLossStats, CrownsDistribution } from '../types/clash.types'

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
 * @returns Lista de batalhas recentes (geralmente últimas 30)
 * @throws ClashApiError com status 400 se tag inválida
 */
export async function getBattleLog(tag: string): Promise<BattleLog> {
  const encodedTag = normalizeTag(tag)

  console.log(`🔄 Fetching battle log for player ${tag} from Clash Royale API...`)
  const battleLog = await fetchFromClash<BattleLog>(`/players/${encodedTag}/battlelog`)

  console.log(`✅ Battle log retrieved: ${battleLog.length} battles found`)
  return battleLog
}

/**
 * Calcula estatísticas agregadas do histórico de batalhas
 * Considera apenas batalhas PvP e Path of Legend
 * NÃO usa cache pois estatísticas devem refletir dados mais recentes
 *
 * @param tag Tag do jogador (pode ser com ou sem #)
 * @returns Estatísticas calculadas (win rate, cartas mais perdidas, etc)
 * @throws ClashApiError com status 400 se tag inválida
 */
export async function getBattleLogStats(tag: string): Promise<BattleLogStats> {
  // Busca histórico de batalhas
  const battleLog = await getBattleLog(tag)

  // Filtra apenas batalhas competitivas (PvP e Path of Legend) - case insensitive
  const competitiveBattles = battleLog.filter(battle => {
    const type = battle.type.toLowerCase()
    return type === 'pvp' || type === 'pathoflegend'
  })

  const pvpCount = competitiveBattles.filter(b => b.type.toLowerCase() === 'pvp').length
  const pathOfLegendCount = competitiveBattles.filter(b => b.type.toLowerCase() === 'pathoflegend').length

  // Calcula vitórias, derrotas e empates
  let wins = 0
  let losses = 0
  let draws = 0

  const crownsDistribution: CrownsDistribution = { 0: 0, 1: 0, 2: 0, 3: 0 }
  const lossCards: string[] = []
  let totalTrophyChange = 0
  let trophyChangeBattles = 0
  let totalElixirLeaked = 0

  competitiveBattles.forEach(battle => {
    const playerCrowns = battle.team[0].crowns
    const opponentCrowns = battle.opponent[0].crowns

    // Conta vitórias, derrotas e empates
    if (playerCrowns > opponentCrowns) {
      wins++
    } else if (playerCrowns < opponentCrowns) {
      losses++
      // Armazena cartas do oponente em derrotas
      battle.opponent[0].cards.forEach(card => {
        lossCards.push(card.name)
      })
    } else {
      draws++
    }

    // Distribuição de coroas
    if (playerCrowns >= 0 && playerCrowns <= 3) {
      crownsDistribution[playerCrowns as 0 | 1 | 2 | 3]++
    }

    // Soma trophy change (apenas em batalhas que têm)
    if (battle.team[0].trophyChange !== undefined) {
      totalTrophyChange += battle.team[0].trophyChange
      trophyChangeBattles++
    }

    // Soma elixir leaked
    totalElixirLeaked += battle.team[0].elixirLeaked
  })

  // Calcula média de trophy change (null se nenhuma batalha tiver)
  const avgTrophyChange = trophyChangeBattles > 0 
    ? Math.round((totalTrophyChange / trophyChangeBattles) * 10) / 10
    : null

  // Calcula média de elixir leaked
  const avgElixirLeaked = competitiveBattles.length > 0
    ? Math.round((totalElixirLeaked / competitiveBattles.length) * 10) / 10
    : 0

  // Calcula win rate
  const winRate = competitiveBattles.length > 0
    ? Math.round((wins / competitiveBattles.length) * 100) / 100
    : 0

  // Agrupa e conta cartas em derrotas
  const cardCount = lossCards.reduce((acc, card) => {
    acc[card] = (acc[card] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Ordena por frequência e pega top 10
  const mostLostAgainstCards: CardLossStats[] = Object.entries(cardCount)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / losses) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const stats: BattleLogStats = {
    totalBattles: competitiveBattles.length,
    pvpBattles: pvpCount,
    pathOfLegendBattles: pathOfLegendCount,
    wins,
    losses,
    draws,
    winRate,
    avgTrophyChange,
    avgElixirLeaked,
    mostLostAgainstCards,
    crownsDistribution
  }

  console.log(`✅ Stats calculated: ${wins}W/${losses}L/${draws}D (${(winRate * 100).toFixed(0)}% WR)`)
  return stats
}
