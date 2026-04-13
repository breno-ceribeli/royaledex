import 'package:flutter/material.dart';

import '../config/router.dart';
import '../config/theme.dart';
import '../models/card.dart';
import '../services/cards_service.dart';
import '../utils/formatters.dart';
import '../widgets/card_widget.dart';
import '../widgets/empty_state.dart';
import '../widgets/error_widget.dart';
import '../widgets/loading_skeleton.dart';
import '../widgets/navbar.dart';
import '../widgets/royale_background.dart';

class CardsScreen extends StatefulWidget {
  const CardsScreen({super.key});

  @override
  State<CardsScreen> createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  final CardsService _cardsService = CardsService();
  late Future<List<CardModel>> _cardsFuture;

  int? _elixirFilter;
  String _rarityFilter = 'Todas';

  @override
  void initState() {
    super.initState();
    _cardsFuture = _cardsService.getCards();
  }

  Future<void> _refreshCards() async {
    setState(() {
      _cardsFuture = _cardsService.getCards();
    });

    await _cardsFuture;
  }

  List<CardModel> _applyFilters(List<CardModel> cards) {
    var filtered = cards;

    if (_elixirFilter != null && _elixirFilter! > 0) {
      filtered = filtered
          .where((card) => card.elixirCost == _elixirFilter)
          .toList();
    }

    if (_rarityFilter != 'Todas') {
      filtered = filtered
          .where(
            (card) => card.rarity.toLowerCase() == _rarityFilter.toLowerCase(),
          )
          .toList();
    }

    filtered.sort((left, right) => left.name.compareTo(right.name));
    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RoyaleBackground(
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: _refreshCards,
            child: ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              children: [
                const RoyaleNavbar(
                  title: 'Biblioteca de Cartas',
                  subtitle: 'Filtre por elixir e raridade',
                  currentRoute: AppRoutes.cards,
                ),
                const SizedBox(height: 14),
                FutureBuilder<List<CardModel>>(
                  future: _cardsFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return _CardsLoadingState();
                    }

                    if (snapshot.hasError) {
                      return FriendlyErrorWidget(
                        message: 'Nao foi possivel carregar cartas agora.',
                        onRetry: () {
                          setState(() {
                            _cardsFuture = _cardsService.getCards();
                          });
                        },
                      );
                    }

                    final cards = snapshot.data ?? const <CardModel>[];
                    final elixirOptions =
                        cards
                            .map((card) => card.elixirCost)
                            .where((elixir) => elixir > 0)
                            .toSet()
                            .toList()
                          ..sort();
                    final rarityOptions =
                        cards.map((card) => card.rarity).toSet().toList()..sort(
                          (left, right) => formatRarityLabel(
                            left,
                          ).compareTo(formatRarityLabel(right)),
                        );

                    final filteredCards = _applyFilters(cards);

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: RoyaleDexColors.surfaceHigh,
                            ),
                            color: RoyaleDexColors.surfaceLow.withValues(
                              alpha: 0.9,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Filtro por elixir',
                                style: TextStyle(
                                  color: RoyaleDexColors.textMuted,
                                  fontSize: 12,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: [
                                  ChoiceChip(
                                    selected: _elixirFilter == null,
                                    onSelected: (_) {
                                      setState(() {
                                        _elixirFilter = null;
                                      });
                                    },
                                    label: const Text('Todos'),
                                  ),
                                  ...elixirOptions.map((elixir) {
                                    return ChoiceChip(
                                      selected: _elixirFilter == elixir,
                                      onSelected: (_) {
                                        setState(() {
                                          _elixirFilter = elixir;
                                        });
                                      },
                                      label: Text('$elixir'),
                                    );
                                  }),
                                ],
                              ),
                              const SizedBox(height: 12),
                              DropdownButtonFormField<String>(
                                initialValue: _rarityFilter,
                                decoration: const InputDecoration(
                                  labelText: 'Raridade',
                                ),
                                items:
                                    rarityOptions
                                        .map(
                                          (rarity) => DropdownMenuItem<String>(
                                            value: rarity,
                                            child: Text(
                                              formatRarityLabel(rarity),
                                            ),
                                          ),
                                        )
                                        .toList()
                                      ..insert(
                                        0,
                                        const DropdownMenuItem<String>(
                                          value: 'Todas',
                                          child: Text('Todas'),
                                        ),
                                      ),
                                onChanged: (value) {
                                  if (value == null) {
                                    return;
                                  }
                                  setState(() {
                                    _rarityFilter = value;
                                  });
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          '${filteredCards.length} carta(s) encontrada(s)',
                          style: const TextStyle(
                            color: RoyaleDexColors.textMuted,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 12),
                        if (filteredCards.isEmpty)
                          const EmptyState(
                            title: 'Nenhuma carta encontrada',
                            message:
                                'Tente outros filtros para localizar cartas.',
                            icon: Icons.filter_alt_off_rounded,
                          )
                        else
                          GridView.builder(
                            itemCount: filteredCards.length,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  crossAxisSpacing: 10,
                                  mainAxisSpacing: 10,
                                  childAspectRatio: 0.72,
                                ),
                            itemBuilder: (context, index) {
                              return CardWidget(card: filteredCards[index]);
                            },
                          ),
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

class _CardsLoadingState extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      itemCount: 8,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 0.72,
      ),
      itemBuilder: (_, _) => const LoadingSkeleton(height: 210),
    );
  }
}
