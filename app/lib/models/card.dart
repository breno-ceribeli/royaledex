import '../utils/json_utils.dart';

class CardIconUrls {
  const CardIconUrls({
    required this.medium,
    this.heroMedium,
    this.evolutionMedium,
  });

  final String medium;
  final String? heroMedium;
  final String? evolutionMedium;

  factory CardIconUrls.fromJson(Map<String, dynamic> json) {
    return CardIconUrls(
      medium: jsonString(json['medium']),
      heroMedium: jsonStringOrNull(json['heroMedium']),
      evolutionMedium: jsonStringOrNull(json['evolutionMedium']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'medium': medium,
      if (heroMedium != null) 'heroMedium': heroMedium,
      if (evolutionMedium != null) 'evolutionMedium': evolutionMedium,
    };
  }
}

class CardModel {
  const CardModel({
    required this.name,
    required this.id,
    required this.maxLevel,
    required this.maxEvolutionLevel,
    required this.elixirCost,
    required this.iconUrls,
    required this.rarity,
  });

  final String name;
  final int id;
  final int maxLevel;
  final int maxEvolutionLevel;
  final int elixirCost;
  final CardIconUrls iconUrls;
  final String rarity;

  factory CardModel.fromJson(Map<String, dynamic> json) {
    return CardModel(
      name: jsonString(json['name']),
      id: jsonInt(json['id']),
      maxLevel: jsonInt(json['maxLevel']),
      maxEvolutionLevel: jsonInt(json['maxEvolutionLevel']),
      elixirCost: jsonInt(json['elixirCost']),
      iconUrls: CardIconUrls.fromJson(jsonMap(json['iconUrls'])),
      rarity: jsonString(json['rarity']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'id': id,
      'maxLevel': maxLevel,
      'maxEvolutionLevel': maxEvolutionLevel,
      'elixirCost': elixirCost,
      'iconUrls': iconUrls.toJson(),
      'rarity': rarity,
    };
  }
}

class SupportItem {
  const SupportItem({
    required this.name,
    required this.id,
    required this.maxLevel,
    required this.iconUrls,
    required this.rarity,
  });

  final String name;
  final int id;
  final int maxLevel;
  final CardIconUrls iconUrls;
  final String rarity;

  factory SupportItem.fromJson(Map<String, dynamic> json) {
    return SupportItem(
      name: jsonString(json['name']),
      id: jsonInt(json['id']),
      maxLevel: jsonInt(json['maxLevel']),
      iconUrls: CardIconUrls.fromJson(jsonMap(json['iconUrls'])),
      rarity: jsonString(json['rarity']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'id': id,
      'maxLevel': maxLevel,
      'iconUrls': iconUrls.toJson(),
      'rarity': rarity,
    };
  }
}

class CardsResponse {
  const CardsResponse({required this.items, required this.supportItems});

  final List<CardModel> items;
  final List<SupportItem> supportItems;

  factory CardsResponse.fromJson(Map<String, dynamic> json) {
    final itemsJson = jsonList(json['items']);
    final supportItemsJson = jsonList(json['supportItems']);

    return CardsResponse(
      items: itemsJson
          .map((item) => CardModel.fromJson(jsonMap(item)))
          .toList(),
      supportItems: supportItemsJson
          .map((item) => SupportItem.fromJson(jsonMap(item)))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'items': items.map((item) => item.toJson()).toList(),
      'supportItems': supportItems.map((item) => item.toJson()).toList(),
    };
  }
}
