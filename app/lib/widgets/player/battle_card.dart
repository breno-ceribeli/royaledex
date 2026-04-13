import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../models/battle.dart';
import '../../utils/formatters.dart';
import 'deck_display.dart';

class BattleCardTile extends StatefulWidget {
  const BattleCardTile({
    super.key,
    required this.battle,
    required this.playerTag,
  });

  final Battle battle;
  final String playerTag;

  @override
  State<BattleCardTile> createState() => _BattleCardTileState();
}

class _BattleCardTileState extends State<BattleCardTile> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final normalizedTag = normalizeTagForRoute(widget.playerTag);

    final playerData =
        widget.battle.team
            .where((item) => normalizeTagForRoute(item.tag) == normalizedTag)
            .cast<PlayerBattleData?>()
            .firstWhere((item) => item != null, orElse: () => null) ??
        (widget.battle.team.isNotEmpty ? widget.battle.team.first : null);

    final opponentData = widget.battle.opponent.isNotEmpty
        ? widget.battle.opponent.first
        : null;

    if (playerData == null || opponentData == null) {
      return Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: RoyaleDexColors.surfaceHigh),
          color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
        ),
        child: const Text(
          'Não foi possível carregar esta batalha.',
          style: TextStyle(color: RoyaleDexColors.textMuted),
        ),
      );
    }

    final playerCrowns = playerData.crowns;
    final opponentCrowns = opponentData.crowns;

    final didWin = playerCrowns > opponentCrowns;
    final isDraw = playerCrowns == opponentCrowns;

    final statusLabel = didWin
        ? 'Vitória'
        : isDraw
        ? 'Empate'
        : 'Derrota';

    final statusColor = didWin
        ? const Color(0xFF22C55E)
        : isDraw
        ? RoyaleDexColors.primary
        : const Color(0xFFEF4444);

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
        color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
      ),
      child: Column(
        children: [
          InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: () {
              setState(() {
                _expanded = !_expanded;
              });
            },
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.battle.gameMode.name,
                          style: const TextStyle(
                            color: RoyaleDexColors.textMain,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${widget.battle.arena.name} - ${formatBattleDate(widget.battle.battleTime)}',
                          style: const TextStyle(
                            color: RoyaleDexColors.textMuted,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '$playerCrowns x $opponentCrowns',
                        style: const TextStyle(
                          color: RoyaleDexColors.textMain,
                          fontWeight: FontWeight.w800,
                          fontSize: 20,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(999),
                          color: statusColor.withValues(alpha: 0.15),
                          border: Border.all(
                            color: statusColor.withValues(alpha: 0.5),
                          ),
                        ),
                        child: Text(
                          statusLabel,
                          style: TextStyle(
                            color: statusColor,
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  Icon(
                    _expanded
                        ? Icons.keyboard_arrow_up_rounded
                        : Icons.keyboard_arrow_down_rounded,
                    color: RoyaleDexColors.textMuted,
                  ),
                ],
              ),
            ),
          ),
          if (_expanded)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Divider(color: RoyaleDexColors.surfaceHigh),
                  const SizedBox(height: 8),
                  DeckDisplay(
                    title: playerData.name,
                    cards: playerData.cards
                        .map((card) => DeckCardData.fromBattleCard(card))
                        .toList(),
                  ),
                  const SizedBox(height: 10),
                  DeckDisplay(
                    title: opponentData.name,
                    cards: opponentData.cards
                        .map((card) => DeckCardData.fromBattleCard(card))
                        .toList(),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
