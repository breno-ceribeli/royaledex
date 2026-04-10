import '../models/favorite.dart';
import '../services/api_service.dart';
import '../utils/http_payload_utils.dart';
import '../utils/json_utils.dart';
import '../utils/tag_utils.dart';

class FavoritesService {
  FavoritesService({ApiService? apiService})
    : _apiService = apiService ?? ApiService();

  final ApiService _apiService;

  Future<List<FavoritePlayer>> getFavoritePlayers() async {
    final payload = await _apiService.get('/favorites/players');
    final json = expectJsonList(payload, context: 'GET /favorites/players');

    return json
        .map(
          (item) => FavoritePlayer.fromJson(
            expectJsonMap(item, context: 'favorite player item'),
          ),
        )
        .toList();
  }

  Future<FavoritePlayer> addFavoritePlayer(String tag, {String? name}) async {
    final normalizedTag = requireValidPlayerTag(tag);
    final request = AddFavoritePlayerRequest(
      tag: normalizedTag,
      name: (name == null || name.trim().isEmpty) ? normalizedTag : name.trim(),
    );

    final payload = await _apiService.post(
      '/favorites/players',
      body: request.toJson(),
    );

    final json = expectJsonMap(payload, context: 'POST /favorites/players');
    return FavoritePlayer.fromJson(json);
  }

  Future<void> removeFavoritePlayer(String tag) async {
    final normalizedTag = requireValidPlayerTag(tag);
    await _apiService.delete('/favorites/players/$normalizedTag');
  }

  Future<bool> checkFavoritePlayer(String tag) async {
    final normalizedTag = requireValidPlayerTag(tag);
    final payload = await _apiService.get(
      '/favorites/players/$normalizedTag/check',
    );
    final json = expectJsonMap(
      payload,
      context: 'GET /favorites/players/:tag/check',
    );
    return jsonBoolOrNull(json['isFavorite']) ?? false;
  }
}
