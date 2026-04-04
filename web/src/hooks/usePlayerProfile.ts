import { useState, useEffect, useCallback } from 'react'
import { playerService } from '../services'
import { getApiErrorMessage } from '../utils/apiErrors'
import type { PlayerProfile } from '../types'

/**
 * Hook para buscar perfil de um jogador
 * @param tag - Tag do jogador (com ou sem #)
 * @returns {data, loading, error, refetch}
 */
export function usePlayerProfile(tag: string) {
  const [data, setData] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProfile = useCallback(async () => {
    if (!tag) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')
      const profile = await playerService.getProfile(tag)
      setData(profile)
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

    async function loadProfile() {
      try {
        setLoading(true)
        setError('')
        const profile = await playerService.getProfile(tag)
        if (isMounted) {
          setData(profile)
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

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [tag])

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchProfile 
  }
}
