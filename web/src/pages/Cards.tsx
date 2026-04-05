import { useEffect, useMemo, useRef, useState } from 'react'
import { useCards } from '../hooks'
import { CardsDisplayCard } from '../components/CardsDisplayCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { formatRarityLabel } from '../utils/formatters'
import type { Card } from '../types'

type SortOption = 'name-asc' | 'elixir-asc' | 'elixir-desc'

const MIN_ANIMATED_CARDS = 72
const MIN_REPEAT_SETS = 5
const MAX_LOOP_SETS = 4

const elixirButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const normalizeLabel = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const rarityRank = (rarity: string) => {
  const normalized = normalizeLabel(rarity)

  if (normalized.includes('common') || normalized.includes('comum')) return 1
  if (normalized.includes('rare') || normalized.includes('rara')) return 2
  if (normalized.includes('epic') || normalized.includes('epica')) return 3
  if (normalized.includes('legend')) return 4
  if (normalized.includes('champion') || normalized.includes('campeao')) return 5

  return 99
}

const getRepeatCount = (cardsLength: number) => {
  if (cardsLength === 0) {
    return 1
  }

  const byCardCount = Math.ceil(MIN_ANIMATED_CARDS / cardsLength)
  return Math.max(MIN_REPEAT_SETS, byCardCount)
}

const getLoopMetrics = (totalHeight: number, repeatCount: number) => {
  const oneSetHeight = totalHeight / repeatCount
  const loopSets = Math.min(MAX_LOOP_SETS, Math.max(2, repeatCount - 1))

  return {
    oneSetHeight,
    loopHeight: oneSetHeight * loopSets,
  }
}

export function Cards() {
  const { cards, loading, error } = useCards()
  const [elixirFilter, setElixirFilter] = useState<number | null>(null)
  const [rarityFilter, setRarityFilter] = useState('Todas')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const scrollPositionRef = useRef<number>(0)

  const applyScrollPosition = (nextPosition: number) => {
    scrollPositionRef.current = nextPosition
    if (gridRef.current) {
      gridRef.current.style.transform = `translateY(-${nextPosition}px)`
    }
  }

  const resetScrollState = () => {
    applyScrollPosition(0)
    lastTimeRef.current = 0
  }

  const filteredAndSortedCards = useMemo(() => {
    let filtered = [...cards]

    if (elixirFilter !== null) {
      filtered = filtered.filter((card) => card.elixirCost === elixirFilter)
    }

    if (rarityFilter !== 'Todas') {
      filtered = filtered.filter((card) => card.rarity === rarityFilter)
    }

    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        break
      case 'elixir-asc':
        filtered.sort((a, b) => a.elixirCost - b.elixirCost)
        break
      case 'elixir-desc':
        filtered.sort((a, b) => b.elixirCost - a.elixirCost)
        break
    }

    return filtered
  }, [cards, elixirFilter, rarityFilter, sortBy])

  const rarityOptions = useMemo(() => {
    return Array.from(new Set(cards.map((card) => card.rarity))).sort((a, b) => {
      const rankDiff = rarityRank(a) - rarityRank(b)
      if (rankDiff !== 0) {
        return rankDiff
      }

      return a.localeCompare(b, 'pt-BR')
    })
  }, [cards])

  const displayCards = useMemo(() => {
    if (filteredAndSortedCards.length === 0) {
      return []
    }

    const repeatCount = getRepeatCount(filteredAndSortedCards.length)
    const repeatedCards: Card[] = []

    for (let i = 0; i < repeatCount; i += 1) {
      repeatedCards.push(...filteredAndSortedCards)
    }

    return repeatedCards
  }, [filteredAndSortedCards])

  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const animate = (time: number) => {
      if (filteredAndSortedCards.length === 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time
      }

      const delta = time - lastTimeRef.current
      lastTimeRef.current = time
      const speed = 80 / 1000

      const container = containerRef.current
      if (!container) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const totalHeight = container.scrollHeight
      const repeatCount = getRepeatCount(filteredAndSortedCards.length)
      const { oneSetHeight, loopHeight } = getLoopMetrics(totalHeight, repeatCount)
      let nextPosition = scrollPositionRef.current + delta * speed

      while (nextPosition >= loopHeight) {
        nextPosition -= oneSetHeight
      }

      applyScrollPosition(nextPosition)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [filteredAndSortedCards.length, isPaused])

      useEffect(() => {
        const container = containerRef.current
        if (!container) {
          return
        }

        const handleContainerWheel = (event: WheelEvent) => {
          if (filteredAndSortedCards.length === 0) {
            return
          }

          event.preventDefault()
          event.stopPropagation()

          const totalHeight = container.scrollHeight
          const repeatCount = getRepeatCount(filteredAndSortedCards.length)
          const { oneSetHeight, loopHeight } = getLoopMetrics(totalHeight, repeatCount)

          let nextPosition = scrollPositionRef.current + event.deltaY

          if (nextPosition < 0) {
            while (nextPosition < 0) {
              nextPosition += oneSetHeight
            }
          }

          while (nextPosition >= loopHeight) {
            nextPosition -= oneSetHeight
          }

          applyScrollPosition(nextPosition)
        }

        container.addEventListener('wheel', handleContainerWheel, { passive: false })

        return () => {
          container.removeEventListener('wheel', handleContainerWheel)
        }
      }, [filteredAndSortedCards.length])

  if (loading) return <LoadingSpinner message="Carregando cartas..." />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            <span className="text-[#F0C040]">Cartas</span>
          </h1>
          <p className="text-[#B0BEC5]">Todas as cartas do Clash Royale</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#B0BEC5]">Custo de Elixir</label>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
              <button
                type="button"
                onClick={() => {
                  resetScrollState()
                  setElixirFilter(null)
                }}
                className={[
                  'shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                  elixirFilter === null
                    ? 'border-[#F0C040] bg-[#F0C040] text-[#0D1B2A] hover:bg-[#C9A033]'
                    : 'border-[#243B53] bg-transparent text-[#B0BEC5] hover:bg-[#243B53] hover:text-white',
                ].join(' ')}
              >
                Todos
              </button>

              {elixirButtons.map((elixir) => (
                <button
                  key={elixir}
                  type="button"
                  onClick={() => {
                    resetScrollState()
                    setElixirFilter(elixir)
                  }}
                  className={[
                    'min-w-10 shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                    elixirFilter === elixir
                      ? 'border-[#F0C040] bg-[#F0C040] text-[#0D1B2A] hover:bg-[#C9A033]'
                      : 'border-[#243B53] bg-transparent text-[#B0BEC5] hover:bg-[#243B53] hover:text-white',
                  ].join(' ')}
                >
                      {elixir}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label htmlFor="rarityCards" className="block text-sm font-medium text-[#B0BEC5]">Raridade</label>
              <select
                id="rarityCards"
                value={rarityFilter}
                onChange={(event) => {
                  resetScrollState()
                  setRarityFilter(event.target.value)
                }}
                className="h-9 w-45 rounded-md border border-[#243B53] bg-[#1A2B3C] px-3 text-sm text-white outline-none transition-colors focus:border-[#F0C040]"
              >
                <option value="Todas">Todas</option>
                {rarityOptions.map((rarity) => (
                  <option key={rarity} value={rarity}>{formatRarityLabel(rarity)}</option>
                ))}
              </select>
            </div>

            <div className="ml-auto space-y-2">
              <label htmlFor="sortCards" className="text-sm font-medium text-[#B0BEC5]">Ordenar por</label>
              <select
                id="sortCards"
                value={sortBy}
                onChange={(event) => {
                  resetScrollState()
                  setSortBy(event.target.value as SortOption)
                }}
                className="h-9 w-40 rounded-md border border-[#243B53] bg-[#1A2B3C] px-3 text-sm text-white outline-none transition-colors focus:border-[#F0C040]"
              >
                <option value="name-asc">Nome A-Z</option>
                <option value="elixir-asc">Menor elixir</option>
                <option value="elixir-desc">Maior elixir</option>
              </select>
            </div>
          </div>
        </div>

        <p className="mb-4 text-sm text-[#B0BEC5]">
          {filteredAndSortedCards.length} carta{filteredAndSortedCards.length !== 1 ? 's' : ''} encontrada{filteredAndSortedCards.length !== 1 ? 's' : ''}
        </p>

        {filteredAndSortedCards.length === 0 ? (
          <div className="rounded-2xl border border-[#243B53] bg-[#1A2B3C]/30 p-10 text-center text-sm text-[#B0BEC5]">
            Nenhuma carta encontrada para os filtros selecionados.
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl border border-[#243B53] bg-[#1A2B3C]/30 p-4 md:p-6"
            style={{ height: 'calc(100vh - 280px)', minHeight: '540px', overscrollBehavior: 'contain' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false)
              lastTimeRef.current = 0
            }}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => {
              setIsPaused(false)
              lastTimeRef.current = 0
            }}
          >
            <div
              ref={gridRef}
              className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5 xl:grid-cols-6"
              style={{ transform: 'translateY(0px)', willChange: 'transform' }}
            >
              {displayCards.map((card, index) => (
                <CardsDisplayCard key={`${card.id}-${index}`} card={card} />
              ))}
            </div>

            <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-12 bg-linear-to-b from-[#1A2B3C] to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-12 bg-linear-to-t from-[#1A2B3C] to-transparent" />
          </div>
        )}

        <p className="mt-4 text-center text-sm text-[#B0BEC5]">
          Use o scroll para navegar pelas cartas
        </p>
      </div>
    </div>
  )
}

