import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import * as favoritesController from '../controllers/favorites.controller'

const router = Router()

// Todas as rotas de favoritos exigem autenticação
router.use(authMiddleware)

/**
 * @swagger
 * /favorites/players:
 *   get:
 *     summary: Get user's favorite players
 *     description: Returns all favorite players for the authenticated user, ordered by most recently added.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite players
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tag:
 *                     type: string
 *                     example: '#2PYL'
 *                   name:
 *                     type: string
 *                     example: 'ProPlayer123'
 *                   addedAt:
 *                     type: string
 *                     format: date-time
 *                     example: '2026-03-27T13:30:00.000Z'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/players', favoritesController.getFavoritePlayers)

/**
 * @swagger
 * /favorites/players:
 *   post:
 *     summary: Add player to favorites
 *     description: Adds a player to the authenticated user's favorites. If already favorited, updates the addedAt timestamp.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tag
 *               - name
 *             properties:
 *               tag:
 *                 type: string
 *                 description: Player tag (with or without #)
 *                 example: '#2PYL'
 *               name:
 *                 type: string
 *                 description: Player name
 *                 example: 'ProPlayer123'
 *     responses:
 *       201:
 *         description: Player added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tag:
 *                   type: string
 *                   example: '#2PYL'
 *                 name:
 *                   type: string
 *                   example: 'ProPlayer123'
 *                 addedAt:
 *                   type: string
 *                   format: date-time
 *                   example: '2026-03-27T13:30:00.000Z'
 *       400:
 *         description: Missing or invalid fields
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/players', favoritesController.addFavoritePlayer)

/**
 * @swagger
 * /favorites/players/{playerTag}:
 *   delete:
 *     summary: Remove player from favorites
 *     description: Removes a player from the authenticated user's favorites.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         schema:
 *           type: string
 *         description: Player tag (with or without #)
 *         example: '2PYL'
 *     responses:
 *       204:
 *         description: Player removed successfully (no content)
 *       400:
 *         description: Player tag is required
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.delete('/players/:tag', favoritesController.removeFavoritePlayer)

/**
 * @swagger
 * /favorites/players/{playerTag}/check:
 *   get:
 *     summary: Check if player is favorited
 *     description: Checks if a specific player is in the authenticated user's favorites.
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         schema:
 *           type: string
 *         description: Player tag (with or without '#')
 *         example: '2PYL'
 *     responses:
 *       200:
 *         description: Favorite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Player tag is required
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.get('/players/:tag/check', favoritesController.checkFavoritePlayer)

export default router
