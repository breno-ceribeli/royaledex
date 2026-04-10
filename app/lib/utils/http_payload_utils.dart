Map<String, dynamic> expectJsonMap(dynamic value, {required String context}) {
  if (value is Map<String, dynamic>) {
    return value;
  }

  throw FormatException('Resposta invalida em $context: esperado objeto JSON.');
}

List<dynamic> expectJsonList(dynamic value, {required String context}) {
  if (value is List<dynamic>) {
    return value;
  }

  throw FormatException('Resposta invalida em $context: esperado array JSON.');
}
