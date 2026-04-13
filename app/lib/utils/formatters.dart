String sanitizeTagInput(String value) {
  final upper = value.toUpperCase().replaceAll(RegExp(r'\s+'), '');
  final allowed = upper.replaceAll(RegExp(r'[^A-Z0-9#]'), '');
  final cleaned = allowed.replaceAll('#', '');
  return cleaned;
}

String normalizeTagForRoute(String value) {
  return sanitizeTagInput(value).replaceFirst(RegExp(r'^#+'), '');
}

String formatTag(String value) {
  final normalized = normalizeTagForRoute(value);
  return normalized.isEmpty ? '#' : '#$normalized';
}

String formatBattleDate(String raw) {
  final parsed = _tryParseDate(raw);

  if (parsed == null) {
    return 'Data inválida';
  }

  final local = parsed.toLocal();
  final day = local.day.toString().padLeft(2, '0');
  final month = local.month.toString().padLeft(2, '0');
  final hour = local.hour.toString().padLeft(2, '0');
  final minute = local.minute.toString().padLeft(2, '0');
  return '$day/$month $hour:$minute';
}

String formatFavoriteAddedAt(String raw) {
  final parsed = _tryParseDate(raw);
  if (parsed == null) {
    return raw;
  }

  final local = parsed.toLocal();
  final day = local.day.toString().padLeft(2, '0');
  final month = local.month.toString().padLeft(2, '0');
  final year = local.year.toString();
  final hour = local.hour.toString().padLeft(2, '0');
  final minute = local.minute.toString().padLeft(2, '0');

  return '$day/$month/$year às $hour:$minute';
}

DateTime? _tryParseDate(String raw) {
  DateTime? parsed;

  try {
    parsed = DateTime.tryParse(raw);

    if (parsed == null && RegExp(r'^\d{8}T\d{6}\.\d{3}Z$').hasMatch(raw)) {
      final year = raw.substring(0, 4);
      final month = raw.substring(4, 6);
      final day = raw.substring(6, 8);
      final hour = raw.substring(9, 11);
      final minute = raw.substring(11, 13);
      final second = raw.substring(13, 15);

      parsed = DateTime.tryParse(
        '$year-$month-${day}T$hour:$minute:$second.000Z',
      );
    }
  } catch (_) {
    parsed = null;
  }

  return parsed;
}

String formatCompactNumber(int value) {
  final raw = value.toString();
  final buffer = StringBuffer();

  for (var index = 0; index < raw.length; index += 1) {
    final reverseIndex = raw.length - index;
    buffer.write(raw[index]);
    if (reverseIndex > 1 && reverseIndex % 3 == 1) {
      buffer.write('.');
    }
  }

  return buffer.toString();
}

String formatPercent(double value) {
  final normalized = value <= 1 ? value * 100 : value;
  return '${normalized.toStringAsFixed(1)}%';
}

String formatRarityLabel(String rarity) {
  final normalized = rarity
      .normalizeToNfd()
      .replaceAll(RegExp(r'[\u0300-\u036f]'), '')
      .trim()
      .toLowerCase();

  if (normalized.contains('champion') || normalized.contains('campeao')) {
    return 'Campeão';
  }
  if (normalized.contains('legend')) {
    return 'Lendária';
  }
  if (normalized.contains('epic') || normalized.contains('epica')) {
    return 'Épica';
  }
  if (normalized.contains('rare') || normalized.contains('rara')) {
    return 'Rara';
  }
  if (normalized.contains('common') || normalized.contains('comum')) {
    return 'Comum';
  }

  if (rarity.isEmpty) {
    return rarity;
  }

  return rarity[0].toUpperCase() + rarity.substring(1).toLowerCase();
}

extension on String {
  String normalizeToNfd() {
    const accents = {
      'á': 'a',
      'à': 'a',
      'â': 'a',
      'ã': 'a',
      'ä': 'a',
      'é': 'e',
      'è': 'e',
      'ê': 'e',
      'ë': 'e',
      'í': 'i',
      'ì': 'i',
      'î': 'i',
      'ï': 'i',
      'ó': 'o',
      'ò': 'o',
      'ô': 'o',
      'õ': 'o',
      'ö': 'o',
      'ú': 'u',
      'ù': 'u',
      'û': 'u',
      'ü': 'u',
      'ç': 'c',
      'Á': 'A',
      'À': 'A',
      'Â': 'A',
      'Ã': 'A',
      'Ä': 'A',
      'É': 'E',
      'È': 'E',
      'Ê': 'E',
      'Ë': 'E',
      'Í': 'I',
      'Ì': 'I',
      'Î': 'I',
      'Ï': 'I',
      'Ó': 'O',
      'Ò': 'O',
      'Ô': 'O',
      'Õ': 'O',
      'Ö': 'O',
      'Ú': 'U',
      'Ù': 'U',
      'Û': 'U',
      'Ü': 'U',
      'Ç': 'C',
    };

    var output = this;
    accents.forEach((accented, plain) {
      output = output.replaceAll(accented, plain);
    });
    return output;
  }
}
