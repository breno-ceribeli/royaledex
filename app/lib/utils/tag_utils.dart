String normalizePlayerTag(String tag) {
  final trimmed = tag.trim();
  if (trimmed.startsWith('#')) {
    return trimmed.substring(1);
  }
  return trimmed;
}

String requireValidPlayerTag(String tag, {String fieldName = 'tag'}) {
  final normalizedTag = normalizePlayerTag(tag);
  if (normalizedTag.isEmpty) {
    throw ArgumentError('$fieldName nao pode estar vazio.');
  }
  return normalizedTag;
}
