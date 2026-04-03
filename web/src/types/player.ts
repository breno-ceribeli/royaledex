/**
 * Tipos de jogador do Clash Royale
 * Copiados do backend para garantir compatibilidade
 */

import type { Card, CardIconUrls } from './card'

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
 * Usado para currentDeck
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
 */
export interface PathOfLegendSeasonResult {
  leagueNumber?: number
  trophies?: number
  rank?: number | null
}

/**
 * Dados essenciais do jogador
 * Retornado pelo endpoint /players/:tag
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

export interface GameMode {
  id: number
  name: string
}

export interface BattleSupportCard {
  name: string
  id: number
  maxLevel: number
  iconUrls: CardIconUrls
  rarity: string
  level: number
}

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

export interface Battle {
  type: string
  battleTime: string
  isLadderTournament?: boolean
  arena: Arena
  gameMode: GameMode
  deckSelection: string
  team: PlayerBattleData[]
  opponent: PlayerBattleData[]
  isHostedMatch?: boolean
}

export type BattleLog = Battle[]

/**
 * Estatísticas de battlelog calculadas
 */

export interface CardLossStats {
  cardName: string
  lossCount: number
  totalCount: number
  percentage: number
}

export interface CrownsDistribution {
  zeroCrowns: number
  oneCrown: number
  twoCrowns: number
  threeCrowns: number
}

export interface BattleLogStats {
  totalBattles: number
  wins: number
  losses: number
  draws: number
  winRate: number
  avgTrophyChange: number
  avgElixirLeaked: number
  mostLostAgainstCards: CardLossStats[]
  crownsDistribution: CrownsDistribution
}
