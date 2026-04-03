import { createContext } from 'react'
import type { FavoritePlayer } from '../types'

export interface FavoritesContextType {
  favorites: FavoritePlayer[]
  loading: boolean
  error: string
  actionLoading: boolean
  actionError: string
  isFavorite: (tag: string) => boolean
  addFavorite: (tag: string, name: string) => Promise<void>
  removeFavorite: (tag: string) => Promise<void>
  toggleFavorite: (tag: string, name: string) => Promise<void>
  clearActionError: () => void
  refetch: () => Promise<void>
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
)
