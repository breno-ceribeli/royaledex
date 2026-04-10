import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../config/router.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleSignIn() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.signInWithEmailAndPassword(
      _emailController.text,
      _passwordController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(labelText: 'Email'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _passwordController,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Senha'),
          ),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: authProvider.isBusy ? null : _handleSignIn,
            child: const Text('Entrar'),
          ),
          const SizedBox(height: 12),
          OutlinedButton(
            onPressed: authProvider.isBusy
                ? null
                : () => authProvider.signInWithGoogle(),
            child: const Text('Entrar com Google'),
          ),
          const SizedBox(height: 20),
          if (authProvider.errorMessage != null)
            Text(
              authProvider.errorMessage!,
              style: const TextStyle(color: Colors.redAccent),
            ),
          if (authProvider.infoMessage != null)
            Text(
              authProvider.infoMessage!,
              style: const TextStyle(color: Colors.lightGreenAccent),
            ),
          const SizedBox(height: 20),
          TextButton(
            onPressed: () => context.go(AppRoutes.home),
            child: const Text('Voltar para Home'),
          ),
        ],
      ),
    );
  }
}
