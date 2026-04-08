import 'dart:async';
import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class ApiException implements Exception {
  ApiException({
    required this.message,
    this.statusCode,
    this.code,
    this.details,
  });

  final String message;
  final int? statusCode;
  final String? code;
  final Object? details;

  @override
  String toString() {
    return 'ApiException(statusCode: $statusCode, code: $code, message: $message)';
  }
}

class ApiService {
  ApiService({String? baseUrl, FirebaseAuth? auth, http.Client? client})
    : _auth = auth ?? FirebaseAuth.instance,
      _client = client ?? http.Client(),
      _baseUrl = _normalizeBaseUrl(baseUrl ?? dotenv.env['API_URL']);

  final FirebaseAuth _auth;
  final http.Client _client;
  final String _baseUrl;

  static const Duration _defaultTimeout = Duration(seconds: 20);

  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool attachAuthToken = true,
    Duration timeout = _defaultTimeout,
  }) {
    return _request(
      method: 'GET',
      path: path,
      query: query,
      headers: headers,
      attachAuthToken: attachAuthToken,
      timeout: timeout,
    );
  }

  Future<dynamic> post(
    String path, {
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool attachAuthToken = true,
    Duration timeout = _defaultTimeout,
  }) {
    return _request(
      method: 'POST',
      path: path,
      body: body,
      query: query,
      headers: headers,
      attachAuthToken: attachAuthToken,
      timeout: timeout,
    );
  }

  Future<dynamic> put(
    String path, {
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool attachAuthToken = true,
    Duration timeout = _defaultTimeout,
  }) {
    return _request(
      method: 'PUT',
      path: path,
      body: body,
      query: query,
      headers: headers,
      attachAuthToken: attachAuthToken,
      timeout: timeout,
    );
  }

  Future<dynamic> patch(
    String path, {
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool attachAuthToken = true,
    Duration timeout = _defaultTimeout,
  }) {
    return _request(
      method: 'PATCH',
      path: path,
      body: body,
      query: query,
      headers: headers,
      attachAuthToken: attachAuthToken,
      timeout: timeout,
    );
  }

  Future<dynamic> delete(
    String path, {
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    bool attachAuthToken = true,
    Duration timeout = _defaultTimeout,
  }) {
    return _request(
      method: 'DELETE',
      path: path,
      body: body,
      query: query,
      headers: headers,
      attachAuthToken: attachAuthToken,
      timeout: timeout,
    );
  }

  Future<dynamic> _request({
    required String method,
    required String path,
    Object? body,
    Map<String, dynamic>? query,
    Map<String, String>? headers,
    required bool attachAuthToken,
    required Duration timeout,
  }) async {
    final uri = _buildUri(path, query);
    final requestHeaders = await _buildHeaders(
      customHeaders: headers,
      attachAuthToken: attachAuthToken,
    );

    try {
      late final http.Response response;

      switch (method) {
        case 'GET':
          response = await _client
              .get(uri, headers: requestHeaders)
              .timeout(timeout);
          break;
        case 'POST':
          response = await _client
              .post(uri, headers: requestHeaders, body: _encodeBody(body))
              .timeout(timeout);
          break;
        case 'PUT':
          response = await _client
              .put(uri, headers: requestHeaders, body: _encodeBody(body))
              .timeout(timeout);
          break;
        case 'PATCH':
          response = await _client
              .patch(uri, headers: requestHeaders, body: _encodeBody(body))
              .timeout(timeout);
          break;
        case 'DELETE':
          response = await _client
              .delete(uri, headers: requestHeaders, body: _encodeBody(body))
              .timeout(timeout);
          break;
        default:
          throw ApiException(message: 'Metodo HTTP nao suportado: $method');
      }

      return _handleResponse(response);
    } on TimeoutException {
      throw ApiException(message: 'Tempo de resposta da API esgotado.');
    } on http.ClientException catch (error) {
      throw ApiException(
        message: 'Falha de rede ao conectar na API.',
        details: error,
      );
    }
  }

  Uri _buildUri(String path, Map<String, dynamic>? query) {
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    final queryParameters = _toQueryParameters(query);

    return Uri.parse('$_baseUrl$normalizedPath').replace(
      queryParameters: queryParameters.isEmpty ? null : queryParameters,
    );
  }

  Future<Map<String, String>> _buildHeaders({
    Map<String, String>? customHeaders,
    required bool attachAuthToken,
  }) async {
    final headers = <String, String>{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      if (customHeaders != null) ...customHeaders,
    };

    if (!attachAuthToken) {
      return headers;
    }

    final user = _auth.currentUser;
    if (user == null) {
      return headers;
    }

    final token = await user.getIdToken();
    headers['Authorization'] = 'Bearer $token';
    return headers;
  }

  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) {
        return null;
      }

      return _tryDecodeJson(response.body) ?? response.body;
    }

    throw _buildApiException(response);
  }

  ApiException _buildApiException(http.Response response) {
    final payload = _tryDecodeJson(response.body);
    String? code;
    String? message;

    if (payload is Map<String, dynamic>) {
      final dynamic payloadCode = payload['code'];
      final dynamic payloadMessage = payload['message'] ?? payload['error'];

      if (payloadCode is String && payloadCode.isNotEmpty) {
        code = payloadCode;
      }

      if (payloadMessage is String && payloadMessage.isNotEmpty) {
        message = payloadMessage;
      }
    }

    message ??= _defaultMessageForStatusCode(response.statusCode);

    return ApiException(
      statusCode: response.statusCode,
      code: code,
      message: message,
      details: payload ?? response.body,
    );
  }

  static String _normalizeBaseUrl(String? value) {
    final raw = value?.trim();

    if (raw == null || raw.isEmpty) {
      throw StateError('API_URL nao foi configurada no .env');
    }

    final noTrailingSlash = raw.endsWith('/')
        ? raw.substring(0, raw.length - 1)
        : raw;

    return noTrailingSlash.endsWith('/api')
        ? noTrailingSlash
        : '$noTrailingSlash/api';
  }

  static Map<String, String> _toQueryParameters(Map<String, dynamic>? query) {
    if (query == null || query.isEmpty) {
      return const {};
    }

    final result = <String, String>{};

    for (final entry in query.entries) {
      if (entry.value == null) {
        continue;
      }

      result[entry.key] = '${entry.value}';
    }

    return result;
  }

  static String? _encodeBody(Object? body) {
    if (body == null) {
      return null;
    }

    if (body is String) {
      return body;
    }

    return jsonEncode(body);
  }

  static dynamic _tryDecodeJson(String raw) {
    if (raw.trim().isEmpty) {
      return null;
    }

    try {
      return jsonDecode(raw);
    } catch (_) {
      return null;
    }
  }

  static String _defaultMessageForStatusCode(int statusCode) {
    switch (statusCode) {
      case 400:
        return 'Requisicao invalida.';
      case 401:
        return 'Nao autorizado. Faca login novamente.';
      case 403:
        return 'Acesso negado.';
      case 404:
        return 'Recurso nao encontrado.';
      case 409:
        return 'Conflito de dados na requisicao.';
      case 422:
        return 'Dados invalidos para esta operacao.';
      case 429:
        return 'Muitas requisicoes. Tente novamente em instantes.';
      default:
        if (statusCode >= 500) {
          return 'Erro interno no servidor.';
        }
        return 'Erro inesperado na comunicacao com a API.';
    }
  }
}
