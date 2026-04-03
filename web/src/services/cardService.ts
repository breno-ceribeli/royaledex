import api from './api'
import type { CardsResponse } from '../types'

/**
 * Service para operações relacionadas a cartas
 */
export const cardService = {
  /**
   * Busca todas as cartas do jogo
   * Endpoint: GET /cards
   */
  async getAll(): Promise<CardsResponse> {
    const { data } = await api.get<CardsResponse>('/cards')
    return data
  },
}
