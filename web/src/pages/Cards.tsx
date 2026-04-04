import { useMemo, useState } from 'react'
import { useCards } from '../hooks'
import { CardItem } from '../components/CardItem'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'

export function Cards() {
  const { cards, supportItems, loading, error } = useCards()
  const [search, setSearch] = useState('')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [elixirFilter, setElixirFilter] = useState('all')

  const rarities = useMemo(() => {
    const all = Array.from(new Set(cards.map((card) => card.rarity))).sort((a, b) => a.localeCompare(b))
    return ['all', ...all]
  }, [cards])

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch = card.name.toLowerCase().includes(search.trim().toLowerCase())
      const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter
      const matchesElixir = elixirFilter === 'all' || String(card.elixirCost) === elixirFilter
      return matchesSearch && matchesRarity && matchesElixir
    })
  }, [cards, search, rarityFilter, elixirFilter])

  if (loading) return <LoadingSpinner message="Carregando cartas..." />
  if (error) return <ErrorMessage message={error} />

  return (
    <section className="royale-page space-y-8">
      <header className="royale-card p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-rd-primary-deep">Collection</p>
        <h1 className="royale-title mt-3 text-4xl">Cartas do Clash Royale</h1>
        <p className="mt-2 text-sm text-rd-muted">
          Filtre por nome, custo de elixir e raridade para explorar a colecao no estilo archive.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-bold uppercase tracking-[0.2em] text-rd-muted">
            Buscar
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome da carta"
              className="input-royal mt-2"
            />
          </label>

          <label className="text-xs font-bold uppercase tracking-[0.2em] text-rd-muted">
            Raridade
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="input-royal mt-2"
            >
              {rarities.map((rarity) => (
                <option key={rarity} value={rarity} className="bg-rd-surface-low">
                  {rarity === 'all' ? 'Todas' : rarity}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-bold uppercase tracking-[0.2em] text-rd-muted">
            Elixir
            <select
              value={elixirFilter}
              onChange={(e) => setElixirFilter(e.target.value)}
              className="input-royal mt-2"
            >
              <option value="all" className="bg-rd-surface-low">Todos</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                <option key={value} value={value} className="bg-rd-surface-low">
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="royale-title text-2xl">Cartas Normais</h2>
          <span className="chip chip-win">{filteredCards.length} resultados</span>
        </div>

        {filteredCards.length === 0 ? (
          <div className="royale-card p-8 text-center">
            <p className="text-sm text-rd-muted">Nenhuma carta encontrada com os filtros atuais.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {filteredCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>

      {supportItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="royale-title text-2xl">Itens de Suporte ({supportItems.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
            {supportItems.map((item) => (
              <article
                key={item.id}
                className="group rounded-xl border border-[rgba(240,192,64,0.12)] bg-rd-surface-low p-3 transition-transform hover:-translate-y-1"
              >
                <img src={item.iconUrls.medium} alt={item.name} className="w-full rounded-lg" />
                <p className="mt-2 truncate text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-xs text-rd-muted">{item.rarity}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  )
}

