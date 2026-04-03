/**
 * Tipos gerais de resposta da API
 */

export interface ApiError {
  error: string
}

export interface ApiErrorResponse {
  status: number
  message: string
}
