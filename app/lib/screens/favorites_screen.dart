import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../config/router.dart';
import '../config/theme.dart';
import '../providers/favorites_provider.dart';
import '../providers/auth_provider.dart';
import '../utils/formatters.dart';
import '../widgets/empty_state.dart';
import '../widgets/error_widget.dart';
import '../widgets/loading_skeleton.dart';
import '../widgets/navbar.dart';
import '../widgets/royale_background.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) {
        return;
      }

      final favoritesProvider = context.read<FavoritesProvider>();
      if (!favoritesProvider.hasLoadedOnce && !favoritesProvider.isLoading) {
        favoritesProvider.loadFavorites();
      }
    });
  }

  Future<void> _removeFavorite(String tag) async {
    final favoritesProvider = context.read<FavoritesProvider>();
    await favoritesProvider.removeFavoritePlayer(tag);

    if (!mounted) {
      return;
    }

    if (favoritesProvider.errorMessage != null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(favoritesProvider.errorMessage!)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final favoritesProvider = context.watch<FavoritesProvider>();

    final favoritePlayers = favoritesProvider.favoritePlayers;

    return Scaffold(
      body: RoyaleBackground(
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: favoritesProvider.refreshFavorites,
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              children: [
                RoyaleNavbar(
                  title: 'Favoritos',
                  subtitle: 'Acompanhe seus jogadores salvos',
                  currentRoute: AppRoutes.favorites,
                  showSearch: false,
                  showLogout: authProvider.isAuthenticated,
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: RoyaleDexColors.surfaceHigh),
                    color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
                  ),
                  child: Text(
                    'Slots usados: ${favoritePlayers.length} / 15',
                    style: const TextStyle(
                      color: RoyaleDexColors.textMain,
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                if (favoritesProvider.isLoading)
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: 4,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (_, _) => const LoadingSkeleton(height: 88),
                  )
                else if (favoritesProvider.errorMessage != null)
                  FriendlyErrorWidget(
                    message: favoritesProvider.errorMessage!,
                    onRetry: favoritesProvider.refreshFavorites,
                  )
                else if (favoritePlayers.isEmpty)
                  EmptyState(
                    title: 'Sem jogadores salvos',
                    message:
                        'Abra o perfil de um jogador e toque em favoritar para acompanhar aqui.',
                    icon: Icons.star_border_rounded,
                    actionLabel: 'Buscar jogador',
                    onAction: () => context.go(AppRoutes.home),
                  )
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: favoritePlayers.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 10),
                    itemBuilder: (context, index) {
                      final player = favoritePlayers[index];
                      return _FavoriteTile(
                        name: player.name,
                        tag: player.tag,
                        subtitle:
                            'Adicionado em ${formatFavoriteAddedAt(player.addedAt)}',
                        busy: favoritesProvider.isBusy,
                        onOpen: () {
                          context.go(AppRoutes.playerByTag(player.tag));
                        },
                        onRemove: () => _removeFavorite(player.tag),
                      );
                    },
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FavoriteTile extends StatelessWidget {
  const _FavoriteTile({
    required this.name,
    required this.tag,
    required this.subtitle,
    required this.busy,
    required this.onOpen,
    required this.onRemove,
  });

  final String name;
  final String tag;
  final String subtitle;
  final bool busy;
  final VoidCallback onOpen;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onOpen,
        child: Ink(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: RoyaleDexColors.surfaceHigh),
            color: RoyaleDexColors.surfaceLow.withValues(alpha: 0.9),
          ),
          child: Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: RoyaleDexColors.primary.withValues(alpha: 0.18),
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.person_search_rounded,
                  color: RoyaleDexColors.primary,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: RoyaleDexColors.textMain,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      formatTag(tag),
                      style: const TextStyle(
                        color: RoyaleDexColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: RoyaleDexColors.textMuted,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: busy ? null : onRemove,
                icon: const Icon(Icons.delete_outline_rounded),
                color: const Color(0xFFFCA5A5),
                tooltip: 'Remover',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
