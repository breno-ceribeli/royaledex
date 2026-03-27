import { Router } from 'express'
import * as playersController from '../controllers/players.controller'

const router = Router()

/**
 * @swagger
 * /players/{playerTag}:
 *   get:
 *     summary: Get information about a player
 *     description: Returns detailed information about a single player by their tag. Player tags start with '#' and can be provided with or without it.
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         schema:
 *           type: string
 *         description: Player tag (e.g., '#2PYL' or '2PYL'). Can only contain 0-9 and P,Y,L,Q,G,R,J,C,U,V characters.
 *         example: '#2PYL'
 *     responses:
 *       200:
 *         description: Player data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tag:
 *                   type: string
 *                 name:
 *                   type: string
 *                 expLevel:
 *                   type: integer
 *                 trophies:
 *                   type: integer
 *                 bestTrophies:
 *                   type: integer
 *                 wins:
 *                   type: integer
 *                 losses:
 *                   type: integer
 *                 clan:
 *                   type: object
 *       400:
 *         description: Bad request - invalid player tag format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid player tag format. Tags can only contain 0-9 and specific letters.
 *       403:
 *         description: Access denied - invalid API token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Access denied. API token may be invalid or expired.
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Resource not found
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
 *         description: Server error
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
router.get('/:tag', playersController.getPlayerByTag)

/**
 * @swagger
 * /players/{playerTag}/battlelog:
 *   get:
 *     summary: Get player's recent battle history
 *     description: Returns list of recent battles for a player (usually last 30 battles). Includes battle type, opponent info, trophies, and results.
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         schema:
 *           type: string
 *         description: Player tag (e.g., '#2PYL' or '2PYL'). Can only contain 0-9 and P,Y,L,Q,G,R,J,C,U,V characters.
 *         example: '#2PYL'
 *     responses:
 *       200:
 *         description: Battle log retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: Battle type (e.g., PvP, challenge, tournament)
 *                   battleTime:
 *                     type: string
 *                     description: ISO 8601 timestamp of the battle
 *                   team:
 *                     type: array
 *                     description: Player's team data
 *                   opponent:
 *                     type: array
 *                     description: Opponent team data
 *                   arena:
 *                     type: object
 *                   gameMode:
 *                     type: object
 *       400:
 *         description: Bad request - invalid player tag format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid player tag format. Tags can only contain 0-9 and specific letters.
 *       403:
 *         description: Access denied - invalid API token
 *       404:
 *         description: Player not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 *       503:
 *         description: Clash Royale API temporarily unavailable
 */
router.get('/:tag/battlelog', playersController.getBattleLog)

/**
 * @swagger
 * /players/{playerTag}/battlelog/stats:
 *   get:
 *     summary: Get aggregated statistics from player's battle history
 *     description: Calculates and returns statistics based only on competitive battles (PvP and Path of Legend). Includes win rate, average trophy change, most lost against cards, and crowns distribution.
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         schema:
 *           type: string
 *         description: Player tag (e.g., '#2PYL' or '2PYL')
 *         example: '#2PYL'
 *     responses:
 *       200:
 *         description: Battle statistics successfully calculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBattles:
 *                   type: integer
 *                   description: Total number of competitive battles analyzed (PvP + Path of Legend only)
 *                   example: 18
 *                 pvpBattles:
 *                   type: integer
 *                   description: Number of PvP battles
 *                   example: 10
 *                 pathOfLegendBattles:
 *                   type: integer
 *                   description: Number of Path of Legend battles
 *                   example: 8
 *                 wins:
 *                   type: integer
 *                   description: Number of victories
 *                   example: 10
 *                 losses:
 *                   type: integer
 *                   description: Number of defeats
 *                   example: 7
 *                 draws:
 *                   type: integer
 *                   description: Number of draws
 *                   example: 1
 *                 winRate:
 *                   type: number
 *                   format: float
 *                   description: Win rate as decimal (0.0 to 1.0)
 *                   example: 0.56
 *                 avgTrophyChange:
 *                   type: number
 *                   format: float
 *                   nullable: true
 *                   description: Average trophy change per battle (only calculated for battles with trophies, null if none)
 *                   example: 2.5
 *                 avgElixirLeaked:
 *                   type: number
 *                   format: float
 *                   description: Average elixir leaked per battle
 *                   example: 12.3
 *                 mostLostAgainstCards:
 *                   type: array
 *                   description: Top 10 cards with highest loss rate when faced. Sorted by number of losses.
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: 'Hog Rider'
 *                       count:
 *                         type: integer
 *                         description: Number of times lost against this card
 *                         example: 4
 *                       percentage:
 *                         type: integer
 *                         description: Loss rate when facing this card (losses / total appearances)
 *                         example: 80
 *                 crownsDistribution:
 *                   type: object
 *                   description: Distribution of crowns won in battles
 *                   properties:
 *                     0:
 *                       type: integer
 *                       example: 3
 *                     1:
 *                       type: integer
 *                       example: 5
 *                     2:
 *                       type: integer
 *                       example: 7
 *                     3:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Invalid player tag format
 *       404:
 *         description: Player not found
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Server error
 *       503:
 *         description: Clash Royale API temporarily unavailable
 */
router.get('/:tag/battlelog/stats', playersController.getBattleLogStats)

export default router
