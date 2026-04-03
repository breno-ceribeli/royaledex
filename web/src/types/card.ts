/**
 * Tipos de cartas do Clash Royale
 * Copiados do backend para garantir compatibilidade
 */

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
