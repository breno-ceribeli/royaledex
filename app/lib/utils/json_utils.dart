String jsonString(dynamic value, {String fallback = ''}) {
  return value is String ? value : fallback;
}

String? jsonStringOrNull(dynamic value) {
  return value is String ? value : null;
}

int jsonInt(dynamic value, {int fallback = 0}) {
  if (value is num) {
    return value.toInt();
  }
  return fallback;
}

int? jsonIntOrNull(dynamic value) {
  if (value is num) {
    return value.toInt();
  }
  return null;
}

double jsonDouble(dynamic value, {double fallback = 0}) {
  if (value is num) {
    return value.toDouble();
  }
  return fallback;
}

double? jsonDoubleOrNull(dynamic value) {
  if (value is num) {
    return value.toDouble();
  }
  return null;
}

bool? jsonBoolOrNull(dynamic value) {
  return value is bool ? value : null;
}

List<dynamic> jsonList(dynamic value) {
  return value is List ? value : const [];
}

Map<String, dynamic> jsonMap(dynamic value) {
  if (value is Map<String, dynamic>) {
    return value;
  }
  return const {};
}
