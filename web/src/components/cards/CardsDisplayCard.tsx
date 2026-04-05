import { useEffect, useMemo, useRef, useState } from 'react'
import type { Card } from '../../types'
import { formatRarityLabel } from '../../utils/formatters'

interface CardsDisplayCardProps {
  card: Card
}

type RarityKey = 'common' | 'rare' | 'epic' | 'legendary' | 'champion' | 'unknown'

const normalizeLabel = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const getRarityKey = (rarity: string): RarityKey => {
  const normalized = normalizeLabel(rarity)

  if (normalized.includes('champion') || normalized.includes('campeao')) {
    return 'champion'
  }

  if (normalized.includes('legend')) {
    return 'legendary'
  }

  if (normalized.includes('epic') || normalized.includes('epica')) {
    return 'epic'
  }

  if (normalized.includes('rare') || normalized.includes('rara')) {
    return 'rare'
  }

  if (normalized.includes('common') || normalized.includes('comum')) {
    return 'common'
  }

  return 'unknown'
}

const rarityTone = {
  common: { border: '#60dafb', glow: 'rgba(96, 218, 251, 0.34)' },
  rare: { border: '#ffc461', glow: 'rgba(255, 196, 97, 0.34)' },
  epic: { border: '#c668ff', glow: 'rgba(198, 104, 255, 0.34)' },
  champion: { border: '#fae82a', glow: 'rgba(250, 232, 42, 0.36)' },
  unknown: { border: '#243B53', glow: 'rgba(36, 59, 83, 0.3)' },
}

const VERSION_HOLD_MS = 2200
const VERSION_FADE_MS = 320

export function CardsDisplayCard({ card }: CardsDisplayCardProps) {
  const key = getRarityKey(card.rarity)
  const isLegendary = key === 'legendary'
  const tone = rarityTone[key === 'legendary' ? 'unknown' : key]
  const [isHovered, setIsHovered] = useState(false)
  const [activeVariantIndex, setActiveVariantIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const cycleTimeoutRef = useRef<number | null>(null)
  const fadeTimeoutRef = useRef<number | null>(null)

  const variantImages = useMemo(() => {
    const urls = [card.iconUrls.medium, card.iconUrls.evolutionMedium, card.iconUrls.heroMedium].filter(
      (url): url is string => Boolean(url)
    )

    return Array.from(new Set(urls))
  }, [card.iconUrls.evolutionMedium, card.iconUrls.heroMedium, card.iconUrls.medium])

  useEffect(() => {
    if (!isHovered || variantImages.length < 2) {
      return
    }

    const scheduleNextImage = () => {
      cycleTimeoutRef.current = window.setTimeout(() => {
        setIsFading(true)

        fadeTimeoutRef.current = window.setTimeout(() => {
          setActiveVariantIndex((currentIndex) => (currentIndex + 1) % variantImages.length)
          setIsFading(false)
          scheduleNextImage()
        }, VERSION_FADE_MS)
      }, VERSION_HOLD_MS)
    }

    scheduleNextImage()

    return () => {
      if (cycleTimeoutRef.current !== null) {
        window.clearTimeout(cycleTimeoutRef.current)
        cycleTimeoutRef.current = null
      }

      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current)
        fadeTimeoutRef.current = null
      }
    }
  }, [isHovered, variantImages.length])

  return (
    <article
      className="group relative h-48 w-32 transition-transform duration-300 hover:-translate-y-0.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setActiveVariantIndex(0)
        setIsFading(false)
      }}
    >
      {isLegendary ? (
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-b from-[#fcb0fe] via-[#fef2ff] to-[#6cebf3] shadow-[0_0_24px_rgba(252,176,254,0.34)]" />
      ) : (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl border"
          style={{ borderColor: tone.border, boxShadow: `0 0 22px ${tone.glow}` }}
        />
      )}

      <div className={`absolute rounded-xl bg-[#1A2B3C] ${isLegendary ? 'inset-px' : 'inset-0'}`} />

      <div className="relative z-10 flex h-full flex-col items-center gap-1 p-2">
        <div className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#5E2391] bg-[#7B2FBE] shadow-lg">
          <span className="text-xs font-bold text-white">{card.elixirCost}</span>
        </div>

        <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden rounded-lg bg-linear-to-b from-[#243B53] to-[#1A2B3C] p-1">
          <img
            src={variantImages[activeVariantIndex] || card.iconUrls.medium}
            alt={card.name}
            loading="lazy"
            className={[
              'h-full w-full object-contain transition-opacity duration-300',
              isFading ? 'opacity-0' : 'opacity-100',
            ].join(' ')}
          />
        </div>

        <p className="line-clamp-2 text-center text-sm font-medium leading-tight text-white">{card.name}</p>

        <span className="rounded-full bg-[#0D1B2A] px-2 py-0.5 text-[10px] font-medium text-[#B0BEC5]">
          {formatRarityLabel(card.rarity)}
        </span>
      </div>

    </article>
  )
}
