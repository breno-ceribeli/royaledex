import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChartBar, History, Star } from 'lucide-react'
import { useCards } from '../hooks'
import { HomeCardDisplay } from '../components/HomeCardDisplay'
import type { Card } from '../types'

const DESKTOP_ROTATIONS = [-5, 3, -2, 4, -3, 2, 5, -4, 3, -2, 4, -3]
const DECORATIVE_CARD_COUNT = 12

const seededRandomFactory = (seed: number) => {
  let current = seed
  return () => {
    current = (current * 1664525 + 1013904223) % 4294967296
    return current / 4294967296
  }
}

const pickRandomCards = (cards: Card[], amount: number, seed: number) => {
  if (cards.length <= amount) {
    return cards
  }

  const shuffled = [...cards]
  const seededRandom = seededRandomFactory(seed)

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(seededRandom() * (index + 1))
    const temp = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = temp
  }

  return shuffled.slice(0, amount)
}

export function Home() {
  const { cards, loading, error } = useCards()
  const [randomSeed] = useState(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const seedArray = new Uint32Array(1)
      crypto.getRandomValues(seedArray)
      return seedArray[0] || 1
    }

    return 20260404
  })

  const decorativeCards = useMemo(
    () => pickRandomCards(cards, DECORATIVE_CARD_COUNT, randomSeed),
    [cards, randomSeed]
  )

  const mobileDecorativeCards = useMemo(() => {
    if (decorativeCards.length === 0) {
      return []
    }

    if (decorativeCards.length >= 8) {
      return decorativeCards
    }

    const expandedCards: Card[] = []
    while (expandedCards.length < 8) {
      expandedCards.push(...decorativeCards)
    }

    return expandedCards.slice(0, 8)
  }, [decorativeCards])

  const showCards = decorativeCards.length > 0

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute left-1/2 top-32 h-200 w-200 -translate-x-1/2 rounded-full bg-[#F0C040]/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-16 h-100 w-100 rounded-full bg-[#7B2FBE]/10 blur-[100px]" />

      <section className="relative py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
            Domine a <span className="text-gold-gradient">Arena</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-[#B0BEC5] md:text-xl">
            Estatísticas completas de jogadores, análise de batalhas e muito mais, tudo aqui para você, meu rei
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/cards" className="gold-button w-full sm:w-auto">
              Explorar cartas
            </Link>
            <Link
              to="/favorites"
              className="w-full rounded-xl border border-[#F0C040]/25 bg-[#1A2B3C] px-4 py-2.5 text-center text-sm font-semibold text-[#F0C040] transition-colors hover:border-[#F0C040]/50 hover:bg-[#243B53] sm:w-auto"
            >
              Abrir favoritos
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-16 pt-8 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-white md:mb-12 md:text-3xl">
            Explore as <span className="text-[#F0C040]">Cartas</span>
          </h2>

          {loading && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: DECORATIVE_CARD_COUNT }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 rounded-xl border border-[#243B53] bg-[#1A2B3C]/60"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-2xl rounded-xl border border-[#ef4444]/35 bg-[#2a1116] px-4 py-3 text-center text-sm text-[#fecaca]">
              Nao foi possivel carregar as cartas aleatorias agora: {error}
            </div>
          )}

          {!loading && showCards && (
            <>
              <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 pb-4 pt-3 scrollbar-hide touch-pan-x md:hidden">
                <div className="flex w-max snap-x snap-mandatory gap-4 pl-2">
                  {mobileDecorativeCards.map((card, index) => (
                    <HomeCardDisplay
                      key={`${card.id}-${index}`}
                      card={card}
                      size="md"
                      rotation={index % 2 === 0 ? -3 : 3}
                      className="shrink-0 snap-center shadow-lg shadow-[#F0C040]/10"
                    />
                  ))}
                </div>
              </div>

              <div className="hidden justify-items-center gap-6 md:grid md:grid-cols-4 lg:grid-cols-6">
                {decorativeCards.map((card, index) => (
                  <HomeCardDisplay
                    key={card.id}
                    card={card}
                    size="lg"
                    rotation={DESKTOP_ROTATIONS[index] || 0}
                    className="shadow-lg shadow-[#F0C040]/10 hover:z-10 hover:scale-105"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <article className="group rounded-2xl border border-[#243B53] bg-[#1A2B3C] p-6 transition-colors hover:border-[#F0C040]/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0C040]/10 transition-colors group-hover:bg-[#F0C040]/20">
                <ChartBar className="h-6 w-6 text-[#F0C040]" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Estatisticas detalhadas</h3>
              <p className="text-[#B0BEC5]">
                Analise vitorias, derrotas e indicadores de desempenho para acompanhar a evolucao do jogador.
              </p>
            </article>

            <article className="group rounded-2xl border border-[#243B53] bg-[#1A2B3C] p-6 transition-colors hover:border-[#F0C040]/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#7B2FBE]/10 transition-colors group-hover:bg-[#7B2FBE]/20">
                <History className="h-6 w-6 text-[#7B2FBE]" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Historico de batalhas</h3>
              <p className="text-[#B0BEC5]">
                Revise partidas recentes, decks utilizados e padroes de confronto para ajustar sua estrategia.
              </p>
            </article>

            <article className="group rounded-2xl border border-[#243B53] bg-[#1A2B3C] p-6 transition-colors hover:border-[#F0C040]/30">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10 transition-colors group-hover:bg-[#22C55E]/20">
                <Star className="h-6 w-6 text-[#22C55E]" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Favoritos</h3>
              <p className="text-[#B0BEC5]">
                Salve jogadores para monitorar rapidamente progresso, resultados e mudancas de deck.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
