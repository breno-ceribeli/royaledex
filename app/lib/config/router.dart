import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../providers/auth_provider.dart';
import '../screens/cards_screen.dart';
import '../screens/favorites_screen.dart';
import '../screens/home_screen.dart';
import '../screens/login_screen.dart';
import '../screens/player_profile_screen.dart';

abstract final class AppRoutes {
  static const login = '/login';
  static const home = '/';
  static const cards = '/cards';
  static const players = '/players';
  static const favorites = '/favorites';

  static String playerByTag(String tag) {
    return '$players/${Uri.encodeComponent(tag)}';
  }
}

abstract final class AppRouter {
  static GoRouter create(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: AppRoutes.home,
      refreshListenable: authProvider,
      redirect: (context, state) {
        if (authProvider.isLoadingSession) {
          return null;
        }

        final isOnLogin = state.matchedLocation == AppRoutes.login;
        final requiresAuth = state.matchedLocation == AppRoutes.favorites;

        if (!authProvider.isAuthenticated && requiresAuth) {
          final from = Uri.encodeComponent(state.uri.toString());
          return '${AppRoutes.login}?from=$from';
        }

        if (authProvider.isAuthenticated && isOnLogin) {
          final from = state.uri.queryParameters['from'];
          if (from != null && from.isNotEmpty) {
            return from;
          }
          return AppRoutes.home;
        }

        return null;
      },
      routes: [
        GoRoute(
          path: AppRoutes.login,
          name: 'login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: AppRoutes.home,
          name: 'home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: AppRoutes.cards,
          name: 'cards',
          builder: (context, state) => const CardsScreen(),
        ),
        GoRoute(
          path: '${AppRoutes.players}/:tag',
          name: 'player-profile',
          builder: (context, state) {
            final rawTag = state.pathParameters['tag'] ?? '';
            final tag = Uri.decodeComponent(rawTag);
            return PlayerProfileScreen(tag: tag);
          },
        ),
        GoRoute(
          path: AppRoutes.favorites,
          name: 'favorites',
          builder: (context, state) => const FavoritesScreen(),
        ),
      ],
      errorBuilder: (context, state) {
        return Scaffold(
          appBar: AppBar(title: const Text('Pagina nao encontrada')),
          body: Center(
            child: Text(
              '404 - Rota nao encontrada: ${state.uri.path}',
              textAlign: TextAlign.center,
            ),
          ),
        );
      },
    );
  }
}
