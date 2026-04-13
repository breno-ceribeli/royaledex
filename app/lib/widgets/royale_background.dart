import 'package:flutter/material.dart';

import '../config/theme.dart';

class RoyaleBackground extends StatelessWidget {
  const RoyaleBackground({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [RoyaleDexColors.background, RoyaleDexColors.backgroundDeep],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -120,
            left: -80,
            child: _GlowCircle(
              size: 300,
              color: RoyaleDexColors.primary.withValues(alpha: 0.08),
            ),
          ),
          Positioned(
            top: 120,
            right: -100,
            child: _GlowCircle(
              size: 260,
              color: RoyaleDexColors.accent.withValues(alpha: 0.12),
            ),
          ),
          Positioned.fill(child: child),
        ],
      ),
    );
  }
}

class _GlowCircle extends StatelessWidget {
  const _GlowCircle({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [color, Colors.transparent],
            stops: const [0.0, 1.0],
          ),
        ),
      ),
    );
  }
}
