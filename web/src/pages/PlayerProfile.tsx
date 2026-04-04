import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlayerProfile, useBattleLog, useBattleStats, useFavorites } from '../hooks'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { BattleItem } from '../components/BattleItem'
import { formatTag } from '../utils/formatters'

const toLocaleNumber = (value: number | undefined) => (value ?? 0).toLocaleString('pt-BR')

const formatPercentage = (value: number | undefined) => {
  const numeric = value ?? 0
  const normalized = numeric <= 1 ? numeric * 100 : numeric
  return `${normalized.toFixed(1)}%`
}

export function PlayerProfile() {
  const { tag } = useParams<{ tag: string }>()
  const [showAllBattles, setShowAllBattles] = useState(false)
  const normalizedTag = formatTag(tag || '')

  const { data: player, loading: playerLoading, error: playerError } = usePlayerProfile(normalizedTag)
  const { data: battles, loading: battlesLoading, error: battlesError } = useBattleLog(normalizedTag)
  const { data: stats, loading: statsLoading, error: statsError } = useBattleStats(normalizedTag)
  const {
    isFavorite,
    toggleFavorite,
    actionLoading,
    actionError,
    clearActionError,
    favorites,
  } = useFavorites()

  if (!normalizedTag) {
    return <ErrorMessage message="Tag de jogador invalida." />
  }

  if (playerLoading) return <LoadingSpinner message="Carregando perfil do jogador..." />
  if (playerError) return <ErrorMessage message={playerError} />
  if (!player) return <p className="py-10 text-center text-sm text-rd-muted">Jogador nao encontrado.</p>

  const handleToggleFavorite = async () => {
    await toggleFavorite(player.tag, player.name)
  }

  const canAddFavorite = favorites.length < 15 || isFavorite(player.tag)
  const isFav = isFavorite(player.tag)
  const visibleBattles = battles?.slice(0, showAllBattles ? battles.length : 5) || []

  const profileStats = [
    { label: 'Trofeus', value: player.trophies },
    { label: 'Melhor marca', value: player.bestTrophies },
    { label: 'Vitorias', value: player.wins },
    { label: 'Derrotas', value: player.losses },
    { label: 'Nivel', value: player.expLevel },
    { label: 'Batalhas', value: player.battleCount },
    { label: '3 coroas', value: player.threeCrownWins },
    { label: 'Star points', value: player.starPoints },
  ]

  return (
    <ErrorBoundary>
      <section className="royale-page space-y-6">
        {actionError && <ErrorMessage message={actionError} onClose={clearActionError} />}

        <header className="royale-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-rd-primary-deep">Perfil</p>
              <h1 className="royale-title mt-2 text-4xl">{player.name}</h1>
              <p className="mt-2 font-mono text-sm text-rd-primary">#{formatTag(player.tag)}</p>
              <p className="mt-3 text-sm text-rd-muted">
                {player.clan ? `${player.clan.name} (${player.clan.tag})` : 'Sem cla atualmente'}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
              <button
                onClick={handleToggleFavorite}
                disabled={actionLoading || (!canAddFavorite && !isFav)}
                title={
                  !canAddFavorite && !isFav
                    ? 'Limite de 15 favoritos atingido'
                    : isFav
                      ? 'Remover dos favoritos'
                      : 'Adicionar aos favoritos'
                }
                className={`inline-flex w-full min-w-48 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors sm:w-auto ${
                  isFav
                    ? 'bg-[rgba(240,192,64,0.2)] text-rd-primary-soft border border-[rgba(240,192,64,0.42)] hover:bg-[rgba(240,192,64,0.28)]'
                    : 'gold-button'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <span className="material-symbols-rounded text-lg">{actionLoading ? 'hourglass_top' : isFav ? 'star' : 'star_outline'}</span>
                {isFav ? 'Favoritado' : 'Favoritar'}
              </button>
              {!canAddFavorite && !isFav && (
                <p className="text-xs text-[#ff8f98]">Limite de 15 favoritos atingido.</p>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {profileStats.map((stat) => (
            <div key={stat.label} className="royale-card p-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-rd-muted">{stat.label}</p>
              <p className="royale-title mt-2 text-2xl">{toLocaleNumber(stat.value)}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="royale-card p-5">
            <h2 className="royale-title text-2xl">Arena Atual</h2>
            <p className="mt-2 text-sm text-rd-main">{player.arena?.name || 'Desconhecida'}</p>
            {player.legacyTrophyRoadHighScore && (
              <p className="mt-3 text-xs text-rd-muted">
                Recorde antigo: {toLocaleNumber(player.legacyTrophyRoadHighScore)} trofeus
              </p>
            )}
          </div>

          {player.currentFavouriteCard && (
            <div className="royale-card p-5">
              <h2 className="royale-title text-2xl">Carta Favorita</h2>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={player.currentFavouriteCard.iconUrls?.medium} 
                  alt={player.currentFavouriteCard.name}
                  className="h-16 w-16 rounded"
                />
                <div>
                  <p className="text-sm font-semibold text-rd-main">{player.currentFavouriteCard.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-rd-muted">{player.currentFavouriteCard.rarity}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {(player.currentPathOfLegendSeasonResult || player.bestPathOfLegendSeasonResult) && (
          <div className="royale-card p-5">
            <h2 className="royale-title text-2xl">Path of Legend</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {player.currentPathOfLegendSeasonResult && (
                <div className="rounded-xl border border-[rgba(240,192,64,0.15)] bg-[rgba(20,31,67,0.65)] p-4 text-center">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-rd-muted">Temporada atual</h3>
                  <p className="royale-title mt-2 text-xl text-rd-primary">
                    Liga {player.currentPathOfLegendSeasonResult.leagueNumber ?? 0}
                  </p>
                  <p className="text-sm text-rd-main">
                    {toLocaleNumber(player.currentPathOfLegendSeasonResult.trophies)} trofeus
                  </p>
                  {player.currentPathOfLegendSeasonResult.rank && (
                    <p className="mt-1 text-xs text-rd-muted">Rank: #{player.currentPathOfLegendSeasonResult.rank}</p>
                  )}
                </div>
              )}

              {player.lastPathOfLegendSeasonResult && (
                <div className="rounded-xl border border-[rgba(240,192,64,0.15)] bg-[rgba(17,25,53,0.55)] p-4 text-center">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-rd-muted">Ultima temporada</h3>
                  <p className="royale-title mt-2 text-xl">
                    Liga {player.lastPathOfLegendSeasonResult.leagueNumber ?? 0}
                  </p>
                  <p className="text-sm text-rd-main">
                    {toLocaleNumber(player.lastPathOfLegendSeasonResult.trophies)} trofeus
                  </p>
                </div>
              )}

              {player.bestPathOfLegendSeasonResult && (
                <div className="rounded-xl border border-[rgba(240,192,64,0.28)] bg-[rgba(36,25,7,0.55)] p-4 text-center">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-rd-muted">Melhor temporada</h3>
                  <p className="royale-title mt-2 text-xl text-rd-primary-soft">
                    Liga {player.bestPathOfLegendSeasonResult.leagueNumber ?? 0}
                  </p>
                  <p className="text-sm text-rd-main">
                    {toLocaleNumber(player.bestPathOfLegendSeasonResult.trophies)} trofeus
                  </p>
                  {player.bestPathOfLegendSeasonResult.rank && (
                    <p className="mt-1 text-xs text-rd-muted">Rank: #{player.bestPathOfLegendSeasonResult.rank}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="royale-card p-5">
            <h2 className="royale-title text-2xl">Doacoes</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-rd-main">
                <span>Doacoes feitas</span>
                <strong>{toLocaleNumber(player.donations)}</strong>
              </div>
              <div className="flex items-center justify-between text-rd-main">
                <span>Doacoes recebidas</span>
                <strong>{toLocaleNumber(player.donationsReceived)}</strong>
              </div>
              <div className="flex items-center justify-between border-t border-[rgba(240,192,64,0.16)] pt-2 text-rd-main">
                <span>Total historico</span>
                <strong>{toLocaleNumber(player.totalDonations)}</strong>
              </div>
            </div>
          </div>

          <div className="royale-card p-5">
            <h2 className="royale-title text-2xl">Desafios e Torneios</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-rd-main">
                <span>Cartas em desafios</span>
                <strong>{toLocaleNumber(player.challengeCardsWon)}</strong>
              </div>
              <div className="flex items-center justify-between text-rd-main">
                <span>Max de vitorias seguidas</span>
                <strong>{toLocaleNumber(player.challengeMaxWins)}</strong>
              </div>
              <div className="flex items-center justify-between text-rd-main">
                <span>Cartas em torneios</span>
                <strong>{toLocaleNumber(player.tournamentCardsWon)}</strong>
              </div>
              <div className="flex items-center justify-between text-rd-main">
                <span>Batalhas em torneios</span>
                <strong>{toLocaleNumber(player.tournamentBattleCount)}</strong>
              </div>
            </div>
          </div>
        </div>

        {player.warDayWins > 0 && (
          <div className="royale-card p-5">
            <h2 className="royale-title text-2xl">Guerra de Clas</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rd-muted">Vitorias em war days</p>
                <p className="royale-title mt-1 text-2xl">{toLocaleNumber(player.warDayWins)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rd-muted">Cartas coletadas</p>
                <p className="royale-title mt-1 text-2xl">{toLocaleNumber(player.clanCardsCollected)}</p>
              </div>
            </div>
          </div>
        )}

        {player.clan && (
          <div className="royale-card p-5">
            <h2 className="royale-title text-2xl">Cla</h2>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xl font-semibold text-rd-main">{player.clan.name}</p>
                <p className="font-mono text-sm text-rd-muted">{player.clan.tag}</p>
              </div>
              {player.clan.badgeId && (
                <div className="text-xs text-rd-muted">Badge ID: {player.clan.badgeId}</div>
              )}
            </div>
          </div>
        )}

        {player.currentDeck && player.currentDeck.length > 0 && (
          <div className="royale-card p-5">
            <h2 className="royale-title text-2xl">Deck Atual</h2>
            <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-8">
              {player.currentDeck.map((card) => (
                <div key={card.id} className="text-center">
                  <img src={card.iconUrls?.medium} alt={card.name} className="w-full rounded-lg" />
                  <p className="mt-1 text-xs text-rd-muted">Nv. {card.level}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <ErrorBoundary>
          {statsLoading ? (
            <LoadingSpinner message="Carregando estatísticas..." />
          ) : statsError ? (
            <div className="royale-card p-5">
              <h2 className="royale-title text-2xl">Estatisticas de Batalhas</h2>
              <p className="py-4 text-center text-sm text-rd-muted">{statsError}</p>
            </div>
          ) : stats ? (
            <div className="royale-card p-5">
              <h2 className="royale-title text-2xl">Estatisticas de Batalhas</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-[rgba(240,192,64,0.14)] bg-[rgba(17,25,53,0.58)] p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-rd-muted">Total</p>
                  <p className="royale-title mt-1 text-2xl">{toLocaleNumber(stats.totalBattles)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(57,176,122,0.3)] bg-[rgba(57,176,122,0.14)] p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Vitorias</p>
                  <p className="royale-title mt-1 text-2xl text-emerald-100">{toLocaleNumber(stats.wins)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(237,89,102,0.36)] bg-[rgba(237,89,102,0.14)] p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-rose-200">Derrotas</p>
                  <p className="royale-title mt-1 text-2xl text-rose-100">{toLocaleNumber(stats.losses)}</p>
                </div>
                <div className="rounded-xl border border-[rgba(240,192,64,0.32)] bg-[rgba(240,192,64,0.14)] p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.18em] text-rd-primary-soft">Empates</p>
                  <p className="royale-title mt-1 text-2xl text-rd-primary-soft">{toLocaleNumber(stats.draws)}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-[rgba(240,192,64,0.14)] py-2">
                  <span className="text-rd-muted">Taxa de vitoria</span>
                  <strong className="text-rd-main">{formatPercentage(stats.winRate)}</strong>
                </div>
                {stats.avgTrophyChange !== null && (
                  <div className="flex items-center justify-between border-b border-[rgba(240,192,64,0.14)] py-2">
                    <span className="text-rd-muted">Media de trofeus por partida</span>
                    <strong className={`${stats.avgTrophyChange > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {stats.avgTrophyChange > 0 ? '+' : ''}{stats.avgTrophyChange}
                    </strong>
                  </div>
                )}
                <div className="flex items-center justify-between border-b border-[rgba(240,192,64,0.14)] py-2">
                  <span className="text-rd-muted">Media de elixir desperdicado</span>
                  <strong className="text-rd-main">{(stats.avgElixirLeaked ?? 0).toFixed(1)}</strong>
                </div>
                <div className="flex items-center justify-between border-b border-[rgba(240,192,64,0.14)] py-2">
                  <span className="text-rd-muted">Batalhas PvP</span>
                  <strong className="text-rd-main">{toLocaleNumber(stats.pvpBattles)}</strong>
                </div>
                <div className="flex items-center justify-between border-b border-[rgba(240,192,64,0.14)] py-2">
                  <span className="text-rd-muted">Batalhas Path of Legend</span>
                  <strong className="text-rd-main">{toLocaleNumber(stats.pathOfLegendBattles)}</strong>
                </div>
              </div>

              {stats.mostLostAgainstCards && stats.mostLostAgainstCards.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-[0.2em] text-rd-muted">Cartas problematicas</h3>
                  <div className="mt-2 space-y-2">
                    {stats.mostLostAgainstCards.slice(0, 10).map((card, index) => (
                      <div
                        key={`${card.name}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-[rgba(240,192,64,0.14)] bg-[rgba(17,25,53,0.58)] px-3 py-2 text-sm"
                      >
                        <span className="text-rd-main">{card.name}</span>
                        <span className="text-rd-muted">
                          {card.count} derrotas ({formatPercentage(card.percentage)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </ErrorBoundary>

        <ErrorBoundary>
          {battlesLoading ? (
            <LoadingSpinner message="Carregando batalhas..." />
          ) : battlesError ? (
            <div className="royale-card p-5">
              <h2 className="royale-title text-2xl">Historico de Batalhas</h2>
              <p className="py-4 text-center text-sm text-rd-muted">{battlesError}</p>
            </div>
          ) : battles && battles.length > 0 ? (
            <div className="royale-card p-5">
              <h2 className="royale-title text-2xl">
                Histórico de Batalhas ({battles.length})
              </h2>
              <div className="mt-4 space-y-3">
                {visibleBattles.map((battle, index) => (
                  <BattleItem
                    key={`${battle.battleTime}-${index}`}
                    battle={battle}
                    playerTag={player.tag}
                  />
                ))}
              </div>

              {battles.length > 5 && (
                <button
                  onClick={() => setShowAllBattles(!showAllBattles)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(240,192,64,0.2)] bg-[rgba(17,25,53,0.62)] px-4 py-2 text-sm text-rd-main transition-colors hover:bg-[rgba(25,35,74,0.78)]"
                >
                  <span className="material-symbols-rounded text-base">
                    {showAllBattles ? 'expand_less' : 'expand_more'}
                  </span>
                  {showAllBattles ? 'Mostrar menos' : `Mostrar todas (${battles.length})`}
                </button>
              )}
            </div>
          ) : (
            <div className="royale-card p-5">
              <h2 className="royale-title text-2xl">Historico de Batalhas</h2>
              <p className="py-4 text-center text-sm text-rd-muted">Nenhuma batalha encontrada.</p>
            </div>
          )}
        </ErrorBoundary>
      </section>
    </ErrorBoundary>
  )
}
