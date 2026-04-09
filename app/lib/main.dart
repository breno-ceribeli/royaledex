import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');

  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  runApp(
    ChangeNotifierProvider(create: (_) => AuthProvider(), child: const MyApp()),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RoyaleDex',
      debugShowCheckedModeBanner: false,
      theme: RoyaleDexTheme.darkTheme,
      home: const _AuthBootstrapScreen(),
    );
  }
}

class _AuthBootstrapScreen extends StatelessWidget {
  const _AuthBootstrapScreen();

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    if (authProvider.isLoadingSession) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (!authProvider.isAuthenticated) {
      return const Scaffold(
        body: Center(child: Text('RoyaleDex - usuario nao autenticado')),
      );
    }

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'RoyaleDex - logado como ${authProvider.user?.email ?? "usuario"}',
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: authProvider.isBusy
                  ? null
                  : () => context.read<AuthProvider>().logout(),
              child: const Text('Sair'),
            ),
          ],
        ),
      ),
    );
  }
}
