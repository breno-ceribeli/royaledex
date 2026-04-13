import 'package:flutter/material.dart';

import '../config/theme.dart';
import '../models/card.dart';
import '../utils/formatters.dart';

class CardWidget extends StatefulWidget {
  const CardWidget({super.key, required this.card, this.onTap});

  final CardModel card;
  final VoidCallback? onTap;

  @override
  State<CardWidget> createState() => _CardWidgetState();
}

class _CardWidgetState extends State<CardWidget> {
  static const _fadeDuration = Duration(milliseconds: 320);

  bool _isFading = false;
  int _activeVariantIndex = 0;

  List<String> get _variantImages {
    final variants = <String>[];

    void addVariant(String? url) {
      if (url == null || url.isEmpty || variants.contains(url)) {
        return;
      }
      variants.add(url);
    }

    addVariant(widget.card.iconUrls.medium);
    addVariant(widget.card.iconUrls.evolutionMedium);
    addVariant(widget.card.iconUrls.heroMedium);
    return variants;
  }

  String get _activeImageUrl {
    final variants = _variantImages;
    if (variants.isEmpty) {
      return widget.card.iconUrls.medium;
    }

    final normalizedIndex = _activeVariantIndex % variants.length;
    return variants[normalizedIndex];
  }

  Future<void> _advanceVariant() async {
    final variants = _variantImages;
    if (variants.length < 2 || _isFading) {
      return;
    }

    setState(() {
      _isFading = true;
    });

    await Future<void>.delayed(_fadeDuration);
    if (!mounted) {
      return;
    }

    setState(() {
      _activeVariantIndex = (_activeVariantIndex + 1) % variants.length;
      _isFading = false;
    });
  }

  void _handleInteraction() {
    _advanceVariant();
    widget.onTap?.call();
  }

  @override
  void didUpdateWidget(covariant CardWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.card.id != widget.card.id) {
      _isFading = false;
      _activeVariantIndex = 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final content = Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: RoyaleDexColors.surfaceHigh),
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF243B53), Color(0xFF1A2B3C)],
        ),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            top: -10,
            left: -10,
            child: Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: RoyaleDexColors.accent,
                border: Border.all(color: const Color(0xFF5E2391), width: 2),
              ),
              alignment: Alignment.center,
              child: Text(
                '${widget.card.elixirCost}',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 11,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 12, 10, 10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      color: RoyaleDexColors.surfaceLow,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: AnimatedOpacity(
                        duration: _fadeDuration,
                        opacity: _isFading ? 0 : 1,
                        child: Image.network(
                          _activeImageUrl,
                          fit: BoxFit.contain,
                          errorBuilder: (_, _, _) => const Icon(
                            Icons.image_not_supported_outlined,
                            color: RoyaleDexColors.textMuted,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  widget.card.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: RoyaleDexColors.textMain,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 6),
                Align(
                  alignment: Alignment.center,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(999),
                      color: RoyaleDexColors.background,
                    ),
                    child: Text(
                      formatRarityLabel(widget.card.rarity),
                      style: const TextStyle(
                        color: RoyaleDexColors.textMuted,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: _handleInteraction,
      child: content,
    );
  }
}
