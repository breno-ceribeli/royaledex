import '../utils/json_utils.dart';

class ApiError {
  const ApiError({required this.error});

  final String error;

  factory ApiError.fromJson(Map<String, dynamic> json) {
    return ApiError(error: jsonString(json['error']));
  }

  Map<String, dynamic> toJson() {
    return {'error': error};
  }
}

class ApiErrorResponse {
  const ApiErrorResponse({required this.status, required this.message});

  final int status;
  final String message;

  factory ApiErrorResponse.fromJson(Map<String, dynamic> json) {
    return ApiErrorResponse(
      status: jsonInt(json['status']),
      message: jsonString(json['message']),
    );
  }

  Map<String, dynamic> toJson() {
    return {'status': status, 'message': message};
  }
}
