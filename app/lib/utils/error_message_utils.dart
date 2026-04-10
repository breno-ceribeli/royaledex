import '../services/api_service.dart';

String toUserFriendlyErrorMessage(Object error) {
  if (error is ApiException) {
    return error.message;
  }

  if (error is ArgumentError) {
    return error.message?.toString() ?? 'Dados invalidos para a operacao.';
  }

  if (error is FormatException) {
    return error.message;
  }

  return 'Nao foi possivel concluir a operacao. Tente novamente.';
}
