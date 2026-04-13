import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../config/router.dart';
import '../config/theme.dart';
import '../models/battle.dart';
import '../models/card.dart';
import '../models/player.dart';
import '../providers/auth_provider.dart';
import '../providers/favorites_provider.dart';
import '../services/cards_service.dart';
import '../services/players_service.dart';
import '../utils/error_message_utils.dart';
import '../utils/formatters.dart';
import '../utils/tag_utils.dart';
import '../widgets/error_widget.dart';
import '../widgets/loading_skeleton.dart';
import '../widgets/navbar.dart';
import '../widgets/player/player_analysis.dart';
import '../widgets/player/battle_log.dart';
import '../widgets/player/player_header.dart';
import '../widgets/player/player_stats.dart';
import '../widgets/royale_background.dart';

class PlayerProfileScreen extends StatefulWidget {
  const PlayerProfileScreen({super.key, required this.tag});

  final String tag;

  @override
  State<PlayerProfileScreen> createState() => _PlayerProfileScreenState();
}

enum _PlayerTab { overview, analysis, battles }

class _PlayerProfileScreenState extends State<PlayerProfileScreen> {
  final PlayersService _playersService = PlayersService();
  final CardsService _cardsService = CardsService();
  late Future<_PlayerScreenPayload> _payloadFuture;
  _PlayerTab _activeTab = _PlayerTab.overview;

  @override
  void initState() {
    super.initState();
    _payloadFuture = _loadPayload();
  }

  Future<_PlayerScreenPayload> _loadPayload() async {
    final normalizedTag = requireValidPlayerTag(widget.tag);
    final player = await _playersService.getPlayer(normalizedTag);

    List<Battle> battles = const [];
    List<CardModel> cardsCatalog = const [];
    BattleLogStats? stats;
    String? battlesError;
    String? statsError;
    String? cardsError;

    try {
      battles = await _playersService.getBattleLog(normalizedTag);
    } catch (error) {
      battlesError = toUserFriendlyErrorMessage(error);
    }

    try {
      stats = await _playersService.getBattleStats(normalizedTag);
    } catch (error) {
      statsError = toUserFriendlyErrorMessage(error);
    }

    try {
      cardsCatalog = await _cardsService.getCards();
    } catch (error) {
      cardsError = toUserFriendlyErrorMessage(error);
    }

    return _PlayerScreenPayload(
      player: player,
      battles: battles,
      cardsCatalog: cardsCatalog,
      stats: stats,
      battlesError: battlesError,
      statsError: statsError,
      cardsError: cardsError,
    );
  }

  static const _tabOrder = <_PlayerTab>[
    _PlayerTab.overview,
    _PlayerTab.analysis,
    _PlayerTab.battles,
  ];

  String _tabLabel(_PlayerTab tab) {
    switch (tab) {
      case _PlayerTab.overview:
        return 'Visão geral';
      case _PlayerTab.analysis:
        return 'Análise';
      case _PlayerTab.battles:
        return 'Batalhas';
    }
  }

  void _changeTabByOffset(int offset) {
    final currentIndex = _tabOrder.indexOf(_activeTab);
    final nextIndex = (currentIndex + offset) % _tabOrder.length;
    setState(() {
      _activeTab = _tabOrder[nextIndex < 0 ? _tabOrder.length - 1 : nextIndex];
    });
  }

  Future<void> _openTabPicker() async {
    final selected = await showModalBottomSheet<_PlayerTab>(
      context: context,
      backgroundColor: RoyaleDexColors.surfaceLow,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Trocar seção',
                style: TextStyle(
                  color: RoyaleDexColors.textMain,
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 10),
              ..._tabOrder.map((tab) {
                final selected = tab == _activeTab;
                return ListTile(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  tileColor: selected
                      ? RoyaleDexColors.primary.withValues(alpha: 0.15)
                      : Colors.transparent,
                  title: Text(
                    _tabLabel(tab),
                    style: TextStyle(
                      color: selected
                          ? RoyaleDexColors.primary
                          : RoyaleDexColors.textMain,
                      fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                    ),
                  ),
                  trailing: selected
                      ? const Icon(
                          Icons.check_circle_rounded,
                          color: RoyaleDexColors.primary,
                        )
                      : null,
                  onTap: () => Navigator.of(context).pop(tab),
                );
              }),
            ],
          ),
        );
      },
    );

    if (selected != null && selected != _activeTab) {
      setState(() {
        _activeTab = selected;
      });
    }
  }

  Future<void> _refresh() async {
    setState(() {
      _payloadFuture = _loadPayload();
    });

    await _payloadFuture;
  }

  Future<void> _toggleFavorite(PlayerProfile player) async {
    final authProvider = context.read<AuthProvider>();
    final favoritesProvider = context.read<FavoritesProvider>();

    if (!authProvider.isAuthenticated) {
      final from = Uri.encodeComponent(AppRoutes.playerByTag(player.tag));
      context.go('${AppRoutes.login}?from=$from');
      return;
    }

    final isFavorite = favoritesProvider.isFavoriteLocally(player.tag);
    if (isFavorite) {
      await favoritesProvider.removeFavoritePlayer(player.tag);
    } else {
      await favoritesProvider.addFavoritePlayer(player.tag, name: player.name);
    }

    if (!mounted) {
      return;
    }

    final message =
        favoritesProvider.errorMessage ?? favoritesProvider.infoMessage;
    if (message != null && message.isNotEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(message)));
      favoritesProvider.clearMessages();
    }
  }

  @override
  Widget build(BuildContext context) {
    final favoritesProvider = context.watch<FavoritesProvider>();

    return Scaffold(
      body: RoyaleBackground(
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: _refresh,
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              children: [
                RoyaleNavbar(
                  title: 'Jogador ${formatTag(widget.tag)}',
                  subtitle: 'Perfil, análise e batalhas',
                  currentRoute: null,
                ),
                const SizedBox(height: 14),
                FutureBuilder<_PlayerScreenPayload>(
                  future: _payloadFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const _PlayerLoadingState();
                    }

                    if (snapshot.hasError || snapshot.data == null) {
                      return FriendlyErrorWidget(
                        message:
                            'Não foi possível carregar o perfil deste jogador. Verifique a tag e tente novamente.',
                        onRetry: _refresh,
                      );
                    }

                    final payload = snapshot.data!;
                    final player = payload.player;

                    final isFavorite = favoritesProvider.isFavoriteLocally(
                      player.tag,
                    );
                    final canToggleFavorite =
                        favoritesProvider.favoritePlayers.length < 15 ||
                        isFavorite;

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        PlayerHeader(
                          player: player,
                          isFavorite: isFavorite,
                          isBusy: favoritesProvider.isBusy,
                          canToggleFavorite: canToggleFavorite,
                          onToggleFavorite: () => _toggleFavorite(player),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: RoyaleDexColors.surfaceHigh,
                            ),
                            color: RoyaleDexColors.surfaceLow.withValues(
                              alpha: 0.9,
                            ),
                          ),
                          child: Row(
                            children: [
                              IconButton(
                                onPressed: () => _changeTabByOffset(-1),
                                icon: const Icon(Icons.chevron_left_rounded),
                                color: RoyaleDexColors.textMuted,
                                tooltip: 'Aba anterior',
                              ),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: _openTabPicker,
                                  icon: const Icon(Icons.layers_rounded),
                                  label: Text(_tabLabel(_activeTab)),
                                ),
                              ),
                              IconButton(
                                onPressed: () => _changeTabByOffset(1),
                                icon: const Icon(Icons.chevron_right_rounded),
                                color: RoyaleDexColors.textMuted,
                                tooltip: 'Próxima aba',
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        if (_activeTab == _PlayerTab.overview) ...[
                          if (payload.statsError != null)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: FriendlyErrorWidget(
                                title: 'Falha ao carregar estatísticas',
                                message: payload.statsError!,
                              ),
                            ),
                          PlayerStats(
                            player: player,
                            battleStats: payload.stats,
                          ),
                        ] else if (_activeTab == _PlayerTab.analysis) ...[
                          PlayerAnalysis(
                            playerTag: player.tag,
                            battleStats: payload.stats,
                            statsError: payload.statsError,
                            battles: payload.battles,
                            battlesError: payload.battlesError,
                            allCards: payload.cardsCatalog,
                            cardsError: payload.cardsError,
                          ),
                        ] else ...[
                          if (payload.battlesError != null)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: FriendlyErrorWidget(
                                title: 'Falha ao carregar batalhas',
                                message: payload.battlesError!,
                              ),
                            ),
                          BattleLogSection(
                            battles: payload.battles,
                            playerTag: player.tag,
                          ),
                        ],
                      ],
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

class _PlayerLoadingState extends StatelessWidget {
  const _PlayerLoadingState();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        LoadingSkeleton(height: 170),
        SizedBox(height: 10),
        LoadingSkeleton(height: 56),
        SizedBox(height: 10),
        LoadingSkeleton(height: 120),
        SizedBox(height: 10),
        LoadingSkeleton(height: 120),
      ],
    );
  }
}

class _PlayerScreenPayload {
  const _PlayerScreenPayload({
    required this.player,
    required this.battles,
    required this.cardsCatalog,
    required this.stats,
    required this.battlesError,
    required this.statsError,
    required this.cardsError,
  });

  final PlayerProfile player;
  final List<Battle> battles;
  final List<CardModel> cardsCatalog;
  final BattleLogStats? stats;
  final String? battlesError;
  final String? statsError;
  final String? cardsError;
}
