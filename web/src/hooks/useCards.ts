import { useState, useEffect } from 'react'
import { cardService } from '../services'
import { getApiErrorMessage } from '../utils/apiErrors'
import type { Card, SupportItem } from '../types'

/**
 * Hook para buscar todas as cartas do jogo
 * @returns {cards, supportItems, loading, error, refetch}
 */
export function useCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [supportItems, setSupportItems] = useState<SupportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCards = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await cardService.getAll()
      setCards(response.items)
      setSupportItems(response.supportItems)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setCards([])
      setSupportItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  return { 
    cards, 
    supportItems, 
    loading, 
    error, 
    refetch: fetchCards 
  }
}
