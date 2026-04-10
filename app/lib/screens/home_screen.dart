import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../config/router.dart';
import '../providers/auth_provider.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('RoyaleDex - Home'),
        actions: [
          if (authProvider.isAuthenticated)
            IconButton(
              onPressed: authProvider.isBusy
                  ? null
                  : () => context.read<AuthProvider>().signOut(),
              icon: const Icon(Icons.logout),
              tooltip: 'Sair',
            ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            authProvider.isAuthenticated
                ? 'Logado como ${authProvider.currentUser?.email ?? 'usuario'}'
                : 'Voce nao esta autenticado.',
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: () => context.go(AppRoutes.cards),
            child: const Text('Ir para /cards'),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () => context.go(AppRoutes.playerByTag('#2PYLQ')),
            child: const Text('Ir para /players/:tag'),
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: () => context.go(AppRoutes.favorites),
            child: const Text('Ir para /favorites (protegida)'),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: () => context.go(AppRoutes.login),
            child: const Text('Ir para /login'),
          ),
        ],
      ),
    );
  }
}
