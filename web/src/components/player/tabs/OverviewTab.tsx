import { Crown, Gift, Shield, Swords, Target, Trophy, Users } from 'lucide-react'
import type { PlayerProfile } from '../../../types'

interface OverviewTabProps {
  player: PlayerProfile
}

const toLocaleNumber = (value: number | undefined) => (value ?? 0).toLocaleString('pt-BR')

export function OverviewTab({ player }: OverviewTabProps) {
  const stats = [
    { label: 'Troféus atuais', value: toLocaleNumber(player.trophies), icon: Trophy, color: 'text-[#F0C040]' },
    { label: 'Melhor marca', value: toLocaleNumber(player.bestTrophies), icon: Crown, color: 'text-[#F0C040]' },
    { label: 'Vitórias', value: toLocaleNumber(player.wins), icon: Target, color: 'text-[#22C55E]' },
    { label: 'Derrotas', value: toLocaleNumber(player.losses), icon: Swords, color: 'text-[#EF4444]' },
    { label: 'Batalhas', value: toLocaleNumber(player.battleCount), icon: Swords, color: 'text-[#3B82F6]' },
    { label: 'Vitórias 3 coroas', value: toLocaleNumber(player.threeCrownWins), icon: Crown, color: 'text-[#7B2FBE]' },
    { label: 'Doações feitas', value: toLocaleNumber(player.donations), icon: Gift, color: 'text-[#22C55E]' },
    { label: 'Doações recebidas', value: toLocaleNumber(player.donationsReceived), icon: Gift, color: 'text-[#3B82F6]' },
  ]

  const deckCards = player.currentDeck || []
  const averageElixir =
    deckCards.length > 0
      ? deckCards.reduce((total, card) => total + (card.elixirCost || 0), 0) / deckCards.length
      : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <article
              key={stat.label}
              className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-4 transition-colors hover:border-[#F0C040]/30"
            >
              <Icon className={`mb-2 h-5 w-5 ${stat.color}`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-[#B0BEC5]">{stat.label}</p>
            </article>
          )
        })}
      </div>

      {player.clan && (
        <section className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#243B53]">
              <Shield className="h-6 w-6 text-[#B0BEC5]" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{player.clan.name}</p>
              <p className="text-sm text-[#B0BEC5]">{player.clan.tag}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[#B0BEC5]">
              <Users className="h-4 w-4" />
              <span className="text-sm">Clã</span>
            </div>
          </div>
        </section>
      )}

      {deckCards.length > 0 && (
        <section className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">Deck Atual</h3>
            <span className="rounded-full border border-[#7B2FBE]/50 bg-[#7B2FBE]/20 px-3 py-1 text-xs font-semibold text-[#E2C1FF]">
              Elixir médio: {averageElixir.toFixed(1)}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
            {deckCards.map((card) => (
              <div key={card.id} className="relative text-center">
                <div className="absolute -left-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-[#5E2391] bg-[#7B2FBE] shadow-md">
                  <span className="text-[10px] font-bold text-white">{card.elixirCost}</span>
                </div>

                <div className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-[#243B53] p-1">
                  <img src={card.iconUrls?.medium} alt={card.name} className="h-full w-full object-contain" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
