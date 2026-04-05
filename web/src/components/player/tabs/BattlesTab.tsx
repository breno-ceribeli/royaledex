import { useState } from 'react'
import { BattleItem } from '../BattleItem'
import type { BattleLog } from '../../../types'

interface BattlesTabProps {
  battles: BattleLog
  loading: boolean
  error: string
  playerTag: string
}

export function BattlesTab({ battles, loading, error, playerTag }: BattlesTabProps) {
  const [visibleCount, setVisibleCount] = useState(5)

  if (loading) {
    return (
      <div className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-8 text-center text-sm text-[#B0BEC5]">
        Carregando batalhas...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-8 text-center text-sm text-[#B0BEC5]">
        {error}
      </div>
    )
  }

  if (!battles || battles.length === 0) {
    return (
      <div className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-8 text-center text-sm text-[#B0BEC5]">
        Nenhuma batalha encontrada.
      </div>
    )
  }

  const visibleBattles = battles.slice(0, visibleCount)

  return (
    <div className="space-y-4">
      {visibleBattles.map((battle, index) => (
        <BattleItem key={`${battle.battleTime}-${index}`} battle={battle} playerTag={playerTag} />
      ))}

      {visibleCount < battles.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + 5)}
          className="w-full rounded-xl border border-[#243B53] bg-[#1A2B3C] px-4 py-2.5 text-sm font-medium text-[#B0BEC5] transition-colors hover:border-[#F0C040]/35 hover:text-white"
        >
          Ver mais batalhas ({battles.length - visibleCount} restantes)
        </button>
      )}

      {battles.length > 5 && visibleCount >= battles.length && (
        <button
          type="button"
          onClick={() => setVisibleCount(5)}
          className="w-full rounded-xl border border-[#243B53] bg-[#1A2B3C] px-4 py-2.5 text-sm font-medium text-[#B0BEC5] transition-colors hover:border-[#F0C040]/35 hover:text-white"
        >
          Mostrar menos
        </button>
      )}
    </div>
  )
}
