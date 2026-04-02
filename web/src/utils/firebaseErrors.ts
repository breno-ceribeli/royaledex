/**
 * Traduz códigos de erro do Firebase Auth para mensagens em português
 */
export function getFirebaseErrorMessage(error: unknown): string {
  // Se não for um erro, retorna mensagem genérica
  if (!(error instanceof Error)) {
    return 'Ocorreu um erro inesperado. Tente novamente.'
  }

  // Extrai o código de erro do Firebase (formato: auth/error-code)
  const errorCode = (error as { code?: string }).code

  // Mapeamento de códigos de erro para mensagens em português
  const errorMessages: Record<string, string> = {
    // Erros de Login
    'auth/invalid-email': 'Email inválido. Verifique e tente novamente.',
    'auth/user-disabled': 'Esta conta foi desabilitada. Entre em contato com o suporte.',
    'auth/user-not-found': 'Nenhuma conta encontrada com este email.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente mais tarde.',
    
    // Erros de Cadastro
    'auth/email-already-in-use': 'Email inválido. Verifique e tente novamente.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'Senha muito fraca. Use no mínimo 6 caracteres.',
    
    // Erros do Google Sign In
    'auth/account-exists-with-different-credential': 
      'Já existe uma conta com este email usando outro método de login. Tente fazer login com email e senha.',
    'auth/popup-blocked': 
      'O popup foi bloqueado pelo navegador. Permita popups para este site e tente novamente.',
    'auth/popup-closed-by-user': 
      'A janela de login foi fechada. Tente novamente.',
    'auth/cancelled-popup-request': 
      'Login cancelado. Tente novamente.',
    
    // Erros de Rede
    'auth/network-request-failed': 
      'Erro de conexão. Verifique sua internet e tente novamente.',
    
    // Erros genéricos
    'auth/internal-error': 
      'Erro interno do servidor. Tente novamente mais tarde.',
    'auth/invalid-api-key': 
      'Configuração inválida. Entre em contato com o suporte.',
  }

  // Retorna a mensagem traduzida ou uma mensagem genérica
  if (errorCode && errorMessages[errorCode]) {
    return errorMessages[errorCode]
  }

  // Se o erro tem uma mensagem, usa ela (já traduzida acima se for Firebase)
  if (error.message) {
    return error.message
  }

  // Fallback final
  return 'Ocorreu um erro inesperado. Tente novamente.'
}
