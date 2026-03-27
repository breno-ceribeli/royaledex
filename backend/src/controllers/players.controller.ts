import { Request, Response } from 'express'
import * as clashService from '../services/clash.service'
import { ClashApiError } from '../types/clash.types'

export const getPlayerByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = req.params.tag as string

    // Valida se tag foi fornecida
    if (!tag) {
      res.status(400).json({ error: 'Player tag is required' })
      return
    }

    const player = await clashService.getPlayer(tag)
    res.json(player)
  } catch (error) {
    // Erros já tratados pelo service têm status e message
    if (error && typeof error === 'object' && 'status' in error) {
      const clashError = error as ClashApiError
      res.status(clashError.status).json({ error: clashError.message })
      return
    }

    // Erro desconhecido
    console.error('Error in getPlayerByTag:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getBattleLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = req.params.tag as string

    // Valida se tag foi fornecida
    if (!tag) {
      res.status(400).json({ error: 'Player tag is required' })
      return
    }

    const battleLog = await clashService.getBattleLog(tag)
    res.json(battleLog)
  } catch (error) {
    // Erros já tratados pelo service têm status e message
    if (error && typeof error === 'object' && 'status' in error) {
      const clashError = error as ClashApiError
      res.status(clashError.status).json({ error: clashError.message })
      return
    }

    // Erro desconhecido
    console.error('Error in getBattleLog:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getBattleLogStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = req.params.tag as string

    // Valida se tag foi fornecida
    if (!tag) {
      res.status(400).json({ error: 'Player tag is required' })
      return
    }

    const stats = await clashService.getBattleLogStats(tag)
    res.json(stats)
  } catch (error) {
    // Erros já tratados pelo service têm status e message
    if (error && typeof error === 'object' && 'status' in error) {
      const clashError = error as ClashApiError
      res.status(clashError.status).json({ error: clashError.message })
      return
    }

    // Erro desconhecido
    console.error('Error in getBattleLogStats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
