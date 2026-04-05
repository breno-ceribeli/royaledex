import { db } from '../config/firebase'
import { FavoritePlayer, AddFavoritePlayerRequest } from '../types/favorites.types'

const MAX_FAVORITES = 15

/**
 * Busca todos os players favoritos de um usuário
 * Ordenados por data de adição (mais recentes primeiro)
 *
 * @param userId ID do usuário autenticado (vem do Firebase Auth)
 * @returns Lista de players favoritos
 */
export async function getFavoritePlayers(userId: string): Promise<FavoritePlayer[]> {
  try {
    const snapshot = await db
      .collection('favorites')
      .doc(userId)
      .collection('players')
      .orderBy('addedAt', 'desc')
      .get()

    if (snapshot.empty) {
      return []
    }

    const favorites: FavoritePlayer[] = []
    snapshot.forEach(doc => {
      favorites.push(doc.data() as FavoritePlayer)
    })

    console.log(`✅ Found ${favorites.length} favorite players for user ${userId}`)
    return favorites
  } catch (error: unknown) {
    console.error('Error fetching favorite players:', error)
    throw new Error('Failed to fetch favorite players', { cause: error })
  }
}

/**
 * Adiciona um player aos favoritos do usuário
 * Se já existir, atualiza a data de adição
 *
 * @param userId ID do usuário autenticado
 * @param playerData Dados do player (tag e nome)
 * @returns Player adicionado
 */
export async function addFavoritePlayer(
  userId: string,
  playerData: AddFavoritePlayerRequest
): Promise<FavoritePlayer> {
  try {
    // Normaliza a tag 
    const normalizedTag = playerData.tag.startsWith('#')
      ? playerData.tag
      : `#${playerData.tag}`

    const favorite: FavoritePlayer = {
      tag: normalizedTag,
      name: playerData.name,
      addedAt: new Date().toISOString()
    }

    // Usa a tag como ID do documento (permite set com merge)
    const docId = normalizedTag.replace('#', '')
    const favoritesCollection = db
      .collection('favorites')
      .doc(userId)
      .collection('players')

    // Se o jogador nao existir ainda e ja houver 15 favoritos, bloqueia
    const existingFavoriteDoc = await favoritesCollection.doc(docId).get()
    if (!existingFavoriteDoc.exists) {
      const snapshot = await favoritesCollection.get()
      if (snapshot.size >= MAX_FAVORITES) {
        const limitError = {
          status: 400,
          message: `Maximum of ${MAX_FAVORITES} favorites reached`
        }
        throw limitError
      }
    }

    await favoritesCollection.doc(docId).set(favorite)

    console.log(`✅ Player ${normalizedTag} added to favorites for user ${userId}`)
    return favorite
  } catch (error: unknown) {
    console.error('Error adding favorite player:', error)
    throw new Error('Failed to add favorite player', { cause: error })
  }
}

/**
 * Remove um player dos favoritos do usuário
 *
 * @param userId ID do usuário autenticado
 * @param playerTag Tag do player a ser removido
 */
export async function removeFavoritePlayer(
  userId: string,
  playerTag: string
): Promise<void> {
  try {
    // Normaliza a tag para buscar no Firestore
    const normalizedTag = playerTag.startsWith('#')
      ? playerTag.replace('#', '')
      : playerTag

    await db
      .collection('favorites')
      .doc(userId)
      .collection('players')
      .doc(normalizedTag)
      .delete()

    console.log(`✅ Player ${playerTag} removed from favorites for user ${userId}`)
  } catch (error: unknown) {
    console.error('Error removing favorite player:', error)
    throw new Error('Failed to remove favorite player', { cause: error })
  }
}

/**
 * Verifica se um player está nos favoritos do usuário
 *
 * @param userId ID do usuário autenticado
 * @param playerTag Tag do player a verificar
 * @returns true se estiver favoritado, false caso contrário
 */
export async function isFavoritePlayer(
  userId: string,
  playerTag: string
): Promise<boolean> {
  try {
    const normalizedTag = playerTag.startsWith('#')
      ? playerTag.replace('#', '')
      : playerTag

    const doc = await db
      .collection('favorites')
      .doc(userId)
      .collection('players')
      .doc(normalizedTag)
      .get()

    return doc.exists
  } catch (error: unknown) {
    console.error('Error checking favorite player:', error)
    return false
  }
}
