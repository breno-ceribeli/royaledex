import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Favoritos')),
      body: Center(
        child: Text(
          'Tela protegida (/favorites)\nUsuario: ${authProvider.currentUser?.email ?? 'desconhecido'}',
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
