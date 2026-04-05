import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Crown,
  Home,
  Layers,
  LogOut,
  Menu,
  Search,
  Star,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

type NavLinkItem = {
  href: string
  label: string
  icon: typeof Home
}

const navLinks: NavLinkItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/cards', label: 'Cartas', icon: Layers },
  { href: '/favorites', label: 'Favoritos', icon: Star },
]

const sanitizeTagInput = (value: string) => {
  const withoutSpaces = value.toUpperCase().replace(/\s+/g, '')
  const onlyAllowedChars = withoutSpaces.replace(/[^A-Z0-9#]/g, '')
  const hasHash = onlyAllowedChars.includes('#')
  const alphanumeric = onlyAllowedChars.replace(/#/g, '')

  return hasHash ? `#${alphanumeric}` : alphanumeric
}

const normalizeTag = (value: string) => value.trim().replace(/^#+/, '').toUpperCase()

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isActive = (href: string) => location.pathname === href

  const closePanels = () => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedTag = normalizeTag(searchQuery)

    if (!normalizedTag) {
      return
    }

    closePanels()
    setSearchQuery('')
    navigate(`/players/${encodeURIComponent(normalizedTag)}`)
  }

  const handleLogout = async () => {
    await logout()
    closePanels()
  }

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#F0C040]/20 bg-[#0D1B2A]/90 navbar-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <Link to="/" onClick={closePanels} className="flex shrink-0 items-center gap-2">
            <Crown className="h-7 w-7 text-[#F0C040]" />
            <span className="hidden text-xl font-bold text-white sm:block">
              Royale<span className="text-[#F0C040]">Dex</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden max-w-md flex-1 md:flex">
            <label className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0BEC5]" />
              <input
                type="text"
                placeholder="Buscar jogador por tag... (ex: #ABC123)"
                value={searchQuery}
                onChange={(event) => setSearchQuery(sanitizeTagInput(event.target.value))}
                className="w-full rounded-xl border border-[#243B53] bg-[#1A2B3C] py-2 pl-10 pr-3 text-sm text-white outline-none transition-colors focus:border-[#F0C040]"
              />
            </label>
          </form>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href) ? 'text-[#F0C040]' : 'text-[#B0BEC5] hover:text-[#F0C040]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden max-w-44 truncate text-sm text-[#B0BEC5] lg:block">
                  {user.displayName ||user.email || 'Usuário'}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#243B53] bg-[#1A2B3C] px-3 py-1.5 text-sm text-[#B0BEC5] transition-colors hover:border-[#F0C040]/30 hover:text-[#F0C040]"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-[#F0C040] px-3 py-1.5 text-sm font-semibold text-[#0D1B2A] transition-colors hover:bg-[#C9A033]"
              >
                Entrar
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              aria-label="Abrir busca"
              onClick={() => {
                setIsSearchOpen((prev) => !prev)
                setIsMenuOpen(false)
              }}
              className="rounded-lg p-2 text-[#B0BEC5] transition-colors hover:bg-[#1A2B3C] hover:text-[#F0C040]"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              aria-label="Abrir menu"
              onClick={() => {
                setIsMenuOpen((prev) => !prev)
                setIsSearchOpen(false)
              }}
              className="rounded-lg p-2 text-[#B0BEC5] transition-colors hover:bg-[#1A2B3C] hover:text-[#F0C040]"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-transparent via-[#F0C040]/50 to-transparent" />

        {isSearchOpen && (
          <div className="border-b border-[#243B53] bg-[#0D1B2A] px-4 py-3 md:hidden">
            <form onSubmit={handleSearch}>
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0BEC5]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Buscar jogador por tag..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(sanitizeTagInput(event.target.value))}
                  className="w-full rounded-xl border border-[#243B53] bg-[#1A2B3C] py-2 pl-10 pr-3 text-sm text-white outline-none transition-colors focus:border-[#F0C040]"
                />
              </label>
            </form>
          </div>
        )}

        {isMenuOpen && (
          <div className="border-b border-[#243B53] bg-[#0D1B2A] md:hidden">
            <div className="flex flex-col gap-2 px-4 py-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={closePanels}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                      isActive(link.href)
                        ? 'bg-[#F0C040]/12 text-[#F0C040]'
                        : 'text-[#B0BEC5] hover:bg-[#1A2B3C] hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                )
              })}

              <div className="my-1 border-t border-[#243B53]" />

              {user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#B0BEC5]">
                    <User className="h-4 w-4 text-[#F0C040]" />
                    <span className="truncate">{user.displayName || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#B0BEC5] transition-colors hover:bg-[#1A2B3C] hover:text-[#F0C040]"
                  >
                    <LogOut className="h-5 w-5" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closePanels}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#F0C040] px-4 py-3 font-semibold text-[#0D1B2A] transition-colors hover:bg-[#C9A033]"
                >
                  <User className="h-5 w-5" />
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  )
}
