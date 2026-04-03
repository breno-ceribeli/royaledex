import api from './api'
import { formatTag } from '../utils/formatters'
import type { FavoritePlayer, AddFavoritePlayerRequest } from '../types'

/**
 * Service para operações relacionadas a favoritos
 * Todos os endpoints requerem autenticação (token Firebase)
 */
export const favoriteService = {
  /**
   * Lista todos os jogadores favoritos do usuário
   * Endpoint: GET /favorites/players
   * Requer: bearerAuth (token Firebase)
   */
  async listPlayers(): Promise<FavoritePlayer[]> {
    const { data } = await api.get<FavoritePlayer[]>('/favorites/players')
    return data
  },

  /**
   * Adiciona um jogador aos favoritos
   * Endpoint: POST /favorites/players
   * Requer: bearerAuth (token Firebase)
   * @param playerData - Tag e nome do jogador
   */
  async addPlayer(playerData: AddFavoritePlayerRequest): Promise<void> {
    await api.post('/favorites/players', playerData)
  },

  /**
   * Remove um jogador dos favoritos
   * Endpoint: DELETE /favorites/players/:tag
   * Requer: bearerAuth (token Firebase)
   * @param tag - Tag do jogador (com ou sem #)
   */
  async removePlayer(tag: string): Promise<void> {
    const formattedTag = formatTag(tag)
    await api.delete(`/favorites/players/${formattedTag}`)
  },

  /**
   * Verifica se um jogador está nos favoritos
   * Endpoint: GET /favorites/players/:tag/check
   * Requer: bearerAuth (token Firebase)
   * @param tag - Tag do jogador (com ou sem #)
   * @returns true se está nos favoritos, false caso contrário
   */
  async checkPlayer(tag: string): Promise<boolean> {
    const formattedTag = formatTag(tag)
    const { data } = await api.get<{ isFavorite: boolean }>(
      `/favorites/players/${formattedTag}/check`
    )
    return data.isFavorite
  },
}
