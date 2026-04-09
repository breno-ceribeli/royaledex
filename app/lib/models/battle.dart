import 'card.dart';
import 'player.dart';
import '../utils/json_utils.dart';

class GameMode {
  const GameMode({required this.id, required this.name});

  final int id;
  final String name;

  factory GameMode.fromJson(Map<String, dynamic> json) {
    return GameMode(id: jsonInt(json['id']), name: jsonString(json['name']));
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name};
  }
}

class BattleSupportCard {
  const BattleSupportCard({
    required this.name,
    required this.id,
    required this.maxLevel,
    required this.iconUrls,
    required this.rarity,
    required this.level,
  });

  final String name;
  final int id;
  final int maxLevel;
  final CardIconUrls iconUrls;
  final String rarity;
  final int level;

  factory BattleSupportCard.fromJson(Map<String, dynamic> json) {
    return BattleSupportCard(
      name: jsonString(json['name']),
      id: jsonInt(json['id']),
      maxLevel: jsonInt(json['maxLevel']),
      iconUrls: CardIconUrls.fromJson(jsonMap(json['iconUrls'])),
      rarity: jsonString(json['rarity']),
      level: jsonInt(json['level']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'id': id,
      'maxLevel': maxLevel,
      'iconUrls': iconUrls.toJson(),
      'rarity': rarity,
      'level': level,
    };
  }
}

class BattleCard {
  const BattleCard({
    required this.name,
    required this.id,
    required this.level,
    this.starLevel,
    this.evolutionLevel,
    required this.maxLevel,
    this.maxEvolutionLevel,
    required this.rarity,
    required this.elixirCost,
    required this.iconUrls,
  });

  final String name;
  final int id;
  final int level;
  final int? starLevel;
  final int? evolutionLevel;
  final int maxLevel;
  final int? maxEvolutionLevel;
  final String rarity;
  final int elixirCost;
  final CardIconUrls iconUrls;

  factory BattleCard.fromJson(Map<String, dynamic> json) {
    return BattleCard(
      name: jsonString(json['name']),
      id: jsonInt(json['id']),
      level: jsonInt(json['level']),
      starLevel: jsonIntOrNull(json['starLevel']),
      evolutionLevel: jsonIntOrNull(json['evolutionLevel']),
      maxLevel: jsonInt(json['maxLevel']),
      maxEvolutionLevel: jsonIntOrNull(json['maxEvolutionLevel']),
      rarity: jsonString(json['rarity']),
      elixirCost: jsonInt(json['elixirCost']),
      iconUrls: CardIconUrls.fromJson(jsonMap(json['iconUrls'])),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'id': id,
      'level': level,
      if (starLevel != null) 'starLevel': starLevel,
      if (evolutionLevel != null) 'evolutionLevel': evolutionLevel,
      'maxLevel': maxLevel,
      if (maxEvolutionLevel != null) 'maxEvolutionLevel': maxEvolutionLevel,
      'rarity': rarity,
      'elixirCost': elixirCost,
      'iconUrls': iconUrls.toJson(),
    };
  }
}

class PlayerBattleData {
  const PlayerBattleData({
    required this.tag,
    required this.name,
    this.startingTrophies,
    this.trophyChange,
    required this.crowns,
    required this.kingTowerHitPoints,
    this.princessTowersHitPoints,
    this.clan,
    required this.cards,
    this.supportCards,
    this.globalRank,
    required this.elixirLeaked,
  });

  final String tag;
  final String name;
  final int? startingTrophies;
  final int? trophyChange;
  final int crowns;
  final int kingTowerHitPoints;
  final List<int>? princessTowersHitPoints;
  final PlayerClan? clan;
  final List<BattleCard> cards;
  final List<BattleSupportCard>? supportCards;
  final int? globalRank;
  final double elixirLeaked;

  factory PlayerBattleData.fromJson(Map<String, dynamic> json) {
    return PlayerBattleData(
      tag: jsonString(json['tag']),
      name: jsonString(json['name']),
      startingTrophies: jsonIntOrNull(json['startingTrophies']),
      trophyChange: jsonIntOrNull(json['trophyChange']),
      crowns: jsonInt(json['crowns']),
      kingTowerHitPoints: jsonInt(json['kingTowerHitPoints']),
      princessTowersHitPoints: json['princessTowersHitPoints'] == null
          ? null
          : jsonList(
              json['princessTowersHitPoints'],
            ).map((value) => jsonInt(value)).toList(),
      clan: json['clan'] is Map<String, dynamic>
          ? PlayerClan.fromJson(json['clan'] as Map<String, dynamic>)
          : null,
      cards: jsonList(
        json['cards'],
      ).map((value) => BattleCard.fromJson(jsonMap(value))).toList(),
      supportCards: json['supportCards'] == null
          ? null
          : jsonList(json['supportCards'])
                .map((value) => BattleSupportCard.fromJson(jsonMap(value)))
                .toList(),
      globalRank: jsonIntOrNull(json['globalRank']),
      elixirLeaked: jsonDouble(json['elixirLeaked']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'tag': tag,
      'name': name,
      if (startingTrophies != null) 'startingTrophies': startingTrophies,
      if (trophyChange != null) 'trophyChange': trophyChange,
      'crowns': crowns,
      'kingTowerHitPoints': kingTowerHitPoints,
      'princessTowersHitPoints': princessTowersHitPoints,
      if (clan != null) 'clan': clan!.toJson(),
      'cards': cards.map((item) => item.toJson()).toList(),
      if (supportCards != null)
        'supportCards': supportCards!.map((item) => item.toJson()).toList(),
      if (globalRank != null) 'globalRank': globalRank,
      'elixirLeaked': elixirLeaked,
    };
  }
}

class Battle {
  const Battle({
    required this.type,
    required this.battleTime,
    this.isLadderTournament,
    required this.arena,
    required this.gameMode,
    required this.deckSelection,
    required this.team,
    required this.opponent,
    this.isHostedMatch,
    this.leagueNumber,
  });

  final String type;
  final String battleTime;
  final bool? isLadderTournament;
  final Arena arena;
  final GameMode gameMode;
  final String deckSelection;
  final List<PlayerBattleData> team;
  final List<PlayerBattleData> opponent;
  final bool? isHostedMatch;
  final int? leagueNumber;

  factory Battle.fromJson(Map<String, dynamic> json) {
    return Battle(
      type: jsonString(json['type']),
      battleTime: jsonString(json['battleTime']),
      isLadderTournament: jsonBoolOrNull(json['isLadderTournament']),
      arena: Arena.fromJson(jsonMap(json['arena'])),
      gameMode: GameMode.fromJson(jsonMap(json['gameMode'])),
      deckSelection: jsonString(json['deckSelection']),
      team: jsonList(
        json['team'],
      ).map((value) => PlayerBattleData.fromJson(jsonMap(value))).toList(),
      opponent: jsonList(
        json['opponent'],
      ).map((value) => PlayerBattleData.fromJson(jsonMap(value))).toList(),
      isHostedMatch: jsonBoolOrNull(json['isHostedMatch']),
      leagueNumber: jsonIntOrNull(json['leagueNumber']),
    );
  }

  static List<Battle> listFromJson(dynamic value) {
    return jsonList(
      value,
    ).map((item) => Battle.fromJson(jsonMap(item))).toList();
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'battleTime': battleTime,
      if (isLadderTournament != null) 'isLadderTournament': isLadderTournament,
      'arena': arena.toJson(),
      'gameMode': gameMode.toJson(),
      'deckSelection': deckSelection,
      'team': team.map((item) => item.toJson()).toList(),
      'opponent': opponent.map((item) => item.toJson()).toList(),
      if (isHostedMatch != null) 'isHostedMatch': isHostedMatch,
      if (leagueNumber != null) 'leagueNumber': leagueNumber,
    };
  }
}

typedef BattleLog = List<Battle>;

class CardLossStats {
  const CardLossStats({
    required this.name,
    required this.count,
    required this.percentage,
  });

  final String name;
  final int count;
  final double percentage;

  factory CardLossStats.fromJson(Map<String, dynamic> json) {
    return CardLossStats(
      name: jsonString(json['name']),
      count: jsonInt(json['count']),
      percentage: jsonDouble(json['percentage']),
    );
  }

  Map<String, dynamic> toJson() {
    return {'name': name, 'count': count, 'percentage': percentage};
  }
}

class CrownsDistribution {
  const CrownsDistribution({
    required this.zero,
    required this.one,
    required this.two,
    required this.three,
  });

  final int zero;
  final int one;
  final int two;
  final int three;

  factory CrownsDistribution.fromJson(Map<String, dynamic> json) {
    return CrownsDistribution(
      zero: jsonInt(json['0']),
      one: jsonInt(json['1']),
      two: jsonInt(json['2']),
      three: jsonInt(json['3']),
    );
  }

  Map<String, dynamic> toJson() {
    return {'0': zero, '1': one, '2': two, '3': three};
  }
}

class BattleLogStats {
  const BattleLogStats({
    required this.totalBattles,
    required this.pvpBattles,
    required this.pathOfLegendBattles,
    required this.wins,
    required this.losses,
    required this.draws,
    required this.winRate,
    this.avgTrophyChange,
    required this.avgElixirLeaked,
    required this.mostLostAgainstCards,
    required this.crownsDistribution,
  });

  final int totalBattles;
  final int pvpBattles;
  final int pathOfLegendBattles;
  final int wins;
  final int losses;
  final int draws;
  final double winRate;
  final double? avgTrophyChange;
  final double avgElixirLeaked;
  final List<CardLossStats> mostLostAgainstCards;
  final CrownsDistribution crownsDistribution;

  factory BattleLogStats.fromJson(Map<String, dynamic> json) {
    return BattleLogStats(
      totalBattles: jsonInt(json['totalBattles']),
      pvpBattles: jsonInt(json['pvpBattles']),
      pathOfLegendBattles: jsonInt(json['pathOfLegendBattles']),
      wins: jsonInt(json['wins']),
      losses: jsonInt(json['losses']),
      draws: jsonInt(json['draws']),
      winRate: jsonDouble(json['winRate']),
      avgTrophyChange: jsonDoubleOrNull(json['avgTrophyChange']),
      avgElixirLeaked: jsonDouble(json['avgElixirLeaked']),
      mostLostAgainstCards: jsonList(
        json['mostLostAgainstCards'],
      ).map((item) => CardLossStats.fromJson(jsonMap(item))).toList(),
      crownsDistribution: CrownsDistribution.fromJson(
        jsonMap(json['crownsDistribution']),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalBattles': totalBattles,
      'pvpBattles': pvpBattles,
      'pathOfLegendBattles': pathOfLegendBattles,
      'wins': wins,
      'losses': losses,
      'draws': draws,
      'winRate': winRate,
      'avgTrophyChange': avgTrophyChange,
      'avgElixirLeaked': avgElixirLeaked,
      'mostLostAgainstCards': mostLostAgainstCards
          .map((item) => item.toJson())
          .toList(),
      'crownsDistribution': crownsDistribution.toJson(),
    };
  }
}
