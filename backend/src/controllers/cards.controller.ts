import { Request, Response } from 'express'
import * as clashService from '../services/clash.service'
import { ClashApiError } from '../types/clash.types'

export const getAllCards = async (_req: Request, res: Response): Promise<void> => {
  try {
    const cards = await clashService.getCards()
    res.json(cards)
  } catch (error) {
    // Erros já tratados pelo service têm status e message
    if (error && typeof error === 'object' && 'status' in error) {
      const clashError = error as ClashApiError
      res.status(clashError.status).json({ error: clashError.message })
      return
    }

    // Erro desconhecido
    console.error('Error in getAllCards:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
