import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Cards } from './pages/Cards'
import { PlayerProfile } from './pages/PlayerProfile'
import { Favorites } from './pages/Favorites'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <Routes>
        {/* Rota pública - Home com busca de jogador */}
        <Route path="/" element={<Home />} />

        {/* Rota pública - Login/Cadastro */}
        <Route path="/login" element={<Login />} />

        {/* Rota pública - Cards (com hover para detalhes) */}
        <Route path="/cards" element={<Cards />} />

        {/* Rota pública - Perfil do jogador */}
        <Route path="/players/:tag" element={<PlayerProfile />} />

        {/* Rota protegida - Favoritos (requer login) */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* Fallback - 404 */}
        <Route
          path="*"
          element={
            <div className="container mx-auto px-4 py-8 text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-gray-600">Página não encontrada</p>
            </div>
          }
        />
      </Routes>
    </div>
  )
}

export default App