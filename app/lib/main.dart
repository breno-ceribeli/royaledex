import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'config/router.dart';
import 'config/theme.dart';
import 'providers/favorites_provider.dart';
import 'providers/auth_provider.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');

  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProxyProvider<AuthProvider, FavoritesProvider>(
          create: (_) => FavoritesProvider(),
          update: (_, authProvider, favoritesProvider) {
            final resolvedProvider = favoritesProvider ?? FavoritesProvider();
            resolvedProvider.bindAuth(authProvider);
            return resolvedProvider;
          },
        ),
        Provider<GoRouter>(
          create: (context) => AppRouter.create(context.read<AuthProvider>()),
          dispose: (context, router) => router.dispose(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = context.read<GoRouter>();

    return MaterialApp.router(
      title: 'RoyaleDex',
      debugShowCheckedModeBanner: false,
      theme: RoyaleDexTheme.darkTheme,
      routerConfig: router,
    );
  }
}
