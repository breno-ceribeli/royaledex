import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { AuthContext } from './AuthContext'
import type { AuthContextType } from './AuthContext'

/**
 * Provider que envolve toda a aplicação e gerencia o estado de autenticação
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado do usuário autenticado
  const [user, setUser] = useState<User | null>(null)

  // Estado de carregamento inicial (evita flash de tela de login)
  const [loading, setLoading] = useState(true)

  /**
   * Efeito que escuta mudanças no estado de autenticação do Firebase
   * Executa uma vez quando o componente monta
   */
  useEffect(() => {
    // onAuthStateChanged retorna uma função de "unsubscribe"
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // Atualiza o estado com o usuário (ou null se deslogou)
      setUser(firebaseUser)

      // Marca que terminou de verificar o estado inicial
      setLoading(false)

      // Log para debug
      if (firebaseUser) {
        console.log('✅ User authenticated:', firebaseUser.email)
      } else {
        console.log('❌ User not authenticated')
      }
    })

    // Cleanup: remove o listener quando o componente desmonta
    return () => unsubscribe()
  }, [])

  /**
   * Login com email e senha
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    const credential = await signInWithEmailAndPassword(auth, email, password)

    const isPasswordAccount = credential.user.providerData.some(
      (provider) => provider.providerId === 'password'
    )

    if (isPasswordAccount && !credential.user.emailVerified) {
      try {
        await sendEmailVerification(credential.user)
      } catch {
        // Ignora falha de reenvio para não esconder o erro principal
      }

      await signOut(auth)
      const error = new Error('Seu email ainda nao foi verificado. Enviamos um novo link de confirmacao para sua caixa de entrada.')
      ;(error as { code?: string }).code = 'auth/email-not-verified'
      throw error
    }

    // Não precisamos atualizar o state manualmente.
    // O onAuthStateChanged já detecta a mudança.
  }

  /**
   * Cadastro com email e senha
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await sendEmailVerification(credential.user)
    await signOut(auth)
  }

  /**
   * Login com Google (popup)
   */
  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  /**
   * Envia email de redefinição de senha
   */
  const sendPasswordReset = async (email: string): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      const error = new Error('Informe um email valido para continuar.')
      ;(error as { code?: string }).code = 'auth/missing-email'
      throw error
    }

    let signInMethods: string[] | null = null

    try {
      signInMethods = await fetchSignInMethodsForEmail(auth, normalizedEmail)
    } catch {
      // Em alguns projetos o Firebase pode restringir essa verificação.
      // Nesses casos seguimos para o envio e deixamos o Firebase aplicar a política de segurança.
      signInMethods = null
    }

    if (signInMethods && signInMethods.length > 0 && !signInMethods.includes('password')) {
      const error = new Error('Este email usa login social e nao possui senha para redefinir.')
      ;(error as { code?: string }).code = 'auth/password-reset-not-available'
      throw error
    }

    await sendPasswordResetEmail(auth, normalizedEmail)
  }

  /**
   * Logout
   */
  const logout = async (): Promise<void> => {
    await signOut(auth)
  }

  // Valores disponibilizados para toda a aplicação
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    sendPasswordReset,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Só renderiza os filhos depois de verificar o estado inicial */}
      {!loading && children}
    </AuthContext.Provider>
  )
}
