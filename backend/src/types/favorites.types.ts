/**
 * Player favorito salvo no Firestore
 */
export interface FavoritePlayer {
  tag: string       // Tag do jogador (ex: "#2PYL")
  name: string      // Nome do jogador
  addedAt: string   // ISO timestamp de quando foi adicionado
}

/**
 * Request body para adicionar favorito
 */
export interface AddFavoritePlayerRequest {
  tag: string
  name: string
}
