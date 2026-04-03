/**
 * Traduz erros HTTP da API backend para mensagens em português
 */

import type { ApiError } from '../types/api'

export function getApiErrorMessage(error: unknown): string {
  // Erro do Axios com resposta do servidor
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: {
        status: number
        data?: ApiError | string
      }
    }

    if (axiosError.response) {
      const { status, data } = axiosError.response

      // Extrai mensagem de erro do backend
      let backendMessage = ''
      if (data && typeof data === 'object' && 'error' in data) {
        backendMessage = data.error
      } else if (typeof data === 'string') {
        backendMessage = data
      }

      // Traduz erros comuns por status code
      switch (status) {
        case 400:
          return translateBadRequestError(backendMessage)
        case 401:
          return 'Sessão expirada. Faça login novamente.'
        case 403:
          return 'Você não tem permissão para acessar este recurso.'
        case 404:
          return translateNotFoundError(backendMessage)
        case 429:
          return 'Muitas requisições. Aguarde alguns segundos e tente novamente.'
        case 500:
          return 'Erro no servidor. Tente novamente mais tarde.'
        case 503:
          return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.'
        default:
          return backendMessage || 'Erro ao processar sua requisição.'
      }
    }
  }

  // Erro de rede (sem resposta do servidor)
  if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as Error).message

    if (errorMessage.includes('Network Error') || errorMessage.includes('ERR_NETWORK')) {
      return 'Erro de conexão. Verifique sua internet e tente novamente.'
    }

    if (errorMessage.includes('timeout')) {
      return 'A requisição demorou muito. Verifique sua conexão e tente novamente.'
    }
  }

  // Fallback
  return 'Ocorreu um erro inesperado. Tente novamente.'
}

/**
 * Traduz erros 400 (Bad Request)
 */
function translateBadRequestError(backendMessage: string): string {
  // Mensagens comuns do backend em inglês
  const translations: Record<string, string> = {
    'Player tag is required': 'Tag do jogador é obrigatória.',
    'Invalid player tag format': 'Formato de tag inválido. Use apenas números e as letras P, Y, L, Q, G, R, J, C, U, V.',
    'Player tag must be provided': 'Tag do jogador é obrigatória.',
    'Tag and name are required': 'Tag e nome são obrigatórios.',
    'Tag is required': 'Tag é obrigatória.',
    'Name is required': 'Nome é obrigatório.',
    'Bad request': 'Requisição inválida. Verifique os dados e tente novamente.',
  }

  // Procura tradução exata
  if (translations[backendMessage]) {
    return translations[backendMessage]
  }

  // Procura por palavras-chave
  const lowerMessage = backendMessage.toLowerCase()

  if (lowerMessage.includes('invalid') && lowerMessage.includes('tag')) {
    return 'Tag de jogador inválida. Verifique e tente novamente.'
  }

  if (lowerMessage.includes('required')) {
    return 'Dados obrigatórios não foram fornecidos.'
  }

  // Retorna mensagem original se não houver tradução
  return backendMessage || 'Requisição inválida.'
}

/**
 * Traduz erros 404 (Not Found)
 */
function translateNotFoundError(backendMessage: string): string {
  const translations: Record<string, string> = {
    'Resource not found': 'Recurso não encontrado.',
    'Player not found': 'Jogador não encontrado. Verifique a tag e tente novamente.',
    'Favorite not found': 'Favorito não encontrado.',
  }

  // Procura tradução exata
  if (translations[backendMessage]) {
    return translations[backendMessage]
  }

  // Procura por palavras-chave
  const lowerMessage = backendMessage.toLowerCase()

  if (lowerMessage.includes('player') && lowerMessage.includes('not found')) {
    return 'Jogador não encontrado. Verifique a tag e tente novamente.'
  }

  if (lowerMessage.includes('not found')) {
    return 'Recurso não encontrado.'
  }

  return backendMessage || 'Não encontrado.'
}
