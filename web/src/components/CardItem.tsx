import type { Card } from '../types'

interface CardItemProps {
  card: Card
}

export function CardItem({ card }: CardItemProps) {
  const rarityTone =
    card.rarity.toLowerCase() === 'legendary'
      ? 'text-rd-primary'
      : card.rarity.toLowerCase() === 'epic'
        ? 'text-rd-accent'
        : 'text-rd-muted'

  return (
    <article className="group relative overflow-hidden rounded-xl border border-[rgba(240,192,64,0.15)] bg-rd-surface-low p-3 transition-transform hover:-translate-y-1">
      <img
        src={card.iconUrls.medium}
        alt={card.name}
        className="w-full rounded-lg"
      />

      <div className="mt-3 flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-semibold">
          {card.name}
        </h3>
        <span className="chip chip-win whitespace-nowrap">{card.elixirCost} elixir</span>
      </div>

      <p className={`mt-1 text-xs uppercase tracking-[0.2em] ${rarityTone}`}>{card.rarity}</p>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-lg border border-[rgba(240,192,64,0.2)] bg-[rgba(6,20,35,0.95)] p-3 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="text-xs text-rd-muted">Nivel maximo: {card.maxLevel}</p>
      </div>
    </article>
  )
}
