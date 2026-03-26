/**
 * Tipos para a API do Clash Royale
 */

export interface ClashApiError {
  status: number
  message: string
}

export interface CardIconUrls {
  medium: string
  heroMedium?: string
  evolutionMedium?: string
}

/**
 * Carta normal do jogo (tropas, feitiços, edificações)
 */
export interface Card {
  name: string
  id: number
  maxLevel: number
  maxEvolutionLevel: number
  elixirCost: number
  iconUrls: CardIconUrls
  rarity: string
}

/**
 * Carta de torre/suporte (Tower Princess, Cannoneer, etc)
 * Não tem elixirCost nem maxEvolutionLevel
 */
export interface SupportItem {
  name: string
  id: number
  maxLevel: number
  iconUrls: CardIconUrls
  rarity: string
}

export interface CardsResponse {
  items: Card[]
  supportItems: SupportItem[]
}

/**
 * Tipos relacionados a Players
 */

export interface PlayerClan {
  tag: string
  name: string
  badgeId: number
}

export interface Arena {
  id: number
  name: string
  rawName: string
}

/**
 * Carta do jogador com nível e progresso
 * Usado para currentDeck e coleção de cartas
 */
export interface PlayerCard {
  name: string
  id: number
  level: number
  starLevel?: number
  evolutionLevel?: number
  maxLevel: number
  maxEvolutionLevel?: number
  rarity: string
  count?: number
  elixirCost: number
  iconUrls: CardIconUrls
}

/**
 * Interface para estatísticas de liga do jogador
 * Mostra performance nas temporadas atual, anterior e melhor temporada
 */
export interface PlayerLeagueStatistics {
  currentSeason?: {
    rank?: number
    trophies?: number
    bestTrophies?: number
  }
  previousSeason?: {
    id: string
    rank?: number
    trophies?: number
    bestTrophies?: number
  }
  bestSeason?: {
    id: string
    rank?: number
    trophies?: number
  }
}

/**
 * Resultado de temporada do Path of Legend
 * Liga competitiva com ranking global
 */
export interface PathOfLegendSeasonResult {
  leagueNumber?: number
  trophies?: number
  rank?: number | null
}

/**
 * Resposta completa da API do Clash Royale para um jogador
 * Usado internamente para receber dados da API externa
 * Não é exposto diretamente aos clientes
 */
export interface Player {
  tag: string
  name: string
  expLevel: number
  trophies: number
  bestTrophies: number
  wins: number
  losses: number
  battleCount: number
  threeCrownWins: number
  challengeCardsWon: number
  challengeMaxWins: number
  tournamentCardsWon: number
  tournamentBattleCount: number
  role?: string
  donations: number
  donationsReceived: number
  totalDonations: number
  warDayWins: number
  clanCardsCollected: number
  clan?: PlayerClan
  arena: Arena
  leagueStatistics?: PlayerLeagueStatistics
  badges: unknown[]  // Filtrado - não tipado
  achievements: unknown[]  // Filtrado - não tipado
  cards: unknown[]  // Filtrado - não tipado
  currentDeck: PlayerCard[]
  progress?: unknown  // Filtrado - não tipado
  currentFavouriteCard: Card
  starPoints: number
  expPoints: number
  totalExpPoints?: number
  currentPathOfLegendSeasonResult?: PathOfLegendSeasonResult
  lastPathOfLegendSeasonResult?: PathOfLegendSeasonResult
  bestPathOfLegendSeasonResult?: PathOfLegendSeasonResult
  legacyTrophyRoadHighScore?: number
}

/**
 * Dados essenciais do jogador (sem badges, achievements, cards de coleção e progress)
 * Usado para retornar apenas informações de perfil e estatísticas principais
 * Filtra ~50% do tamanho da resposta (remove arrays grandes e dados secundários)
 */
export interface PlayerProfile {
  tag: string
  name: string
  expLevel: number
  trophies: number
  bestTrophies: number
  wins: number
  losses: number
  battleCount: number
  threeCrownWins: number
  challengeCardsWon: number
  challengeMaxWins: number
  tournamentCardsWon: number
  tournamentBattleCount: number
  donations: number
  donationsReceived: number
  totalDonations: number
  warDayWins: number
  clanCardsCollected: number
  clan?: PlayerClan
  arena: Arena
  leagueStatistics?: PlayerLeagueStatistics
  currentDeck: PlayerCard[]
  currentFavouriteCard: Card
  starPoints: number
  expPoints: number
  totalExpPoints?: number
  currentPathOfLegendSeasonResult?: PathOfLegendSeasonResult
  lastPathOfLegendSeasonResult?: PathOfLegendSeasonResult
  bestPathOfLegendSeasonResult?: PathOfLegendSeasonResult
  legacyTrophyRoadHighScore?: number
}

/**
 * Tipos relacionados a Battlelog (histórico de batalhas)
 */

/**
 * Modo de jogo da batalha
 */
export interface GameMode {
  id: number
  name: string
}

/**
 * Support card com nível (usada em batalhas)
 * Estende SupportItem adicionando o nível atual
 */
export interface BattleSupportCard extends SupportItem {
  level: number
}

/**
 * Carta em uma batalha (herda de PlayerCard mas sem count)
 */
export interface BattleCard {
  name: string
  id: number
  level: number
  starLevel?: number
  evolutionLevel?: number
  maxLevel: number
  maxEvolutionLevel?: number
  rarity: string
  elixirCost: number
  iconUrls: CardIconUrls
}

/**
 * Dados de um jogador em uma batalha
 */
export interface PlayerBattleData {
  tag: string
  name: string
  startingTrophies?: number
  trophyChange?: number
  crowns: number
  kingTowerHitPoints: number
  princessTowersHitPoints: number[] | null
  clan?: PlayerClan
  cards: BattleCard[]
  supportCards?: BattleSupportCard[]
  globalRank?: number | null
  elixirLeaked: number
}

/**
 * Estrutura de uma batalha individual
 */
export interface Battle {
  type: string
  battleTime: string
  isLadderTournament: boolean
  arena: Arena
  gameMode: GameMode
  deckSelection: string
  team: PlayerBattleData[]
  opponent: PlayerBattleData[]
  isHostedMatch: boolean
  leagueNumber?: number
}

/**
 * Resposta do endpoint /players/{tag}/battlelog
 * Lista de batalhas recentes do jogador (geralmente últimas 25)
 */
export type BattleLog = Battle[]
