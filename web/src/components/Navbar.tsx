import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          RoyaleDex
        </Link>

        <div className="flex gap-4 items-center">
          <Link to="/cards" className="hover:text-blue-400">
            Cartas
          </Link>

          {user ? (
            <>
              <Link to="/favorites" className="hover:text-blue-400">
                Favoritos
              </Link>
              <span className="text-gray-400">{user.email}</span>
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
