import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../models/battle.dart';
import 'battle_card.dart';

class BattleLogSection extends StatefulWidget {
  const BattleLogSection({
    super.key,
    required this.battles,
    required this.playerTag,
  });

  final List<Battle> battles;
  final String playerTag;

  @override
  State<BattleLogSection> createState() => _BattleLogSectionState();
}

class _BattleLogSectionState extends State<BattleLogSection> {
  int _visibleCount = 6;

  @override
  Widget build(BuildContext context) {
    if (widget.battles.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: RoyaleDexColors.surfaceHigh),
          color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
        ),
        child: const Text(
          'Nenhuma batalha recente encontrada.',
          style: TextStyle(color: RoyaleDexColors.textMuted),
        ),
      );
    }

    final visibleBattles = widget.battles.take(_visibleCount).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ...visibleBattles.map(
          (battle) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: BattleCardTile(battle: battle, playerTag: widget.playerTag),
          ),
        ),
        if (_visibleCount < widget.battles.length)
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                setState(() {
                  _visibleCount += 5;
                });
              },
              child: Text(
                'Ver mais batalhas (${widget.battles.length - _visibleCount})',
              ),
            ),
          )
        else if (widget.battles.length > 6)
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                setState(() {
                  _visibleCount = 6;
                });
              },
              child: const Text('Mostrar menos'),
            ),
          ),
      ],
    );
  }
}
