import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function Home() {
  const [tag, setTag] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (tag.trim()) {
      // Navega para o perfil do jogador (SPA navigation)
      const formattedTag = tag.startsWith('#') ? tag.slice(1) : tag
      navigate(`/players/${formattedTag}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao RoyaleDex</h1>
        <p className="text-gray-600 mb-8">
          Busque jogadores de Clash Royale, explore cartas e gerencie seus favoritos
        </p>

        {/* Busca de jogador */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Digite a tag do jogador (ex: #2PP ou 2PP)"
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Links rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/cards"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Explorar Cartas</h2>
            <p className="text-gray-600">
              Veja todas as cartas de Clash Royale com detalhes
            </p>
          </Link>

          <Link
            to="/favorites"
            className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">Meus Favoritos</h2>
            <p className="text-gray-600">Veja seus jogadores favoritos salvos</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
