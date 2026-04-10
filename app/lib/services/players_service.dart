import '../models/battle.dart';
import '../models/player.dart';
import '../services/api_service.dart';
import '../utils/http_payload_utils.dart';
import '../utils/tag_utils.dart';

class PlayersService {
  PlayersService({ApiService? apiService})
    : _apiService = apiService ?? ApiService();

  final ApiService _apiService;

  Future<PlayerProfile> getPlayer(String tag) async {
    final normalizedTag = requireValidPlayerTag(tag);
    final payload = await _apiService.get('/players/$normalizedTag');
    final json = expectJsonMap(payload, context: 'GET /players/:tag');
    return PlayerProfile.fromJson(json);
  }

  Future<BattleLog> getBattleLog(String tag) async {
    final normalizedTag = requireValidPlayerTag(tag);
    final payload = await _apiService.get('/players/$normalizedTag/battlelog');
    final json = expectJsonList(
      payload,
      context: 'GET /players/:tag/battlelog',
    );
    return Battle.listFromJson(json);
  }

  Future<BattleLogStats> getBattleStats(String tag) async {
    final normalizedTag = requireValidPlayerTag(tag);
    final payload = await _apiService.get(
      '/players/$normalizedTag/battlelog/stats',
    );
    final json = expectJsonMap(
      payload,
      context: 'GET /players/:tag/battlelog/stats',
    );
    return BattleLogStats.fromJson(json);
  }
}
