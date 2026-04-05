import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Cards } from './pages/Cards'
import { PlayerProfile } from './pages/PlayerProfile'
import { Favorites } from './pages/Favorites'

function ScrollToTopOnRouteChange() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return null
}

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0D1B2A] text-white">
      <ScrollToTopOnRouteChange />
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Rota publica - Home com destaques */}
          <Route path="/" element={<Home />} />

          {/* Rota publica - Login/Cadastro */}
          <Route path="/login" element={<Login />} />

          {/* Rota publica - Cards */}
          <Route path="/cards" element={<Cards />} />

          {/* Rota publica - Perfil do jogador */}
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
              <section className="royale-page">
                <div className="royale-card p-10 text-center">
                  <h1 className="text-4xl font-bold">404</h1>
                  <p className="mt-3 text-rd-muted">Pagina nao encontrada.</p>
                </div>
              </section>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App