import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Componente que protege rotas privadas
 * Redireciona para /login se o usuário não estiver autenticado
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) return <p>Carregando...</p>;

  if (!user) {
    // Redireciona para login se não estiver autenticado
    return <Navigate to="/login" replace />
  }

  // Se autenticado, renderiza o conteúdo
  return <>{children}</>
}
