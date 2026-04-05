import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Battle, BattleCard } from '../../types'
import { formatTag } from '../../utils/formatters'

interface BattleItemProps {
  battle: Battle
  playerTag: string
}

function formatBattleDate(dateString: string) {
  try {
    let date = new Date(dateString)

    if (Number.isNaN(date.getTime()) && /^\d{8}T\d{6}\.\d{3}Z$/.test(dateString)) {
      const year = dateString.substring(0, 4)
      const month = dateString.substring(4, 6)
      const day = dateString.substring(6, 8)
      const hour = dateString.substring(9, 11)
      const minute = dateString.substring(11, 13)
      const second = dateString.substring(13, 15)

      date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`)
    }

    if (Number.isNaN(date.getTime())) {
      return 'Data invalida'
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return 'Data invalida'
  }
}

function DeckGrid({ cards, side }: { cards?: BattleCard[]; side: 'player' | 'opponent' }) {
  if (!cards || cards.length === 0) {
    return <p className="text-xs text-rd-muted">Sem informacoes de deck.</p>
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((card, idx) => (
        <div
          key={`${side}-${card.id || idx}`}
          className="rounded-md border border-[rgba(240,192,64,0.14)] bg-[rgba(17,25,53,0.58)] p-1"
          title={card.name}
        >
          <img
            src={card.iconUrls?.medium || ''}
            alt={card.name || 'Carta'}
            className="w-full rounded"
            onError={(event) => {
              ;(event.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function BattleItem({ battle, playerTag }: BattleItemProps) {
  const [showDetails, setShowDetails] = useState(false)

  const normalizedPlayerTag = formatTag(playerTag)
  const playerData = battle.team?.find((p) => formatTag(p.tag) === normalizedPlayerTag) || battle.team?.[0]
  const opponentData = battle.opponent?.[0]

  if (!playerData || !opponentData) {
    return (
      <article className="royale-card p-4">
        <p className="text-sm text-rd-muted">
          Nao foi possivel carregar os detalhes desta batalha.
        </p>
      </article>
    )
  }

  const playerCrowns = playerData?.crowns ?? 0
  const opponentCrowns = opponentData?.crowns ?? 0
  const isWin = playerCrowns > opponentCrowns
  const isDraw = playerCrowns === opponentCrowns

  const resultLabel = isWin ? 'Vitoria' : isDraw ? 'Empate' : 'Derrota'
  const resultTone = isWin
    ? 'bg-[rgba(57,176,122,0.18)] text-emerald-300 border-[rgba(57,176,122,0.38)]'
    : isDraw
      ? 'bg-[rgba(240,192,64,0.14)] text-rd-primary-soft border-[rgba(240,192,64,0.38)]'
      : 'bg-[rgba(237,89,102,0.14)] text-rose-300 border-[rgba(237,89,102,0.4)]'

  return (
    <article className="royale-card overflow-hidden p-0">
      <button
        type="button"
        className="grid w-full grid-cols-1 gap-3 px-4 py-4 text-left transition-colors hover:bg-[rgba(240,192,64,0.06)] sm:grid-cols-[1.2fr_1fr_0.9fr]"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-rd-muted">{battle.type}</p>
          <p className="mt-1 text-xs text-rd-muted">Arena: {battle.arena.name}</p>
        </div>

        <div className="text-left sm:text-center">
          <p className="royale-title text-2xl text-rd-main">
            {playerCrowns} x {opponentCrowns}
          </p>
          {playerData?.trophyChange !== undefined && (
            <p className={`text-sm ${playerData.trophyChange >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              Trofeus: {playerData.trophyChange > 0 ? '+' : ''}{playerData.trophyChange}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 text-xs sm:items-end">
          <span className={`rounded-full border px-2 py-1 text-xs uppercase tracking-[0.16em] ${resultTone}`}>
            {resultLabel}
          </span>
          <span className="text-rd-muted">{formatBattleDate(battle.battleTime)}</span>
          <span className="inline-flex items-center gap-1 text-rd-primary">
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            detalhes
          </span>
        </div>
      </button>

      {showDetails && (
        <div className="border-t border-[rgba(240,192,64,0.14)] px-4 py-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-rd-muted">
                {playerData.name || 'Voce'}
              </h4>
              <div className="mt-2">
                <DeckGrid cards={playerData.cards} side="player" />
              </div>
              {playerData.elixirLeaked > 0 && (
                <p className="mt-2 text-xs text-rd-muted">
                  Elixir desperdicado: {playerData.elixirLeaked}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-rd-muted">
                {opponentData.name || 'Oponente'}
              </h4>
              <div className="mt-2">
                <DeckGrid cards={opponentData.cards} side="opponent" />
              </div>
              {opponentData.elixirLeaked > 0 && (
                <p className="mt-2 text-xs text-rd-muted">
                  Elixir desperdicado: {opponentData.elixirLeaked}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[rgba(240,192,64,0.14)] pt-3 text-xs text-rd-muted sm:grid-cols-2">
            <div>
              Modo: <span className="text-rd-main">{battle.gameMode.name}</span>
            </div>
            <div>
              Arena: <span className="text-rd-main">{battle.arena.name}</span>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
