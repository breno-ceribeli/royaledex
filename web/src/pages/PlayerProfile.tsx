import { useState } from 'react'
import { AlertCircle, Crown, Share2, Shield, Star, Trophy } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBattleLog, useBattleStats, useCards, useFavorites, usePlayerProfile } from '../hooks'
import { AnalysisTab } from '../components/player/tabs/AnalysisTab'
import { BattlesTab } from '../components/player/tabs/BattlesTab'
import { OverviewTab } from '../components/player/tabs/OverviewTab'
import { LoadingSpinner } from '../components/feedback/LoadingSpinner'
import { ErrorMessage } from '../components/feedback/ErrorMessage'
import { ErrorBoundary } from '../components/feedback/ErrorBoundary'
import { formatTag } from '../utils/formatters'

type ProfileTab = 'overview' | 'analysis' | 'battles'

export function PlayerProfile() {
  const { tag } = useParams<{ tag: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview')
  const [shareFeedback, setShareFeedback] = useState('')
  const normalizedTag = formatTag(tag || '')

  const { data: player, loading: playerLoading, error: playerError } = usePlayerProfile(normalizedTag)
  const { data: battles, loading: battlesLoading, error: battlesError } = useBattleLog(normalizedTag)
  const { data: stats, loading: statsLoading, error: statsError } = useBattleStats(normalizedTag)
  const { cards: allCards } = useCards()
  const {
    isFavorite,
    toggleFavorite,
    actionLoading,
    actionError,
    clearActionError,
    favorites,
  } = useFavorites()

  if (!normalizedTag) {
    return <ErrorMessage message="Tag de jogador inválida." />
  }

  if (playerLoading) return <LoadingSpinner message="Carregando perfil do jogador..." />
  if (playerError) return <ErrorMessage message={playerError} />
  if (!player) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#243B53] bg-[#1A2B3C] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#243B53]">
            <AlertCircle className="h-8 w-8 text-[#F0C040]" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Jogador não encontrado</h1>
          <p className="mb-6 text-sm text-[#B0BEC5]">Confira a tag e tente novamente.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-xl bg-[#F0C040] px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition-colors hover:bg-[#C9A033]"
          >
            Voltar para a Home
          </button>
        </div>
      </section>
    )
  }

  const handleToggleFavorite = async () => {
    await toggleFavorite(player.tag, player.name)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareFeedback('Link copiado!')
      window.setTimeout(() => setShareFeedback(''), 1800)
    } catch {
      setShareFeedback('Não foi possível copiar')
      window.setTimeout(() => setShareFeedback(''), 1800)
    }
  }

  const canAddFavorite = favorites.length < 15 || isFavorite(player.tag)
  const isFav = isFavorite(player.tag)

  return (
    <ErrorBoundary>
      <section className="min-h-screen py-8 md:py-12">
        <div className="mx-auto max-w-5xl space-y-6 px-4">
        {actionError && <ErrorMessage message={actionError} onClose={clearActionError} />}

          <header className="rounded-2xl border border-[#243B53] bg-[#1A2B3C] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#243B53] bg-[#243B53]/55 sm:h-20 sm:w-20">
                {player.currentFavouriteCard?.iconUrls?.medium ? (
                  <img
                    src={player.currentFavouriteCard.iconUrls.medium}
                    alt={player.currentFavouriteCard.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Shield className="h-8 w-8 text-[#B0BEC5]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">{player.name}</h1>
                <p className="font-mono text-sm text-[#B0BEC5]">#{formatTag(player.tag)}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0C040]/20 px-3 py-1 text-sm font-medium text-[#F0C040]">
                    <Trophy className="h-4 w-4" />
                    {player.trophies.toLocaleString('pt-BR')}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#7B2FBE]/20 px-3 py-1 text-sm font-medium text-[#C993F8]">
                    <Crown className="h-4 w-4" />
                    Nível {player.expLevel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3B82F6]/20 px-3 py-1 text-sm font-medium text-[#93C5FD]">
                    {player.arena?.name || 'Arena desconhecida'}
                  </span>
                </div>

                {player.clan && (
                  <p className="mt-3 text-sm text-[#B0BEC5]">
                    {player.clan.name} ({player.clan.tag})
                  </p>
                )}
              </div>

              <div className="flex shrink-0 gap-2 sm:flex-col">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  disabled={actionLoading || (!canAddFavorite && !isFav)}
                  title={
                    !canAddFavorite && !isFav
                      ? 'Limite de 15 favoritos atingido'
                      : isFav
                        ? 'Remover dos favoritos'
                        : 'Adicionar aos favoritos'
                  }
                  className={`inline-flex min-w-36 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    isFav
                      ? 'border-[#F0C040]/55 bg-[#F0C040]/20 text-[#F0C040] hover:bg-[#F0C040]/30'
                      : 'border-[#243B53] bg-transparent text-[#B0BEC5] hover:bg-[#243B53] hover:text-white'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  <Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                  {actionLoading ? 'Aguarde...' : isFav ? 'Salvo' : 'Salvar'}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex min-w-36 items-center justify-center gap-2 rounded-xl border border-[#243B53] bg-transparent px-4 py-2 text-sm font-semibold text-[#B0BEC5] transition-colors hover:bg-[#243B53] hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </button>
              </div>
            </div>

            {shareFeedback && <p className="mt-2 text-sm text-[#B0BEC5]">{shareFeedback}</p>}

            {!canAddFavorite && !isFav && (
              <p className="mt-2 text-sm text-rose-300">Limite de 15 favoritos atingido.</p>
            )}
          </header>

          <div className="rounded-xl border border-[#243B53] bg-[#1A2B3C] p-1">
            <div className="grid h-11 grid-cols-3 gap-1">
              {[
                { value: 'overview', label: 'Visão Geral' },
                { value: 'analysis', label: 'Análise' },
                { value: 'battles', label: 'Batalhas' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value as ProfileTab)}
                  className={[
                    'rounded-lg px-3 text-sm font-medium transition-colors',
                    activeTab === tab.value
                      ? 'bg-[#F0C040] text-[#0D1B2A]'
                      : 'text-[#B0BEC5] hover:bg-[#243B53] hover:text-white',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {activeTab === 'overview' && (
            <ErrorBoundary>
              <OverviewTab player={player} />
            </ErrorBoundary>
          )}

          {activeTab === 'analysis' && (
            <ErrorBoundary>
              <AnalysisTab
                stats={stats}
                loading={statsLoading}
                error={statsError}
                battles={battles}
                battlesLoading={battlesLoading}
                allCards={allCards}
              />
            </ErrorBoundary>
          )}

          {activeTab === 'battles' && (
            <ErrorBoundary>
              <BattlesTab battles={battles} loading={battlesLoading} error={battlesError} playerTag={player.tag} />
            </ErrorBoundary>
          )}
        </div>
      </section>
    </ErrorBoundary>
  )
}
