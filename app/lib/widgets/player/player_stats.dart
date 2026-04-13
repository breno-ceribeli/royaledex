import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../models/battle.dart';
import '../../models/player.dart';
import '../../utils/formatters.dart';
import 'deck_display.dart';

class PlayerStats extends StatelessWidget {
  const PlayerStats({super.key, required this.player, this.battleStats});

  final PlayerProfile player;
  final BattleLogStats? battleStats;

  @override
  Widget build(BuildContext context) {
    final statItems =
        <({String label, String value, IconData icon, Color color})>[
          (
            label: 'Troféus',
            value: formatCompactNumber(player.trophies),
            icon: Icons.emoji_events_rounded,
            color: RoyaleDexColors.primary,
          ),
          (
            label: 'Melhor marca',
            value: formatCompactNumber(player.bestTrophies),
            icon: Icons.workspace_premium_rounded,
            color: RoyaleDexColors.primarySoft,
          ),
          (
            label: 'Vitórias',
            value: formatCompactNumber(player.wins),
            icon: Icons.check_circle_rounded,
            color: const Color(0xFF22C55E),
          ),
          (
            label: 'Derrotas',
            value: formatCompactNumber(player.losses),
            icon: Icons.cancel_rounded,
            color: const Color(0xFFEF4444),
          ),
          (
            label: 'Batalhas',
            value: formatCompactNumber(player.battleCount),
            icon: Icons.sports_martial_arts_rounded,
            color: const Color(0xFF3B82F6),
          ),
          (
            label: '3 coroas',
            value: formatCompactNumber(player.threeCrownWins),
            icon: Icons.military_tech_rounded,
            color: const Color(0xFFC993F8),
          ),
          (
            label: 'Doações',
            value: formatCompactNumber(player.donations),
            icon: Icons.volunteer_activism_rounded,
            color: const Color(0xFFEAB308),
          ),
          (
            label: 'Recebidas',
            value: formatCompactNumber(player.donationsReceived),
            icon: Icons.card_giftcard_rounded,
            color: const Color(0xFF7DD3FC),
          ),
        ];

    final careerHighlights = <({String label, String value})>[
      (
        label: 'Cartas de desafio',
        value: formatCompactNumber(player.challengeCardsWon),
      ),
      (
        label: 'Melhor desafio',
        value: formatCompactNumber(player.challengeMaxWins),
      ),
      (
        label: 'Cartas de torneio',
        value: formatCompactNumber(player.tournamentCardsWon),
      ),
      (
        label: 'Partidas de torneio',
        value: formatCompactNumber(player.tournamentBattleCount),
      ),
      (
        label: 'Doações totais',
        value: formatCompactNumber(player.totalDonations),
      ),
      (
        label: 'Vitórias de guerra',
        value: formatCompactNumber(player.warDayWins),
      ),
      (
        label: 'Cartas de clã',
        value: formatCompactNumber(player.clanCardsCollected),
      ),
      (label: 'Pontos estrela', value: formatCompactNumber(player.starPoints)),
      (label: 'XP atual', value: formatCompactNumber(player.expPoints)),
      if (player.totalExpPoints != null)
        (label: 'XP total', value: formatCompactNumber(player.totalExpPoints!)),
      if (player.legacyTrophyRoadHighScore != null)
        (
          label: 'Recorde legado',
          value: formatCompactNumber(player.legacyTrophyRoadHighScore!),
        ),
    ];

    final deckCards = player.currentDeck
        .map((card) => DeckCardData.fromPlayerCard(card))
        .toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        GridView.builder(
          itemCount: statItems.length,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.28,
          ),
          itemBuilder: (context, index) {
            final item = statItems[index];
            return _StatCard(item: item);
          },
        ),
        const SizedBox(height: 12),
        if (battleStats != null)
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: RoyaleDexColors.surfaceHigh),
              color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Resumo de Batalhas',
                  style: TextStyle(
                    color: RoyaleDexColors.textMain,
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: _SummaryTile(
                        label: 'Taxa de vitória',
                        value: formatPercent(battleStats!.winRate),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _SummaryTile(
                        label: 'Total',
                        value: '${battleStats!.totalBattles}',
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _SummaryTile(
                        label: 'Elixir perdido',
                        value: battleStats!.avgElixirLeaked.toStringAsFixed(1),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        Container(
          width: double.infinity,
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: RoyaleDexColors.surfaceHigh),
            color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Carreira',
                style: TextStyle(
                  color: RoyaleDexColors.textMain,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: careerHighlights.map((item) {
                  return _CareerBadge(label: item.label, value: item.value);
                }).toList(),
              ),
            ],
          ),
        ),
        if (player.currentPathOfLegendSeasonResult != null ||
            player.lastPathOfLegendSeasonResult != null ||
            player.bestPathOfLegendSeasonResult != null)
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: RoyaleDexColors.surfaceHigh),
              color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Path of Legends',
                  style: TextStyle(
                    color: RoyaleDexColors.textMain,
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                if (player.currentPathOfLegendSeasonResult != null)
                  _PathSeasonRow(
                    title: 'Temporada atual',
                    result: player.currentPathOfLegendSeasonResult!,
                  ),
                if (player.lastPathOfLegendSeasonResult != null)
                  _PathSeasonRow(
                    title: 'Temporada passada',
                    result: player.lastPathOfLegendSeasonResult!,
                  ),
                if (player.bestPathOfLegendSeasonResult != null)
                  _PathSeasonRow(
                    title: 'Melhor temporada',
                    result: player.bestPathOfLegendSeasonResult!,
                  ),
              ],
            ),
          ),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: RoyaleDexColors.surfaceHigh),
            color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
          ),
          child: DeckDisplay(title: 'Deck atual', cards: deckCards),
        ),
      ],
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({required this.item});

  final ({String label, String value, IconData icon, Color color}) item;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
        color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(item.icon, color: item.color),
          const SizedBox(height: 6),
          Text(
            item.value,
            style: const TextStyle(
              color: RoyaleDexColors.textMain,
              fontWeight: FontWeight.w800,
              fontSize: 20,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            item.label,
            style: const TextStyle(color: RoyaleDexColors.textMuted),
          ),
        ],
      ),
    );
  }
}

class _SummaryTile extends StatelessWidget {
  const _SummaryTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: const Color(0x88111F2C),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
      ),
      child: Column(
        children: [
          Text(
            value,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: RoyaleDexColors.textMain,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              color: RoyaleDexColors.textMuted,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

class _CareerBadge extends StatelessWidget {
  const _CareerBadge({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
        color: const Color(0x88111F2C),
      ),
      child: Text(
        '$label: $value',
        style: const TextStyle(
          color: RoyaleDexColors.textMuted,
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
      ),
    );
  }
}

class _PathSeasonRow extends StatelessWidget {
  const _PathSeasonRow({required this.title, required this.result});

  final String title;
  final PathOfLegendSeasonResult result;

  @override
  Widget build(BuildContext context) {
    final league = result.leagueNumber != null ? '${result.leagueNumber}' : '-';
    final trophies = result.trophies != null ? '${result.trophies}' : '-';
    final rank = result.rank != null ? '#${result.rank}' : '-';

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              style: const TextStyle(color: RoyaleDexColors.textMuted),
            ),
          ),
          Text(
            'Liga $league  |  Troféus $trophies  |  Rank $rank',
            style: const TextStyle(
              color: RoyaleDexColors.textMain,
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
