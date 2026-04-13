import 'package:flutter/material.dart';

import '../config/theme.dart';

class FriendlyErrorWidget extends StatelessWidget {
  const FriendlyErrorWidget({
    super.key,
    required this.message,
    this.title = 'Algo deu errado',
    this.onRetry,
  });

  final String message;
  final String title;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: RoyaleDexColors.danger.withValues(alpha: 0.5),
        ),
        color: const Color(0xFF3A151A),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.error_outline_rounded, color: Color(0xFFFCA5A5)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: Color(0xFFFECACA),
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            message,
            style: const TextStyle(color: Color(0xFFFECACA), height: 1.35),
          ),
          if (onRetry != null) ...[
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Tentar novamente'),
            ),
          ],
        ],
      ),
    );
  }
}
