import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks'
import type { FavoritePlayer } from '../types'
import { formatTag } from '../utils/formatters'

interface FavoritePlayerCardProps {
  player: FavoritePlayer
}

export function FavoritePlayerCard({ player }: FavoritePlayerCardProps) {
  const navigate = useNavigate()
  const { removeFavorite, actionLoading } = useFavorites()
  const normalizedTag = formatTag(player.tag)

  const handleRemove = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    await removeFavorite(player.tag)
  }

  const handleClick = () => {
    navigate(`/players/${normalizedTag}`)
  }

  return (
    <article
      onClick={handleClick}
      className="royale-card group relative flex cursor-pointer items-start justify-between gap-4 overflow-hidden p-5 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="pointer-events-none absolute -left-12 -top-12 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(240,192,64,0.18)_0%,rgba(240,192,64,0)_70%)]" />

      <div className="relative flex-1">
        <p className="text-[10px] uppercase tracking-[0.28em] text-rd-muted">Jogador salvo</p>
        <h3 className="royale-title mt-2 text-2xl">
          {player.name}
        </h3>
        <p className="mt-1 font-mono text-sm text-rd-primary">
          #{normalizedTag}
        </p>
        <p className="mt-4 text-xs text-rd-muted">
          Adicionado em: {new Date(player.addedAt).toLocaleDateString('pt-BR')}
        </p>
      </div>

      <button
        onClick={handleRemove}
        disabled={actionLoading}
        title="Remover dos favoritos"
        className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(255,95,102,0.45)] bg-[rgba(90,25,29,0.85)] text-[#ffcdd3] transition-colors hover:border-[rgba(255,95,102,0.7)] hover:bg-[rgba(128,33,41,0.9)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="material-symbols-rounded text-[18px]">
          {actionLoading ? 'hourglass_top' : 'delete'}
        </span>
      </button>
    </article>
  )
}
