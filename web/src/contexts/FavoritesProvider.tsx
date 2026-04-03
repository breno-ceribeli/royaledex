import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { FavoritesContext } from './FavoritesContext'
import { favoriteService } from '../services'
import { getApiErrorMessage } from '../utils/apiErrors'
import { useAuth } from '../hooks/useAuth'
import type { FavoritePlayer } from '../types'

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoritePlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const fetchFavorites = useCallback(async () => {
    // Só buscar se estiver autenticado
    if (!user) {
      setFavorites([])
      setLoading(false)
      setError('')
      return
    }

    try {
      setLoading(true)
      setError('')
      const data = await favoriteService.listPlayers()
      setFavorites(data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [user])

  /**
   * Adiciona um jogador aos favoritos
   * Trata erros internamente e atualiza actionError se falhar
   * @param tag - Tag do jogador (com ou sem #)
   * @param name - Nome do jogador
   */
  const addFavorite = async (tag: string, name: string): Promise<void> => {
    if (!user) {
      setActionError('Você precisa estar autenticado para adicionar favoritos')
      return
    }

    try {
      setActionLoading(true)
      setActionError('')
      await favoriteService.addPlayer({ tag, name })
      await fetchFavorites()
    } catch (err) {
      setActionError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  /**
   * Remove um jogador dos favoritos
   * Trata erros internamente e atualiza actionError se falhar
   * @param tag - Tag do jogador (com ou sem #)
   */
  const removeFavorite = async (tag: string): Promise<void> => {
    if (!user) {
      setActionError('Você precisa estar autenticado para remover favoritos')
      return
    }

    try {
      setActionLoading(true)
      setActionError('')
      await favoriteService.removePlayer(tag)
      await fetchFavorites()
    } catch (err) {
      setActionError(getApiErrorMessage(err))
    } finally {
      setActionLoading(false)
    }
  }

  /**
   * Verifica se um jogador está nos favoritos (checagem local)
   * @param tag - Tag do jogador (com ou sem #)
   * @returns true se está nos favoritos, false caso contrário
   */
  const isFavorite = (tag: string): boolean => {
    const normalizedTag = tag.startsWith('#') ? tag.slice(1) : tag
    return favorites.some((fav) => {
      const favTag = fav.tag.startsWith('#') ? fav.tag.slice(1) : fav.tag
      return favTag === normalizedTag
    })
  }

  /**
   * Adiciona ou remove dos favoritos (toggle)
   * Trata erros internamente e atualiza actionError se falhar
   * @param tag - Tag do jogador (com ou sem #)
   * @param name - Nome do jogador (necessário para adicionar)
   */
  const toggleFavorite = async (tag: string, name: string): Promise<void> => {
    if (isFavorite(tag)) {
      await removeFavorite(tag)
    } else {
      await addFavorite(tag, name)
    }
  }

  /**
   * Limpa o erro de ação
   * Útil para fechar alertas/toasts de erro
   */
  const clearActionError = () => {
    setActionError('')
  }

  // Buscar favoritos quando usuário autenticar/desautenticar
  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        error,
        actionLoading,
        actionError,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearActionError,
        refetch: fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
