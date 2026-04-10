import '../models/card.dart';
import '../services/api_service.dart';
import '../utils/http_payload_utils.dart';

class CardsService {
  CardsService({ApiService? apiService})
    : _apiService = apiService ?? ApiService();

  final ApiService _apiService;

  Future<List<CardModel>> getCards() async {
    final cardsResponse = await getCardsResponse();
    return cardsResponse.items;
  }

  Future<CardsResponse> getCardsResponse() async {
    final payload = await _apiService.get('/cards');
    final json = expectJsonMap(payload, context: 'GET /cards');
    return CardsResponse.fromJson(json);
  }
}
