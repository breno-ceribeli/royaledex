import { useState, useEffect, useCallback } from 'react'
import { playerService } from '../services'
import { getApiErrorMessage } from '../utils/apiErrors'
import type { BattleLog } from '../types'

/**
 * Hook para buscar histórico de batalhas de um jogador
 * @param tag - Tag do jogador (com ou sem #)
 * @returns {data, loading, error, refetch}
 */
export function useBattleLog(tag: string) {
  const [data, setData] = useState<BattleLog>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBattleLog = useCallback(async () => {
    if (!tag) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const battles = await playerService.getBattleLog(tag)
      setData(battles)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setData([])
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

    async function loadBattleLog() {
      try {
        setLoading(true)
        setError('')
        const battles = await playerService.getBattleLog(tag)
        if (isMounted) {
          setData(battles)
        }
      } catch (err) {
        if (isMounted) {
          setError(getApiErrorMessage(err))
          setData([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadBattleLog()

    return () => {
      isMounted = false
    }
  }, [tag])

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchBattleLog 
  }
}
