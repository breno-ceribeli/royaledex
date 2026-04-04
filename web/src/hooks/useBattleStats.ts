import { useState, useEffect, useCallback } from 'react'
import { playerService } from '../services'
import { getApiErrorMessage } from '../utils/apiErrors'
import type { BattleLogStats } from '../types'

/**
 * Hook para buscar estatísticas calculadas do battlelog
 * @param tag - Tag do jogador (com ou sem #)
 * @returns {data, loading, error, refetch}
 */
export function useBattleStats(tag: string) {
  const [data, setData] = useState<BattleLogStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async () => {
    if (!tag) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const stats = await playerService.getBattleStats(tag)
      setData(stats)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [tag])

  useEffect(() => {
    if (!tag) {
      setLoading(false)
      return
    }

    let isMounted = true

    async function loadStats() {
      try {
        setLoading(true)
        setError('')
        const stats = await playerService.getBattleStats(tag)
        if (isMounted) {
          setData(stats)
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err))
          setData(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      isMounted = false
    }
  }, [tag])

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchStats 
  }
}
