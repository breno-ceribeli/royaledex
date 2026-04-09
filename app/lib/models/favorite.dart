import '../utils/json_utils.dart';

class FavoritePlayer {
  const FavoritePlayer({
    required this.tag,
    required this.name,
    required this.addedAt,
  });

  final String tag;
  final String name;
  final String addedAt;

  factory FavoritePlayer.fromJson(Map<String, dynamic> json) {
    return FavoritePlayer(
      tag: jsonString(json['tag']),
      name: jsonString(json['name']),
      addedAt: jsonString(json['addedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {'tag': tag, 'name': name, 'addedAt': addedAt};
  }
}

class AddFavoritePlayerRequest {
  const AddFavoritePlayerRequest({required this.tag, required this.name});

  final String tag;
  final String name;

  Map<String, dynamic> toJson() {
    return {'tag': tag, 'name': name};
  }
}
