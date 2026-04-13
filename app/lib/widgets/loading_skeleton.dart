import 'package:flutter/material.dart';

import '../config/theme.dart';

class LoadingSkeleton extends StatefulWidget {
  const LoadingSkeleton({
    super.key,
    this.width = double.infinity,
    required this.height,
    this.borderRadius = 14,
    this.margin,
  });

  final double width;
  final double height;
  final double borderRadius;
  final EdgeInsetsGeometry? margin;

  @override
  State<LoadingSkeleton> createState() => _LoadingSkeletonState();
}

class _LoadingSkeletonState extends State<LoadingSkeleton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  )..repeat();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      margin: widget.margin,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: RoyaleDexColors.surfaceLow,
        borderRadius: BorderRadius.circular(widget.borderRadius),
      ),
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return FractionallySizedBox(
            widthFactor: 0.35,
            alignment: Alignment(-1 + (_controller.value * 2), 0),
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.transparent,
                    Colors.white.withValues(alpha: 0.15),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
