import { Router } from 'express'
import cardsRoutes from './cards.routes'

const router = Router()

// Monta todas as rotas sob /api
router.use('/cards', cardsRoutes)

export default router
