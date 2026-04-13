import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../config/router.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../utils/formatters.dart';

class RoyaleNavbar extends StatefulWidget {
  const RoyaleNavbar({
    super.key,
    required this.title,
    this.subtitle,
    this.currentRoute,
    this.showSearch = true,
    this.showLogout = true,
    this.searchHint = 'Buscar jogador por tag (ex: #ABC123)',
    this.onSearch,
  });

  final String title;
  final String? subtitle;
  final String? currentRoute;
  final bool showSearch;
  final bool showLogout;
  final String searchHint;
  final ValueChanged<String>? onSearch;

  @override
  State<RoyaleNavbar> createState() => _RoyaleNavbarState();
}

class _RoyaleNavbarState extends State<RoyaleNavbar> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _submitSearch() {
    final normalizedTag = normalizeTagForRoute(_searchController.text);

    if (normalizedTag.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Informe uma tag valida para buscar.')),
      );
      return;
    }

    widget.onSearch?.call(normalizedTag);
    if (widget.onSearch == null) {
      context.go(AppRoutes.playerByTag(normalizedTag));
    }
    _searchController.clear();
  }

  Future<void> _handleLogout() async {
    await context.read<AuthProvider>().signOut();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    final navItems = <({String route, String label, IconData icon})>[
      (route: AppRoutes.home, label: 'Home', icon: Icons.home_rounded),
      (
        route: AppRoutes.cards,
        label: 'Cartas',
        icon: Icons.view_module_rounded,
      ),
      (
        route: AppRoutes.favorites,
        label: 'Favoritos',
        icon: Icons.star_rounded,
      ),
    ];

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: RoyaleDexColors.primary.withValues(alpha: 0.2),
        ),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1A2B3C), Color(0xFF102131)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              SvgPicture.asset('assets/icons/crown.svg', width: 26, height: 26),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.title,
                      style: const TextStyle(
                        color: RoyaleDexColors.textMain,
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    if (widget.subtitle != null)
                      Text(
                        widget.subtitle!,
                        style: const TextStyle(
                          color: RoyaleDexColors.textMuted,
                          fontSize: 12,
                        ),
                      ),
                  ],
                ),
              ),
              if (widget.showLogout && authProvider.isAuthenticated)
                IconButton(
                  onPressed: authProvider.isBusy ? null : _handleLogout,
                  icon: const Icon(Icons.logout_rounded),
                  color: RoyaleDexColors.textMuted,
                  tooltip: 'Sair',
                )
              else if (!authProvider.isAuthenticated)
                TextButton(
                  onPressed: () => context.go(AppRoutes.login),
                  child: const Text('Entrar'),
                ),
            ],
          ),
          const SizedBox(height: 10),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: navItems.map((item) {
                final isActive = widget.currentRoute == item.route;

                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    selected: isActive,
                    onSelected: (_) => context.go(item.route),
                    showCheckmark: false,
                    avatar: Icon(
                      item.icon,
                      size: 18,
                      color: isActive
                          ? RoyaleDexColors.background
                          : RoyaleDexColors.textMuted,
                    ),
                    label: Text(item.label),
                    selectedColor: RoyaleDexColors.primary,
                    backgroundColor: RoyaleDexColors.surfaceLow,
                    labelStyle: TextStyle(
                      color: isActive
                          ? RoyaleDexColors.background
                          : RoyaleDexColors.textMuted,
                      fontWeight: FontWeight.w700,
                    ),
                    side: BorderSide(
                      color: isActive
                          ? RoyaleDexColors.primary
                          : RoyaleDexColors.surfaceHigh,
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          if (widget.showSearch) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => _submitSearch(),
                    decoration: InputDecoration(
                      hintText: widget.searchHint,
                      prefixIcon: const Icon(Icons.search_rounded),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: _submitSearch,
                  child: const Text('Buscar'),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
