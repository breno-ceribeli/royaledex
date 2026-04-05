import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { BattleLog, BattleLogStats, Card } from '../../../types'

interface AnalysisTabProps {
  stats: BattleLogStats | null
  loading: boolean
  error: string
  battles: BattleLog
  battlesLoading: boolean
  allCards: Card[]
}

const toLocaleNumber = (value: number | undefined) => (value ?? 0).toLocaleString('pt-BR')
const MAX_BATTLES = 30

const normalizePercentage = (value: number | undefined) => {
  const numeric = value ?? 0
  return numeric <= 1 ? numeric * 100 : numeric
}

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const getCompetitiveType = (battle: BattleLog[number]) => {
  const normalizedType = normalizeText(battle.type || '')

  if (normalizedType === 'pvp') {
    return 'Ladder'
  }

  if (normalizedType === 'pathoflegend') {
    return 'Path of Legends'
  }

  return null
}

const getBattleResult = (battle: BattleLog[number]) => {
  const playerData = battle.team?.[0]
  const opponentData = battle.opponent?.[0]

  if (!playerData || !opponentData) {
    return 'draw'
  }

  if (playerData.crowns > opponentData.crowns) {
    return 'win'
  }

  if (playerData.crowns < opponentData.crowns) {
    return 'loss'
  }

  return 'draw'
}

export function AnalysisTab({
  stats,
  loading,
  error,
  battles,
  battlesLoading,
  allCards,
}: AnalysisTabProps) {
  const competitiveBattles = useMemo(() => {
    return battles.filter((battle) => getCompetitiveType(battle) !== null)
  }, [battles])

  const recentBattles = useMemo(() => competitiveBattles.slice(0, MAX_BATTLES), [competitiveBattles])

  const chartBattles = useMemo(() => {
    return [...recentBattles].reverse()
  }, [recentBattles])

  const performanceData = useMemo(() => {
    return chartBattles.map((battle, index) => {
      const battlesUntilNow = chartBattles.slice(0, index + 1)
      const wins = battlesUntilNow.filter((entry) => getBattleResult(entry) === 'win').length
      const rate = (wins / (index + 1)) * 100

      return {
        battle: index + 1,
        winRate: Number(rate.toFixed(1)),
        isWin: getBattleResult(battle) === 'win' ? 1 : 0,
      }
    })
  }, [chartBattles])

  const battleTypeStats = useMemo(() => {
    const grouped = new Map<string, { type: string; wins: number; losses: number }>()

    for (const battle of recentBattles) {
      const type = getCompetitiveType(battle)
      if (!type) {
        continue
      }

      if (!grouped.has(type)) {
        grouped.set(type, { type, wins: 0, losses: 0 })
      }

      const result = getBattleResult(battle)
      const current = grouped.get(type)
      if (!current) continue

      if (result === 'win') {
        current.wins += 1
      } else if (result === 'loss') {
        current.losses += 1
      }
    }

    return Array.from(grouped.values())
  }, [recentBattles])

  const cardMap = useMemo(() => {
    const map = new Map<string, Card>()
    for (const card of allCards) {
      map.set(normalizeText(card.name), card)
    }
    return map
  }, [allCards])

  if (loading) {
    return (
      <div className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-8 text-center text-sm text-[#B0BEC5]">
        Carregando análise...
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

  if (!stats) {
    return (
      <div className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-8 text-center text-sm text-[#B0BEC5]">
        Nenhuma estatística disponível.
      </div>
    )
  }

  const winRate = normalizePercentage(stats.winRate)
  const circleRadius = 70
  const circleLength = 2 * Math.PI * circleRadius
  const circleProgress = Math.max(0, Math.min(100, winRate))

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Desempenho</h3>

        <div className="flex flex-col items-center gap-4">
          <div className="relative h-40 w-40">
            <svg className="h-full w-full -rotate-90">
              <circle cx="80" cy="80" r={circleRadius} fill="none" stroke="#243B53" strokeWidth="12" />
              <circle
                cx="80"
                cy="80"
                r={circleRadius}
                fill="none"
                stroke="#F0C040"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(circleProgress / 100) * circleLength} ${circleLength}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{circleProgress.toFixed(1)}%</span>
              <span className="text-sm text-[#B0BEC5]">Taxa de vitória</span>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg border border-[#243B53] bg-[#243B53]/35 p-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[#B0BEC5]">Total</p>
              <p className="mt-1 text-xl font-bold text-white">{toLocaleNumber(stats.totalBattles)}</p>
            </div>
            <div className="rounded-lg border border-[rgba(34,197,94,0.34)] bg-[rgba(34,197,94,0.12)] p-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-200">Vitórias</p>
              <p className="mt-1 text-xl font-bold text-emerald-100">{toLocaleNumber(stats.wins)}</p>
            </div>
            <div className="rounded-lg border border-[rgba(239,68,68,0.34)] bg-[rgba(239,68,68,0.12)] p-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-rose-200">Derrotas</p>
              <p className="mt-1 text-xl font-bold text-rose-100">{toLocaleNumber(stats.losses)}</p>
            </div>
            <div className="rounded-lg border border-[rgba(240,192,64,0.34)] bg-[rgba(240,192,64,0.12)] p-3 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[#F0C040]">Empates</p>
              <p className="mt-1 text-xl font-bold text-[#F0C040]">{toLocaleNumber(stats.draws)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-6">
        <h3 className="mb-3 text-lg font-bold text-white">Indicadores</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between border-b border-[#243B53] py-2">
            <span className="text-[#B0BEC5]">Batalhas Ladder</span>
            <strong className="text-white">{toLocaleNumber(stats.pvpBattles)}</strong>
          </div>
          <div className="flex items-center justify-between border-b border-[#243B53] py-2">
            <span className="text-[#B0BEC5]">Batalhas Path of Legends</span>
            <strong className="text-white">{toLocaleNumber(stats.pathOfLegendBattles)}</strong>
          </div>
          <div className="flex items-center justify-between border-b border-[#243B53] py-2">
            <span className="text-[#B0BEC5]">Média de elixir desperdiçado</span>
            <strong className="text-white">{(stats.avgElixirLeaked ?? 0).toFixed(1)}</strong>
          </div>
          {stats.avgTrophyChange !== null && (
            <div className="flex items-center justify-between border-b border-[#243B53] py-2">
              <span className="text-[#B0BEC5]">Média de troféus por partida</span>
              <strong className={stats.avgTrophyChange >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                {stats.avgTrophyChange >= 0 ? '+' : ''}
                {stats.avgTrophyChange}
              </strong>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Vitórias vs Derrotas por Tipo</h3>

        {battlesLoading ? (
          <p className="text-sm text-[#B0BEC5]">Carregando histórico...</p>
        ) : battleTypeStats.length > 0 ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={battleTypeStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#243B53" />
                <XAxis type="number" stroke="#B0BEC5" />
                <YAxis dataKey="type" type="category" width={120} stroke="#B0BEC5" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A2B3C', border: '1px solid #243B53', borderRadius: '8px' }}
                  labelStyle={{ color: '#FFFFFF' }}
                />
                <Bar dataKey="wins" name="Vitórias" fill="#22C55E" radius={[0, 4, 4, 0]} />
                <Bar dataKey="losses" name="Derrotas" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-[#B0BEC5]">Sem batalhas recentes para comparar tipos.</p>
        )}
      </section>

      <section className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Desempenho nas Últimas Batalhas Competitivas</h3>

        {battlesLoading ? (
          <p className="text-sm text-[#B0BEC5]">Carregando histórico...</p>
        ) : performanceData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243B53" />
                  <XAxis dataKey="battle" stroke="#B0BEC5" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis stroke="#B0BEC5" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A2B3C', border: '1px solid #243B53', borderRadius: '8px' }}
                    labelStyle={{ color: '#FFFFFF' }}
                    formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, 'Taxa de vitória']}
                  />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke="#F0C040"
                    strokeWidth={2}
                    dot={{ fill: '#F0C040', strokeWidth: 0, r: performanceData.length > 20 ? 2 : 4 }}
                    activeDot={{ r: 6, fill: '#F0C040' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap gap-1">
              {performanceData.map((point, index) => (
                <div
                  key={index}
                  className={`h-3 w-3 rounded-full ${point.isWin ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}
                  title={point.isWin ? 'Vitória' : 'Derrota/Empate'}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-[#B0BEC5]">Sem batalhas competitivas recentes para o gráfico.</p>
        )}
      </section>

      <section className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-6">
        <h3 className="mb-2 text-lg font-bold text-white">Cartas que mais te punem</h3>
        <p className="mb-4 text-sm text-[#B0BEC5]">Top cartas mais frequentes nas suas derrotas.</p>

        {stats.mostLostAgainstCards && stats.mostLostAgainstCards.length > 0 ? (
          <div className="space-y-2">
            {stats.mostLostAgainstCards.slice(0, 10).map((card, index) => (
              <div
                key={`${card.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-[#243B53] bg-[#243B53]/30 px-3 py-2 text-sm"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {cardMap.get(normalizeText(card.name))?.iconUrls?.medium ? (
                    <img
                      src={cardMap.get(normalizeText(card.name))?.iconUrls?.medium}
                      alt={card.name}
                      className="h-10 w-10 rounded-md bg-[#1A2B3C] object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#1A2B3C] text-xs font-bold text-[#F0C040]">
                      {card.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate text-white">{card.name}</span>
                </div>

                <div className="text-right text-[#B0BEC5]">
                  <p>{card.count} derrotas</p>
                  <p className="text-xs">{normalizePercentage(card.percentage).toFixed(1)}% das partidas</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#B0BEC5]">Sem dados suficientes no período.</p>
        )}
      </section>
    </div>
  )
}
