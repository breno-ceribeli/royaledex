import api from './api'
import { formatTag } from '../utils/formatters'
import type { PlayerProfile, BattleLog, BattleLogStats } from '../types'

/**
 * Service para operações relacionadas a jogadores
 */
export const playerService = {
  /**
   * Busca perfil completo de um jogador por tag
   * Endpoint: GET /players/:tag
   * @param tag - Tag do jogador (com ou sem #)
   */
  async getProfile(tag: string): Promise<PlayerProfile> {
    // Remove # da tag para a URL
    const formattedTag = formatTag(tag)
    const { data } = await api.get<PlayerProfile>(`/players/${formattedTag}`)
    return data
  },

  /**
   * Busca histórico de batalhas de um jogador
   * Endpoint: GET /players/:tag/battlelog
   * @param tag - Tag do jogador (com ou sem #)
   */
  async getBattleLog(tag: string): Promise<BattleLog> {
    const formattedTag = formatTag(tag)
    const { data } = await api.get<BattleLog>(`/players/${formattedTag}/battlelog`)
    return data
  },

  /**
   * Busca estatísticas calculadas do battlelog
   * Endpoint: GET /players/:tag/battlelog/stats
   * @param tag - Tag do jogador (com ou sem #)
   */
  async getBattleStats(tag: string): Promise<BattleLogStats> {
    const formattedTag = formatTag(tag)
    const { data } = await api.get<BattleLogStats>(
      `/players/${formattedTag}/battlelog/stats`
    )
    return data
  },
}
