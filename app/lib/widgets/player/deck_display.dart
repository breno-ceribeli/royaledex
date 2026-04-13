import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../models/battle.dart';
import '../../models/player.dart';

class DeckCardData {
  const DeckCardData({
    required this.id,
    required this.name,
    required this.elixirCost,
    required this.iconUrl,
  });

  final int id;
  final String name;
  final int elixirCost;
  final String iconUrl;

  factory DeckCardData.fromPlayerCard(PlayerCard card) {
    return DeckCardData(
      id: card.id,
      name: card.name,
      elixirCost: card.elixirCost,
      iconUrl: card.iconUrls.medium,
    );
  }

  factory DeckCardData.fromBattleCard(BattleCard card) {
    return DeckCardData(
      id: card.id,
      name: card.name,
      elixirCost: card.elixirCost,
      iconUrl: card.iconUrls.medium,
    );
  }
}

class DeckDisplay extends StatelessWidget {
  const DeckDisplay({
    super.key,
    required this.cards,
    this.title,
    this.columns = 4,
  });

  final List<DeckCardData> cards;
  final String? title;
  final int columns;

  @override
  Widget build(BuildContext context) {
    if (cards.isEmpty) {
      return const Text(
        'Sem informações de deck.',
        style: TextStyle(color: RoyaleDexColors.textMuted),
      );
    }

    final averageElixir =
        cards.fold<int>(0, (sum, card) => sum + card.elixirCost) / cards.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null)
          Row(
            children: [
              Expanded(
                child: Text(
                  title!,
                  style: const TextStyle(
                    color: RoyaleDexColors.textMain,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
              Text(
                'Elixir médio: ${averageElixir.toStringAsFixed(1)}',
                style: const TextStyle(
                  color: RoyaleDexColors.primary,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        if (title != null) const SizedBox(height: 8),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: cards.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: columns,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            childAspectRatio: 0.78,
          ),
          itemBuilder: (context, index) {
            final card = cards[index];

            return Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: RoyaleDexColors.primary.withValues(alpha: 0.18),
                ),
                color: const Color(0xAA111F2C),
              ),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Positioned(
                    left: -6,
                    top: -6,
                    child: Container(
                      width: 22,
                      height: 22,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: RoyaleDexColors.accent,
                        border: Border.all(color: const Color(0xFF5E2391)),
                      ),
                      child: Text(
                        '${card.elixirCost}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(6, 8, 6, 6),
                    child: Column(
                      children: [
                        Expanded(
                          child: Center(
                            child: Image.network(
                              card.iconUrl,
                              fit: BoxFit.contain,
                              errorBuilder: (_, _, _) => const Icon(
                                Icons.image_not_supported_outlined,
                                color: RoyaleDexColors.textMuted,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        SizedBox(
                          height: 24,
                          child: Text(
                            card.name,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: RoyaleDexColors.textMain,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              height: 1.1,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
