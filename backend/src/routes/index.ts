import { Router } from 'express'
import cardsRoutes from './cards.routes'
import playersRoutes from './players.routes'
import favoritesRoutes from './favorites.routes'

const router = Router()

// Monta todas as rotas sob /api
router.use('/cards', cardsRoutes)
router.use('/players', playersRoutes)
router.use('/favorites', favoritesRoutes)

export default router
