import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import type { AuthContextType } from '../contexts/AuthContext'

/**
 * Hook customizado para usar o contexto de autenticação
 * Deve ser usado dentro de um AuthProvider
 *
 * @example
 * function MyComponent() {
 *   const { user, signIn, logout } = useAuth()
 *
 *   if (!user) {
 *     return <button onClick={() => signIn('email', 'password')}>Login</button>
 *   }
 *
 *   return (
 *     <div>
 *       <p>Olá, {user.email}</p>
 *       <button onClick={logout}>Sair</button>
 *     </div>
 *   )
 * }
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
