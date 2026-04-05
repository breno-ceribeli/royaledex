import { useState } from 'react'
import type { SVGProps } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Crown, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { ErrorMessage } from '../components/feedback/ErrorMessage'
import { getFirebaseErrorMessage } from '../utils/firebaseErrors'

function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.68z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.02c-1.07.72-2.44 1.15-4.05 1.15-3.11 0-5.74-2.1-6.68-4.93H1.3v3.09A11.99 11.99 0 0 0 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.32 14.3A7.2 7.2 0 0 1 4.95 12c0-.8.14-1.57.37-2.3V6.6H1.3A11.99 11.99 0 0 0 0 12c0 1.93.46 3.76 1.3 5.4l4.02-3.1z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.94 1.18 15.24 0 12 0A11.99 11.99 0 0 0 1.3 6.6l4.02 3.1c.94-2.84 3.57-4.93 6.68-4.93z"
        fill="#EA4335"
      />
    </svg>
  )
}

function GoogleAuthButton({
  isSignUp,
  disabled,
  onClick,
  loading,
}: {
  isSignUp: boolean
  disabled: boolean
  onClick: () => void
  loading: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group w-full rounded-xl border border-[#35506A] bg-[linear-gradient(140deg,#0F2233_0%,#17344A_55%,#214560_100%)] px-4 py-2.5 text-sm font-semibold text-[#EAF2F8] shadow-[0_10px_24px_rgba(0,0,0,0.26)] transition-all hover:-translate-y-px hover:border-[#F0C040]/55 hover:shadow-[0_14px_32px_rgba(240,192,64,0.14)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="flex items-center justify-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#42627E] bg-[#0D1B2A]/70 transition-colors group-hover:border-[#F0C040]/45">
          <GoogleIcon className="h-4 w-4" />
        </span>
        <span>
          {loading
            ? 'Conectando com Google...'
            : isSignUp
              ? 'Cadastrar com Google'
              : 'Continuar com Google'}
        </span>
      </span>
    </button>
  )
}

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const { signIn, signUp, signInWithGoogle, sendPasswordReset } = useAuth()
  const navigate = useNavigate()
  const isBusy = loading || resetLoading

  const clearMessages = () => {
    setError('')
    setInfo('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isBusy) {
      return
    }

    clearMessages()

    if (isSignUp && password !== confirmPassword) {
      setError('As senhas nao coincidem. Verifique e tente novamente.')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        setIsSignUp(false)
        setPassword('')
        setConfirmPassword('')
        setInfo('Conta criada com sucesso. Enviamos um email de confirmação. Verifique sua caixa de entrada ou spam antes de entrar.')
      } else {
        await signIn(email, password)
        navigate('/')
      }
    } catch (err: unknown) {
      const errorMessage = getFirebaseErrorMessage(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (isBusy) {
      return
    }

    clearMessages()
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

  const handleForgotPassword = async () => {
    if (isBusy) {
      return
    }

    clearMessages()

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setError('Informe seu email para receber o link de redefinicao de senha.')
      return
    }

    setResetLoading(true)
    try {
      await sendPasswordReset(normalizedEmail)
      setInfo('Se existir uma conta com senha para este email, enviamos o link de redefinição. Confira sua caixa de entrada e spam.')
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err))
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F0C040]/8 blur-[90px]" />
      <div className="pointer-events-none absolute -right-10 top-28 h-52 w-52 rounded-full bg-[#7B2FBE]/10 blur-[90px]" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <Crown className="h-12 w-12 text-[#F0C040]" />
            <h1 className="text-3xl font-bold text-white">Royale<span className="text-[#F0C040]">Dex</span></h1>
          </Link>
          <p className="mt-2 text-sm text-[#B0BEC5]">Acesse sua conta para salvar favoritos e acompanhar jogadores.</p>
        </div>

        <article className="rounded-2xl border border-[#243B53] bg-[#1A2B3C] p-6 shadow-2xl">
          <div className="mb-6 grid h-11 grid-cols-2 gap-1 rounded-xl border border-[#243B53] bg-[#0D1B2A] p-1">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false)
                clearMessages()
              }}
              className={[
                'rounded-lg text-sm font-medium transition-colors',
                !isSignUp ? 'bg-[#F0C040] text-[#0D1B2A]' : 'text-[#B0BEC5] hover:bg-[#243B53] hover:text-white',
              ].join(' ')}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true)
                clearMessages()
              }}
              className={[
                'rounded-lg text-sm font-medium transition-colors',
                isSignUp ? 'bg-[#F0C040] text-[#0D1B2A]' : 'text-[#B0BEC5] hover:bg-[#243B53] hover:text-white',
              ].join(' ')}
            >
              Cadastrar
            </button>
          </div>

          {error && <ErrorMessage message={error} onClose={() => setError('')} />}

          {info && (
            <div className="mb-4 rounded-xl border border-[rgba(240,192,64,0.35)] bg-[rgba(240,192,64,0.12)] px-4 py-3 text-sm text-[#ffe9b1]">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-[#B0BEC5]">
              Email
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0BEC5]" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={isBusy}
                  className="w-full rounded-xl border border-[#243B53] bg-[#0D1B2A] py-2.5 pl-10 pr-3 text-sm text-white outline-none transition-colors placeholder:text-[#B0BEC5]/50 focus:border-[#F0C040]"
                  placeholder="seu@email.com"
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-[#B0BEC5]">
              Senha
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0BEC5]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={6}
                  disabled={isBusy}
                  className="w-full rounded-xl border border-[#243B53] bg-[#0D1B2A] py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-colors placeholder:text-[#B0BEC5]/50 focus:border-[#F0C040]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0BEC5] transition-colors hover:text-white"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            {isSignUp && (
              <label className="block text-sm font-medium text-[#B0BEC5]">
                Confirmar senha
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0BEC5]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    minLength={6}
                    disabled={isBusy}
                    className="w-full rounded-xl border border-[#243B53] bg-[#0D1B2A] py-2.5 pl-10 pr-10 text-sm text-white outline-none transition-colors placeholder:text-[#B0BEC5]/50 focus:border-[#F0C040]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0BEC5] transition-colors hover:text-white"
                    aria-label={showConfirmPassword ? 'Ocultar confirmacao de senha' : 'Mostrar confirmacao de senha'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
            )}

            <button
              type="submit"
              disabled={isBusy}
              className="gold-button w-full"
            >
              {loading ? 'Carregando...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          {!isSignUp && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isBusy}
              className="mt-3 w-full text-center text-sm text-[#B0BEC5] underline-offset-2 transition-colors hover:text-[#F0C040] hover:underline disabled:opacity-60"
            >
              {resetLoading ? 'Enviando email...' : 'Esqueci minha senha'}
            </button>
          )}

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#B0BEC5]">
            <span className="h-px flex-1 bg-[rgba(240,192,64,0.16)]" />
            ou
            <span className="h-px flex-1 bg-[rgba(240,192,64,0.16)]" />
          </div>

          <GoogleAuthButton
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            isSignUp={isSignUp}
            loading={loading}
          />

          <div className="mt-6 text-center text-sm text-[#B0BEC5]">
            <Link to="/" className="text-[#F0C040] hover:underline">
              Voltar para home
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}
