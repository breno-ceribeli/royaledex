import { createContext } from 'react'
import type { User } from 'firebase/auth'

/**
 * Tipos de dados que o contexto de autenticação disponibiliza
 */
export interface AuthContextType {
  /** Usuário autenticado (null se não estiver logado) */
  user: User | null

  /** Indica se ainda está verificando o estado inicial de autenticação */
  loading: boolean

  /** Faz login com email e senha */
  signIn: (email: string, password: string) => Promise<void>

  /** Cria nova conta com email e senha */
  signUp: (email: string, password: string) => Promise<void>

  /** Faz login com conta Google */
  signInWithGoogle: () => Promise<void>

  /** Faz logout */
  logout: () => Promise<void>
}

/**
 * Contexto de autenticação - valor inicial null (será preenchido pelo Provider)
 */
export const AuthContext = createContext<AuthContextType | null>(null)
