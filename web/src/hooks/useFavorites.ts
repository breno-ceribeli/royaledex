import { useContext } from 'react'
import { FavoritesContext } from '../contexts/FavoritesContext'

/**
 * Hook para acessar o contexto de favoritos
 * Deve ser usado dentro do FavoritesProvider
 * Retorna estado global de favoritos compartilhado entre todos os componentes
 */
export function useFavorites() {
  const context = useContext(FavoritesContext)
  
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  
  return context
}
