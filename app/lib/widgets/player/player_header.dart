import 'package:flutter/material.dart';

import '../../config/theme.dart';
import '../../models/player.dart';
import '../../utils/formatters.dart';

class PlayerHeader extends StatelessWidget {
  const PlayerHeader({
    super.key,
    required this.player,
    required this.isFavorite,
    required this.isBusy,
    required this.canToggleFavorite,
    required this.onToggleFavorite,
  });

  final PlayerProfile player;
  final bool isFavorite;
  final bool isBusy;
  final bool canToggleFavorite;
  final VoidCallback onToggleFavorite;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
        color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 62,
                height: 62,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: RoyaleDexColors.surfaceHigh),
                  color: RoyaleDexColors.surfaceHigh.withValues(alpha: 0.45),
                ),
                clipBehavior: Clip.antiAlias,
                child: Image.network(
                  player.currentFavouriteCard.iconUrls.medium,
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => const Icon(
                    Icons.shield_outlined,
                    color: RoyaleDexColors.textMuted,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      player.name,
                      style: const TextStyle(
                        color: RoyaleDexColors.textMain,
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      formatTag(player.tag),
                      style: const TextStyle(
                        color: RoyaleDexColors.primary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
              FilledButton.icon(
                onPressed: (isBusy || !canToggleFavorite)
                    ? null
                    : onToggleFavorite,
                icon: Icon(
                  isFavorite ? Icons.star_rounded : Icons.star_border_rounded,
                ),
                label: Text(isFavorite ? 'Salvo' : 'Favoritar'),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _StatChip(
                icon: Icons.emoji_events_rounded,
                value: '${player.trophies}',
                label: 'Troféus',
                color: RoyaleDexColors.primary,
              ),
              _StatChip(
                icon: Icons.workspace_premium_rounded,
                value: '${player.expLevel}',
                label: 'Nível',
                color: const Color(0xFFC993F8),
              ),
              _StatChip(
                icon: Icons.stadium_rounded,
                value: player.arena.name,
                label: 'Arena',
                color: const Color(0xFF93C5FD),
              ),
            ],
          ),
          if (player.clan != null) ...[
            const SizedBox(height: 10),
            Text(
              'Clã: ${player.clan!.name} (${player.clan!.tag})',
              style: const TextStyle(color: RoyaleDexColors.textMuted),
            ),
          ],
          if (!canToggleFavorite && !isFavorite) ...[
            const SizedBox(height: 8),
            const Text(
              'Limite de 15 favoritos atingido.',
              style: TextStyle(color: Color(0xFFFCA5A5)),
            ),
          ],
        ],
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  const _StatChip({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  final IconData icon;
  final String value;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        color: color.withValues(alpha: 0.14),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Text(
            value,
            style: TextStyle(color: color, fontWeight: FontWeight.w700),
          ),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: color.withValues(alpha: 0.85),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}
