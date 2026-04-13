import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../models/battle.dart';
import '../../models/card.dart';
import '../../utils/formatters.dart';
import '../error_widget.dart';

class PlayerAnalysis extends StatelessWidget {
  const PlayerAnalysis({
    super.key,
    required this.playerTag,
    required this.battleStats,
    required this.statsError,
    required this.battles,
    required this.battlesError,
    required this.allCards,
    required this.cardsError,
  });

  final String playerTag;
  final BattleLogStats? battleStats;
  final String? statsError;
  final List<Battle> battles;
  final String? battlesError;
  final List<CardModel> allCards;
  final String? cardsError;

  @override
  Widget build(BuildContext context) {
    final stats = battleStats;

    if (statsError != null && stats == null) {
      return FriendlyErrorWidget(
        title: 'Falha ao carregar análise',
        message: statsError!,
      );
    }

    if (stats == null) {
      return const _InfoCard(
        title: 'Sem dados de análise',
        child: Text(
          'Ainda não há estatísticas suficientes para esta conta.',
          style: TextStyle(color: RoyaleDexColors.textMuted),
        ),
      );
    }

    final winRate = _normalizePercentage(stats.winRate);
    final lossesByCard = stats.mostLostAgainstCards.take(10).toList();

    final normalizedPlayerTag = _normalizeTag(playerTag);
    final competitiveBattles = battles
        .where((battle) => _competitiveTypeFor(battle) != null)
        .toList();
    final recentCompetitive = competitiveBattles.take(30).toList();

    final battleTypeSummary = <String, _ModeSummary>{};
    for (final battle in recentCompetitive) {
      final mode = _competitiveTypeFor(battle);
      if (mode == null) {
        continue;
      }

      final summary = battleTypeSummary.putIfAbsent(
        mode,
        () => _ModeSummary(mode: mode),
      );

      switch (_battleResultFor(battle, normalizedPlayerTag)) {
        case _BattleResult.win:
          summary.wins += 1;
        case _BattleResult.loss:
          summary.losses += 1;
        case _BattleResult.draw:
          summary.draws += 1;
        case _BattleResult.unknown:
          break;
      }
    }

    final cardsByName = <String, CardModel>{
      for (final card in allCards) _normalizeText(card.name): card,
    };

    final crowns = stats.crownsDistribution;
    final crownRows = <({String label, int count})>[
      (label: '0 coroas', count: crowns.zero),
      (label: '1 coroa', count: crowns.one),
      (label: '2 coroas', count: crowns.two),
      (label: '3 coroas', count: crowns.three),
    ];
    final crownsTotal = crownRows.fold<int>(0, (sum, item) => sum + item.count);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (statsError != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: FriendlyErrorWidget(
              title: 'Falha parcial em estatísticas',
              message: statsError!,
            ),
          ),
        _InfoCard(
          title: 'Desempenho geral',
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Taxa de vitória',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.9),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Text(
                    '${winRate.toStringAsFixed(1)}%',
                    style: const TextStyle(
                      color: RoyaleDexColors.primary,
                      fontWeight: FontWeight.w800,
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(99),
                child: LinearProgressIndicator(
                  minHeight: 10,
                  value: (winRate / 100).clamp(0, 1),
                  backgroundColor: RoyaleDexColors.surfaceHigh,
                  color: RoyaleDexColors.primary,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _AnalysisMetricTile(
                      label: 'Total',
                      value: formatCompactNumber(stats.totalBattles),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _AnalysisMetricTile(
                      label: 'Vitórias',
                      value: formatCompactNumber(stats.wins),
                      tone: const Color(0xFF22C55E),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _AnalysisMetricTile(
                      label: 'Derrotas',
                      value: formatCompactNumber(stats.losses),
                      tone: const Color(0xFFEF4444),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _AnalysisMetricTile(
                      label: 'Empates',
                      value: formatCompactNumber(stats.draws),
                      tone: RoyaleDexColors.primary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),
        _InfoCard(
          title: 'Indicadores',
          child: Column(
            children: [
              _IndicatorRow(
                label: 'Batalhas Ladder',
                value: formatCompactNumber(stats.pvpBattles),
              ),
              _IndicatorRow(
                label: 'Path of Legends',
                value: formatCompactNumber(stats.pathOfLegendBattles),
              ),
              _IndicatorRow(
                label: 'Média de elixir desperdiçado',
                value: stats.avgElixirLeaked.toStringAsFixed(1),
              ),
              if (stats.avgTrophyChange != null)
                _IndicatorRow(
                  label: 'Média de troféus por partida',
                  value:
                      '${stats.avgTrophyChange! >= 0 ? '+' : ''}${stats.avgTrophyChange!.toStringAsFixed(2)}',
                  valueColor: stats.avgTrophyChange! >= 0
                      ? const Color(0xFF86EFAC)
                      : const Color(0xFFFCA5A5),
                ),
              const SizedBox(height: 6),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Distribuição de coroas',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              ...crownRows.map((row) {
                final ratio = crownsTotal == 0 ? 0.0 : row.count / crownsTotal;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 7),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 68,
                        child: Text(
                          row.label,
                          style: const TextStyle(
                            color: RoyaleDexColors.textMuted,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(99),
                          child: LinearProgressIndicator(
                            minHeight: 8,
                            value: ratio,
                            backgroundColor: RoyaleDexColors.surfaceHigh,
                            color: RoyaleDexColors.primarySoft,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      SizedBox(
                        width: 34,
                        child: Text(
                          '${row.count}',
                          textAlign: TextAlign.right,
                          style: const TextStyle(
                            color: RoyaleDexColors.textMain,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
        const SizedBox(height: 10),
        _InfoCard(
          title: 'Rendimento por modo recente',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (battlesError != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(
                    battlesError!,
                    style: const TextStyle(color: Color(0xFFFCA5A5)),
                  ),
                ),
              if (battleTypeSummary.isEmpty)
                const Text(
                  'Sem batalhas competitivas recentes para comparar.',
                  style: TextStyle(color: RoyaleDexColors.textMuted),
                )
              else
                ...battleTypeSummary.values.map((summary) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            summary.mode,
                            style: const TextStyle(
                              color: RoyaleDexColors.textMain,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        _Badge(
                          text: 'W ${summary.wins}',
                          color: const Color(0xFF22C55E),
                        ),
                        const SizedBox(width: 6),
                        _Badge(
                          text: 'L ${summary.losses}',
                          color: const Color(0xFFEF4444),
                        ),
                        const SizedBox(width: 6),
                        _Badge(
                          text: 'D ${summary.draws}',
                          color: RoyaleDexColors.primary,
                        ),
                      ],
                    ),
                  );
                }),
              if (recentCompetitive.isNotEmpty) ...[
                const SizedBox(height: 8),
                const Text(
                  'Últimos resultados',
                  style: TextStyle(
                    color: RoyaleDexColors.textMuted,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: recentCompetitive.take(24).map((battle) {
                    switch (_battleResultFor(battle, normalizedPlayerTag)) {
                      case _BattleResult.win:
                        return const _ResultDot(
                          label: 'W',
                          color: Color(0xFF22C55E),
                        );
                      case _BattleResult.loss:
                        return const _ResultDot(
                          label: 'L',
                          color: Color(0xFFEF4444),
                        );
                      case _BattleResult.draw:
                        return const _ResultDot(
                          label: 'D',
                          color: RoyaleDexColors.primary,
                        );
                      case _BattleResult.unknown:
                        return const _ResultDot(
                          label: '?',
                          color: RoyaleDexColors.textMuted,
                        );
                    }
                  }).toList(),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 10),
        _InfoCard(
          title: 'Cartas que mais te punem',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (cardsError != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(
                    cardsError!,
                    style: const TextStyle(color: Color(0xFFFCA5A5)),
                  ),
                ),
              if (lossesByCard.isEmpty)
                const Text(
                  'Sem dados suficientes no período.',
                  style: TextStyle(color: RoyaleDexColors.textMuted),
                )
              else
                ...lossesByCard.map((entry) {
                  final iconUrl =
                      cardsByName[_normalizeText(entry.name)]?.iconUrls.medium;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: RoyaleDexColors.surfaceHigh),
                      color: const Color(0x88111F2C),
                    ),
                    child: Row(
                      children: [
                        _CardThumb(iconUrl: iconUrl, fallback: entry.name),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            entry.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: RoyaleDexColors.textMain,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '${entry.count} derrotas',
                              style: const TextStyle(
                                color: RoyaleDexColors.textMain,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            Text(
                              '${_normalizePercentage(entry.percentage).toStringAsFixed(1)}% das partidas',
                              style: const TextStyle(
                                color: RoyaleDexColors.textMuted,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
            ],
          ),
        ),
      ],
    );
  }
}

enum _BattleResult { win, loss, draw, unknown }

class _ModeSummary {
  _ModeSummary({required this.mode});

  final String mode;
  int wins = 0;
  int losses = 0;
  int draws = 0;
}

String _normalizeTag(String value) {
  return value.replaceAll('#', '').trim().toUpperCase();
}

String _normalizeText(String value) {
  return _stripAccents(value).trim().toLowerCase();
}

String _stripAccents(String value) {
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

  var output = value;
  accents.forEach((accented, plain) {
    output = output.replaceAll(accented, plain);
  });
  return output;
}

String? _competitiveTypeFor(Battle battle) {
  final normalizedType = _normalizeText(battle.type);
  if (normalizedType == 'pvp') {
    return 'Ladder';
  }
  if (normalizedType == 'pathoflegend') {
    return 'Path of Legends';
  }
  return null;
}

_BattleResult _battleResultFor(Battle battle, String normalizedPlayerTag) {
  if (battle.opponent.isEmpty || battle.team.isEmpty) {
    return _BattleResult.unknown;
  }

  final playerData = battle.team.firstWhere(
    (entry) => _normalizeTag(entry.tag) == normalizedPlayerTag,
    orElse: () => battle.team.first,
  );

  final opponentData = battle.opponent.first;

  if (playerData.crowns > opponentData.crowns) {
    return _BattleResult.win;
  }
  if (playerData.crowns < opponentData.crowns) {
    return _BattleResult.loss;
  }
  return _BattleResult.draw;
}

double _normalizePercentage(double value) {
  return value <= 1 ? value * 100 : value;
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
        color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: RoyaleDexColors.textMain,
              fontWeight: FontWeight.w700,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}

class _IndicatorRow extends StatelessWidget {
  const _IndicatorRow({
    required this.label,
    required this.value,
    this.valueColor = RoyaleDexColors.textMain,
  });

  final String label;
  final String value;
  final Color valueColor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(color: RoyaleDexColors.textMuted),
            ),
          ),
          Text(
            value,
            style: TextStyle(color: valueColor, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

class _AnalysisMetricTile extends StatelessWidget {
  const _AnalysisMetricTile({
    required this.label,
    required this.value,
    this.tone = RoyaleDexColors.textMain,
  });

  final String label;
  final String value;
  final Color tone;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: tone.withValues(alpha: 0.35)),
        color: tone.withValues(alpha: 0.1),
      ),
      child: Column(
        children: [
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(color: tone, fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(color: tone.withValues(alpha: 0.9), fontSize: 12),
          ),
        ],
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.text, required this.color});

  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        color: color.withValues(alpha: 0.12),
        border: Border.all(color: color.withValues(alpha: 0.45)),
      ),
      child: Text(
        text,
        style: TextStyle(color: color, fontWeight: FontWeight.w700),
      ),
    );
  }
}

class _ResultDot extends StatelessWidget {
  const _ResultDot({required this.label, required this.color});

  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 24,
      height: 24,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color.withValues(alpha: 0.16),
        border: Border.all(color: color.withValues(alpha: 0.5)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.w800,
          fontSize: 11,
        ),
      ),
    );
  }
}

class _CardThumb extends StatelessWidget {
  const _CardThumb({required this.iconUrl, required this.fallback});

  final String? iconUrl;
  final String fallback;

  @override
  Widget build(BuildContext context) {
    if (iconUrl != null && iconUrl!.isNotEmpty) {
      return ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: SizedBox(
          width: 38,
          height: 38,
          child: Image.network(
            iconUrl!,
            fit: BoxFit.cover,
            errorBuilder: (_, _, _) => _FallbackThumb(fallback: fallback),
          ),
        ),
      );
    }

    return _FallbackThumb(fallback: fallback);
  }
}

class _FallbackThumb extends StatelessWidget {
  const _FallbackThumb({required this.fallback});

  final String fallback;

  @override
  Widget build(BuildContext context) {
    final normalized = fallback.trim();
    final initial = normalized.isEmpty ? '?' : normalized[0].toUpperCase();

    return Container(
      width: 38,
      height: 38,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: const Color(0xFF111F2C),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
      ),
      child: Text(
        initial,
        style: const TextStyle(
          color: RoyaleDexColors.primary,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}
