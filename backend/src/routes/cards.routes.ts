import { Router } from 'express'
import * as cardsController from '../controllers/cards.controller'

const router = Router()

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get all Clash Royale cards
 *     description: Returns a list of all cards in the game with their details and images. Results are cached for 1 hour.
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: List of cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Rate limit exceeded. Please try again later.
 *       500:
 *         description: Server error or Clash API unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *       503:
 *         description: Clash Royale API temporarily unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Clash Royale API is temporarily unavailable
 */
router.get('/', cardsController.getAllCards)

export default router
