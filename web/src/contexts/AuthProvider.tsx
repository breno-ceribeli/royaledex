import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
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
    await signInWithEmailAndPassword(auth, email, password)
    // Não precisamos atualizar o state manualmente
    // O onAuthStateChanged já detecta a mudança
  }

  /**
   * Cadastro com email e senha
   */
  const signUp = async (email: string, password: string): Promise<void> => {
    await createUserWithEmailAndPassword(auth, email, password)
    // Firebase automaticamente loga o usuário após criar conta
  }

  /**
   * Login com Google (popup)
   */
  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
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
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Só renderiza os filhos depois de verificar o estado inicial */}
      {!loading && children}
    </AuthContext.Provider>
  )
}
