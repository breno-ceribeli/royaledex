import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../config/router.dart';
import '../config/theme.dart';
import '../widgets/navbar.dart';
import '../widgets/royale_background.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RoyaleBackground(
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
            children: [
              const RoyaleNavbar(
                title: 'RoyaleDex',
                subtitle: 'Estatisticas, batalhas e favoritos',
                currentRoute: AppRoutes.home,
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: RoyaleDexColors.primary.withValues(alpha: 0.2),
                  ),
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF172A3B), Color(0xFF0E1D2C)],
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Domine a Arena',
                      style: TextStyle(
                        color: RoyaleDexColors.textMain,
                        fontSize: 27,
                        fontWeight: FontWeight.w800,
                        height: 1.1,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Pesquise jogadores por tag no topo e acesse cartas ou favoritos rapidamente.',
                      style: TextStyle(
                        color: RoyaleDexColors.textMuted,
                        height: 1.35,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Wrap(
                      spacing: 10,
                      runSpacing: 10,
                      children: [
                        FilledButton.icon(
                          onPressed: () => context.go(AppRoutes.cards),
                          icon: const Icon(Icons.auto_awesome_mosaic_rounded),
                          label: const Text('Explorar cartas'),
                        ),
                        OutlinedButton.icon(
                          onPressed: () => context.go(AppRoutes.favorites),
                          icon: const Icon(Icons.star_rounded),
                          label: const Text('Abrir favoritos'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
