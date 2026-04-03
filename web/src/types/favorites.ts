/**
 * Tipos de favoritos
 */

export interface FavoritePlayer {
  tag: string
  name: string
  addedAt: string
}

export interface AddFavoritePlayerRequest {
  tag: string
  name: string
}
