import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks'
import { FavoritePlayerCard } from '../components/FavoritePlayerCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function Favorites() {
  const { favorites, loading, error, actionError, clearActionError } = useFavorites()

  if (loading) return <LoadingSpinner message="Carregando favoritos..." />
  if (error) return <ErrorMessage message={error} />

  return (
    <section className="royale-page space-y-7">
      <header className="royale-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-rd-primary-deep">Favorites</p>
            <h1 className="royale-title mt-2 text-4xl">Meus Jogadores Favoritos</h1>
            <p className="mt-2 text-sm text-rd-muted">
              Painel de acompanhamento rapido conectado ao backend e ao Firestore.
            </p>
          </div>
          <div className="rounded-xl border border-[rgba(240,192,64,0.18)] bg-rd-surface-low px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-rd-muted">Slots usados</p>
            <p className="royale-title text-3xl">{favorites.length} / 15</p>
          </div>
        </div>
      </header>

      {actionError && (
        <ErrorMessage message={actionError} onClose={clearActionError} />
      )}

      {favorites.length === 0 ? (
        <div className="royale-card p-12 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-rd-muted">Sem jogadores salvos</p>
          <h2 className="royale-title mt-3 text-3xl">Sua lista esta vazia</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-rd-muted">
            Abra um perfil de jogador e use o botao de favorito para salvar monitoramentos.
          </p>
          <Link to="/" className="gold-button mt-6 inline-flex">
            Buscar jogador
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((player) => (
            <FavoritePlayerCard key={player.tag} player={player} />
          ))}
        </div>
      )}
    </section>
  )
}

