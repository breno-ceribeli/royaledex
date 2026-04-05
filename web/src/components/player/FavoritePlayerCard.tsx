import type { MouseEvent } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../../hooks'
import type { FavoritePlayer } from '../../types'
import { formatTag } from '../../utils/formatters'

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
    navigate(`/players/${encodeURIComponent(normalizedTag)}`)
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
        className="relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(239,68,68,0.4)] bg-[rgba(127,29,29,0.35)] text-[#fecaca] transition-colors hover:border-[rgba(239,68,68,0.65)] hover:bg-[rgba(127,29,29,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {actionLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Trash2 className="h-4.5 w-4.5" />}
      </button>
    </article>
  )
}
