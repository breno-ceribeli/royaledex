import 'package:flutter/material.dart';

class PlayerProfileScreen extends StatelessWidget {
  const PlayerProfileScreen({super.key, required this.tag});

  final String tag;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Perfil do Jogador')),
      body: Center(
        child: Text(
          'Tela de jogador (/players/:tag)\nTag: $tag',
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
