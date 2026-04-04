import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getFirebaseErrorMessage } from '../utils/firebaseErrors'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      navigate('/')
    } catch (err: unknown) {
      const errorMessage = getFirebaseErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err: unknown) {
      const errorMessage = getFirebaseErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="royale-page">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        <article className="royale-card hidden p-9 lg:block">
          <p className="text-xs uppercase tracking-[0.28em] text-rd-primary-deep">The Royal Archive</p>
          <h1 className="royale-title mt-4 text-5xl leading-[1.05]">Acesse sua conta RoyaleDex</h1>
          <p className="mt-4 max-w-md text-sm text-rd-muted">
            Entre para salvar favoritos, acompanhar perfis e manter sua analise sincronizada com o backend.
          </p>

          <div className="mt-8 space-y-4 text-sm text-rd-muted">
            <div className="royale-card-soft flex items-center gap-3 p-3">
              <span className="material-symbols-outlined text-rd-primary">shield_lock</span>
              <span>Autenticacao via Firebase com sessao persistente.</span>
            </div>
            <div className="royale-card-soft flex items-center gap-3 p-3">
              <span className="material-symbols-outlined text-rd-primary">sync</span>
              <span>Favoritos sincronizados por usuario no backend.</span>
            </div>
          </div>
        </article>

        <article className="royale-card p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-rd-muted">Conta</p>
              <h2 className="royale-title mt-2 text-3xl">{isSignUp ? 'Criar conta' : 'Entrar'}</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              disabled={loading}
              className="ghost-button px-3 py-2 text-sm"
            >
              {isSignUp ? 'Fazer login' : 'Cadastrar'}
            </button>
          </div>

          {error && <div className="mb-4 rounded-xl border border-[rgba(255,140,130,0.35)] bg-[rgba(147,0,10,0.35)] px-4 py-3 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-[0.24em] text-rd-muted">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="input-royal mt-2"
              />
            </label>

            <label className="block text-xs font-bold uppercase tracking-[0.24em] text-rd-muted">
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="input-royal mt-2"
              />
            </label>

            {isSignUp && <p className="text-xs text-rd-muted">Minimo de 6 caracteres.</p>}

            <button type="submit" disabled={loading} className="gold-button w-full">
              {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          {!isSignUp && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-rd-muted">
                <span className="h-px flex-1 bg-[rgba(240,192,64,0.16)]" />
                ou
                <span className="h-px flex-1 bg-[rgba(240,192,64,0.16)]" />
              </div>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full rounded-xl border border-[rgba(240,192,64,0.2)] bg-rd-surface-high px-4 py-3 text-sm font-semibold transition-colors hover:bg-[rgba(30,43,59,0.65)] disabled:opacity-70"
              >
                Continuar com Google
              </button>
            </>
          )}

          <div className="mt-6 text-center text-sm text-rd-muted">
            <Link to="/" className="text-rd-primary hover:underline">
              Voltar para home
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}
