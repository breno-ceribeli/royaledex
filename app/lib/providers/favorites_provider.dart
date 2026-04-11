import 'dart:collection';

import 'package:flutter/foundation.dart';

import '../models/favorite.dart';
import '../services/favorites_service.dart';
import '../utils/error_message_utils.dart';
import '../utils/tag_utils.dart';
import 'auth_provider.dart';

class FavoritesProvider extends ChangeNotifier {
  FavoritesProvider({FavoritesService? favoritesService})
    : _favoritesService = favoritesService ?? FavoritesService();

  final FavoritesService _favoritesService;

  AuthProvider? _authProvider;
  List<FavoritePlayer> _favoritePlayers = const [];
  bool _isLoading = false;
  bool _isBusy = false;
  bool _hasLoadedOnce = false;
  String? _errorMessage;
  String? _infoMessage;

  UnmodifiableListView<FavoritePlayer> get favoritePlayers =>
      UnmodifiableListView(_favoritePlayers);
  bool get isLoading => _isLoading;
  bool get isBusy => _isBusy;
  bool get hasLoadedOnce => _hasLoadedOnce;
  String? get errorMessage => _errorMessage;
  String? get infoMessage => _infoMessage;

  void bindAuth(AuthProvider authProvider) {
    if (identical(_authProvider, authProvider)) {
      return;
    }

    _authProvider?.removeListener(_handleAuthStateChanged);
    _authProvider = authProvider;
    _authProvider?.addListener(_handleAuthStateChanged);

    _handleAuthStateChanged();
  }

  void _handleAuthStateChanged() {
    final isAuthenticated = _authProvider?.isAuthenticated ?? false;

    if (!isAuthenticated) {
      final hadState =
          _favoritePlayers.isNotEmpty ||
          _errorMessage != null ||
          _infoMessage != null ||
          _hasLoadedOnce;

      _favoritePlayers = const [];
      _isLoading = false;
      _isBusy = false;
      _hasLoadedOnce = false;
      _errorMessage = null;
      _infoMessage = null;

      if (hadState) {
        notifyListeners();
      }

      return;
    }

    if (!_hasLoadedOnce && !_isLoading) {
      loadFavorites();
    }
  }

  Future<void> loadFavorites({bool forceRefresh = false}) async {
    if (_isLoading) {
      return;
    }

    if (!(_authProvider?.isAuthenticated ?? false)) {
      _errorMessage = 'Voce precisa estar autenticado para ver favoritos.';
      notifyListeners();
      return;
    }

    if (!forceRefresh && _hasLoadedOnce) {
      return;
    }

    _isLoading = true;
    _errorMessage = null;
    _infoMessage = null;
    notifyListeners();

    try {
      _favoritePlayers = await _favoritesService.getFavoritePlayers();
      _hasLoadedOnce = true;
    } catch (error) {
      _errorMessage = toUserFriendlyErrorMessage(error);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshFavorites() async {
    await loadFavorites(forceRefresh: true);
  }

  Future<void> addFavoritePlayer(String tag, {String? name}) async {
    await _runBusyAction(() async {
      final created = await _favoritesService.addFavoritePlayer(
        tag,
        name: name,
      );
      _upsertLocalFavorite(created);
      _infoMessage = 'Jogador adicionado aos favoritos.';
      _hasLoadedOnce = true;
    });
  }

  Future<void> removeFavoritePlayer(String tag) async {
    await _runBusyAction(() async {
      final normalized = requireValidPlayerTag(tag).toUpperCase();
      await _favoritesService.removeFavoritePlayer(normalized);
      _favoritePlayers = _favoritePlayers
          .where((item) => !_sameTag(item.tag, normalized))
          .toList();
      _infoMessage = 'Jogador removido dos favoritos.';
    });
  }

  Future<bool> checkFavoritePlayer(
    String tag, {
    bool preferLocalCache = true,
  }) async {
    final normalized = requireValidPlayerTag(tag);

    if (preferLocalCache &&
        _favoritePlayers.any((item) => _sameTag(item.tag, normalized))) {
      return true;
    }

    try {
      return await _favoritesService.checkFavoritePlayer(normalized);
    } catch (_) {
      return false;
    }
  }

  bool isFavoriteLocally(String tag) {
    final normalized = requireValidPlayerTag(tag);
    return _favoritePlayers.any((item) => _sameTag(item.tag, normalized));
  }

  void clearMessages() {
    _errorMessage = null;
    _infoMessage = null;
    notifyListeners();
  }

  Future<void> _runBusyAction(Future<void> Function() action) async {
    if (_isBusy) {
      return;
    }

    _isBusy = true;
    _errorMessage = null;
    _infoMessage = null;
    notifyListeners();

    try {
      await action();
    } catch (error) {
      _errorMessage = toUserFriendlyErrorMessage(error);
    } finally {
      _isBusy = false;
      notifyListeners();
    }
  }

  void _upsertLocalFavorite(FavoritePlayer player) {
    final normalized = requireValidPlayerTag(player.tag);

    _favoritePlayers = [
      player,
      ..._favoritePlayers.where((item) => !_sameTag(item.tag, normalized)),
    ];
  }

  bool _sameTag(String left, String right) {
    return requireValidPlayerTag(left).toUpperCase() ==
        requireValidPlayerTag(right).toUpperCase();
  }

  @override
  void dispose() {
    _authProvider?.removeListener(_handleAuthStateChanged);
    super.dispose();
  }
}
