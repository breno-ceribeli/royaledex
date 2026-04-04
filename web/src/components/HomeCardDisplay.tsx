import type { Card } from '../types'

interface HomeCardDisplayProps {
  card: Card
  size?: 'md' | 'lg'
  rotation?: number
  className?: string
}

const sizeClasses = {
  md: 'w-24 h-34',
  lg: 'w-32 h-44',
}

const textClasses = {
  md: 'text-[11px]',
  lg: 'text-xs',
}

export function HomeCardDisplay({
  card,
  size = 'md',
  rotation = 0,
  className = '',
}: HomeCardDisplayProps) {
  return (
    <article
      className={[
        'group relative flex flex-col items-center gap-1 rounded-xl border border-[#243B53] bg-[#1A2B3C] p-2 transition-all duration-300',
        'hover:border-[#F0C040]/45 hover:shadow-[0_0_24px_rgba(240,192,64,0.16)]',
        sizeClasses[size],
        className,
      ].join(' ')}
      style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}
    >
      <div className="absolute -left-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#5E2391] bg-[#7B2FBE] shadow-lg">
        <span className="text-xs font-bold text-white">{card.elixirCost}</span>
      </div>

      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-linear-to-b from-[#243B53] to-[#1A2B3C]">
        <img
          src={card.iconUrls.medium}
          alt={card.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <p className={`text-center font-medium leading-tight text-white ${textClasses[size]}`}>
        {card.name}
      </p>

      <p className="rounded-full bg-[#0D1B2A] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#B0BEC5]">
        {card.rarity}
      </p>

      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[#F0C040]/0 transition-colors group-hover:bg-[#F0C040]/5" />
    </article>
  )
}
