import { Request, Response } from 'express'
import * as favoritesService from '../services/favorites.service'

/**
 * GET /api/favorites/players
 * Retorna todos os players favoritos do usuário autenticado
 */
export const getFavoritePlayers = async (req: Request, res: Response): Promise<void> => {
  try {
    // userId vem do authMiddleware (req.userId)
    const userId = req.userId

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' })
      return
    }

    const favorites = await favoritesService.getFavoritePlayers(userId)
    res.json(favorites)
  } catch (error) {
    console.error('Error in getFavoritePlayers:', error)
    res.status(500).json({ error: 'Failed to fetch favorite players' })
  }
}

/**
 * POST /api/favorites/players
 * Adiciona um player aos favoritos do usuário
 */
export const addFavoritePlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' })
      return
    }

    const { tag, name } = req.body

    // Validação dos campos obrigatórios
    if (!tag || !name) {
      res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Both "tag" and "name" are required'
      })
      return
    }

    if (typeof tag !== 'string' || typeof name !== 'string') {
      res.status(400).json({ 
        error: 'Invalid field types',
        message: 'Both "tag" and "name" must be strings'
      })
      return
    }

    const favorite = await favoritesService.addFavoritePlayer(userId, { tag, name })
    res.status(201).json(favorite)
  } catch (error) {
    console.error('Error in addFavoritePlayer:', error)

    if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
      const typedError = error as { status: number; message: string }
      res.status(typedError.status).json({ error: typedError.message })
      return
    }

    res.status(500).json({ error: 'Failed to add favorite player' })
  }
}

/**
 * DELETE /api/favorites/players/:tag
 * Remove um player dos favoritos do usuário
 */
export const removeFavoritePlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' })
      return
    }

    const tag = req.params.tag as string  // Cast para string (parâmetro de rota sempre é string única)

    if (!tag) {
      res.status(400).json({ error: 'Player tag is required' })
      return
    }

    await favoritesService.removeFavoritePlayer(userId, tag)
    res.status(204).send() // 204 No Content = sucesso sem corpo de resposta
  } catch (error) {
    console.error('Error in removeFavoritePlayer:', error)
    res.status(500).json({ error: 'Failed to remove favorite player' })
  }
}

/**
 * GET /api/favorites/players/:tag/check
 * Verifica se um player está nos favoritos
 */
export const checkFavoritePlayer = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' })
      return
    }

    const tag = req.params.tag as string  // Cast para string (parâmetro de rota sempre é string única)

    if (!tag) {
      res.status(400).json({ error: 'Player tag is required' })
      return
    }

    const isFavorite = await favoritesService.isFavoritePlayer(userId, tag)
    res.json({ isFavorite })
  } catch (error) {
    console.error('Error in checkFavoritePlayer:', error)
    res.status(500).json({ error: 'Failed to check favorite player' })
  }
}
