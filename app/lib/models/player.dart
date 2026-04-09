import 'card.dart';
import '../utils/json_utils.dart';

class PlayerClan {
  const PlayerClan({
    required this.tag,
    required this.name,
    required this.badgeId,
  });

  final String tag;
  final String name;
  final int badgeId;

  factory PlayerClan.fromJson(Map<String, dynamic> json) {
    return PlayerClan(
      tag: jsonString(json['tag']),
      name: jsonString(json['name']),
      badgeId: jsonInt(json['badgeId']),
    );
  }

  Map<String, dynamic> toJson() {
    return {'tag': tag, 'name': name, 'badgeId': badgeId};
  }
}

class Arena {
  const Arena({required this.id, required this.name, required this.rawName});

  final int id;
  final String name;
  final String rawName;

  factory Arena.fromJson(Map<String, dynamic> json) {
    return Arena(
      id: jsonInt(json['id']),
      name: jsonString(json['name']),
      rawName: jsonString(json['rawName']),
    );
  }

  Map<String, dynamic> toJson() {
    return {'id': id, 'name': name, 'rawName': rawName};
  }
}

class SeasonStats {
  const SeasonStats({this.id, this.rank, this.trophies, this.bestTrophies});

  final String? id;
  final int? rank;
  final int? trophies;
  final int? bestTrophies;

  factory SeasonStats.fromJson(Map<String, dynamic> json) {
    return SeasonStats(
      id: jsonStringOrNull(json['id']),
      rank: jsonIntOrNull(json['rank']),
      trophies: jsonIntOrNull(json['trophies']),
      bestTrophies: jsonIntOrNull(json['bestTrophies']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      if (rank != null) 'rank': rank,
      if (trophies != null) 'trophies': trophies,
      if (bestTrophies != null) 'bestTrophies': bestTrophies,
    };
  }
}

class PlayerLeagueStatistics {
  const PlayerLeagueStatistics({
    this.currentSeason,
    this.previousSeason,
    this.bestSeason,
  });

  final SeasonStats? currentSeason;
  final SeasonStats? previousSeason;
  final SeasonStats? bestSeason;

  factory PlayerLeagueStatistics.fromJson(Map<String, dynamic> json) {
    return PlayerLeagueStatistics(
      currentSeason: json['currentSeason'] is Map<String, dynamic>
          ? SeasonStats.fromJson(json['currentSeason'] as Map<String, dynamic>)
          : null,
      previousSeason: json['previousSeason'] is Map<String, dynamic>
          ? SeasonStats.fromJson(json['previousSeason'] as Map<String, dynamic>)
          : null,
      bestSeason: json['bestSeason'] is Map<String, dynamic>
          ? SeasonStats.fromJson(json['bestSeason'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (currentSeason != null) 'currentSeason': currentSeason!.toJson(),
      if (previousSeason != null) 'previousSeason': previousSeason!.toJson(),
      if (bestSeason != null) 'bestSeason': bestSeason!.toJson(),
    };
  }
}

class PathOfLegendSeasonResult {
  const PathOfLegendSeasonResult({this.leagueNumber, this.trophies, this.rank});

  final int? leagueNumber;
  final int? trophies;
  final int? rank;

  factory PathOfLegendSeasonResult.fromJson(Map<String, dynamic> json) {
    return PathOfLegendSeasonResult(
      leagueNumber: jsonIntOrNull(json['leagueNumber']),
      trophies: jsonIntOrNull(json['trophies']),
      rank: jsonIntOrNull(json['rank']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (leagueNumber != null) 'leagueNumber': leagueNumber,
      if (trophies != null) 'trophies': trophies,
      if (rank != null) 'rank': rank,
    };
  }
}

class PlayerCard {
  const PlayerCard({
    required this.name,
    required this.id,
    required this.level,
    this.starLevel,
    this.evolutionLevel,
    required this.maxLevel,
    this.maxEvolutionLevel,
    required this.rarity,
    this.count,
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
  final int? count;
  final int elixirCost;
  final CardIconUrls iconUrls;

  factory PlayerCard.fromJson(Map<String, dynamic> json) {
    return PlayerCard(
      name: jsonString(json['name']),
      id: jsonInt(json['id']),
      level: jsonInt(json['level']),
      starLevel: jsonIntOrNull(json['starLevel']),
      evolutionLevel: jsonIntOrNull(json['evolutionLevel']),
      maxLevel: jsonInt(json['maxLevel']),
      maxEvolutionLevel: jsonIntOrNull(json['maxEvolutionLevel']),
      rarity: jsonString(json['rarity']),
      count: jsonIntOrNull(json['count']),
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
      if (count != null) 'count': count,
      'elixirCost': elixirCost,
      'iconUrls': iconUrls.toJson(),
    };
  }
}

class PlayerProfile {
  const PlayerProfile({
    required this.tag,
    required this.name,
    required this.expLevel,
    required this.trophies,
    required this.bestTrophies,
    required this.wins,
    required this.losses,
    required this.battleCount,
    required this.threeCrownWins,
    required this.challengeCardsWon,
    required this.challengeMaxWins,
    required this.tournamentCardsWon,
    required this.tournamentBattleCount,
    required this.donations,
    required this.donationsReceived,
    required this.totalDonations,
    required this.warDayWins,
    required this.clanCardsCollected,
    this.clan,
    required this.arena,
    this.leagueStatistics,
    required this.currentDeck,
    required this.currentFavouriteCard,
    required this.starPoints,
    required this.expPoints,
    this.totalExpPoints,
    this.currentPathOfLegendSeasonResult,
    this.lastPathOfLegendSeasonResult,
    this.bestPathOfLegendSeasonResult,
    this.legacyTrophyRoadHighScore,
  });

  final String tag;
  final String name;
  final int expLevel;
  final int trophies;
  final int bestTrophies;
  final int wins;
  final int losses;
  final int battleCount;
  final int threeCrownWins;
  final int challengeCardsWon;
  final int challengeMaxWins;
  final int tournamentCardsWon;
  final int tournamentBattleCount;
  final int donations;
  final int donationsReceived;
  final int totalDonations;
  final int warDayWins;
  final int clanCardsCollected;
  final PlayerClan? clan;
  final Arena arena;
  final PlayerLeagueStatistics? leagueStatistics;
  final List<PlayerCard> currentDeck;
  final CardModel currentFavouriteCard;
  final int starPoints;
  final int expPoints;
  final int? totalExpPoints;
  final PathOfLegendSeasonResult? currentPathOfLegendSeasonResult;
  final PathOfLegendSeasonResult? lastPathOfLegendSeasonResult;
  final PathOfLegendSeasonResult? bestPathOfLegendSeasonResult;
  final int? legacyTrophyRoadHighScore;

  factory PlayerProfile.fromJson(Map<String, dynamic> json) {
    final deckJson = jsonList(json['currentDeck']);

    return PlayerProfile(
      tag: jsonString(json['tag']),
      name: jsonString(json['name']),
      expLevel: jsonInt(json['expLevel']),
      trophies: jsonInt(json['trophies']),
      bestTrophies: jsonInt(json['bestTrophies']),
      wins: jsonInt(json['wins']),
      losses: jsonInt(json['losses']),
      battleCount: jsonInt(json['battleCount']),
      threeCrownWins: jsonInt(json['threeCrownWins']),
      challengeCardsWon: jsonInt(json['challengeCardsWon']),
      challengeMaxWins: jsonInt(json['challengeMaxWins']),
      tournamentCardsWon: jsonInt(json['tournamentCardsWon']),
      tournamentBattleCount: jsonInt(json['tournamentBattleCount']),
      donations: jsonInt(json['donations']),
      donationsReceived: jsonInt(json['donationsReceived']),
      totalDonations: jsonInt(json['totalDonations']),
      warDayWins: jsonInt(json['warDayWins']),
      clanCardsCollected: jsonInt(json['clanCardsCollected']),
      clan: json['clan'] is Map<String, dynamic>
          ? PlayerClan.fromJson(json['clan'] as Map<String, dynamic>)
          : null,
      arena: Arena.fromJson(jsonMap(json['arena'])),
      leagueStatistics: json['leagueStatistics'] is Map<String, dynamic>
          ? PlayerLeagueStatistics.fromJson(
              json['leagueStatistics'] as Map<String, dynamic>,
            )
          : null,
      currentDeck: deckJson
          .map((card) => PlayerCard.fromJson(jsonMap(card)))
          .toList(),
      currentFavouriteCard: CardModel.fromJson(
        jsonMap(json['currentFavouriteCard']),
      ),
      starPoints: jsonInt(json['starPoints']),
      expPoints: jsonInt(json['expPoints']),
      totalExpPoints: jsonIntOrNull(json['totalExpPoints']),
      currentPathOfLegendSeasonResult:
          json['currentPathOfLegendSeasonResult'] is Map<String, dynamic>
          ? PathOfLegendSeasonResult.fromJson(
              json['currentPathOfLegendSeasonResult'] as Map<String, dynamic>,
            )
          : null,
      lastPathOfLegendSeasonResult:
          json['lastPathOfLegendSeasonResult'] is Map<String, dynamic>
          ? PathOfLegendSeasonResult.fromJson(
              json['lastPathOfLegendSeasonResult'] as Map<String, dynamic>,
            )
          : null,
      bestPathOfLegendSeasonResult:
          json['bestPathOfLegendSeasonResult'] is Map<String, dynamic>
          ? PathOfLegendSeasonResult.fromJson(
              json['bestPathOfLegendSeasonResult'] as Map<String, dynamic>,
            )
          : null,
      legacyTrophyRoadHighScore: jsonIntOrNull(
        json['legacyTrophyRoadHighScore'],
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'tag': tag,
      'name': name,
      'expLevel': expLevel,
      'trophies': trophies,
      'bestTrophies': bestTrophies,
      'wins': wins,
      'losses': losses,
      'battleCount': battleCount,
      'threeCrownWins': threeCrownWins,
      'challengeCardsWon': challengeCardsWon,
      'challengeMaxWins': challengeMaxWins,
      'tournamentCardsWon': tournamentCardsWon,
      'tournamentBattleCount': tournamentBattleCount,
      'donations': donations,
      'donationsReceived': donationsReceived,
      'totalDonations': totalDonations,
      'warDayWins': warDayWins,
      'clanCardsCollected': clanCardsCollected,
      if (clan != null) 'clan': clan!.toJson(),
      'arena': arena.toJson(),
      if (leagueStatistics != null)
        'leagueStatistics': leagueStatistics!.toJson(),
      'currentDeck': currentDeck.map((card) => card.toJson()).toList(),
      'currentFavouriteCard': currentFavouriteCard.toJson(),
      'starPoints': starPoints,
      'expPoints': expPoints,
      if (totalExpPoints != null) 'totalExpPoints': totalExpPoints,
      if (currentPathOfLegendSeasonResult != null)
        'currentPathOfLegendSeasonResult': currentPathOfLegendSeasonResult!
            .toJson(),
      if (lastPathOfLegendSeasonResult != null)
        'lastPathOfLegendSeasonResult': lastPathOfLegendSeasonResult!.toJson(),
      if (bestPathOfLegendSeasonResult != null)
        'bestPathOfLegendSeasonResult': bestPathOfLegendSeasonResult!.toJson(),
      if (legacyTrophyRoadHighScore != null)
        'legacyTrophyRoadHighScore': legacyTrophyRoadHighScore,
    };
  }
}
