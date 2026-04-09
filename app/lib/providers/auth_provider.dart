import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  AuthProvider({AuthService? authService})
    : _authService = authService ?? AuthService() {
    _subscription = _authService.authStateChanges().listen((user) {
      _currentUser = user;
      _isLoadingSession = false;
      notifyListeners();
    });
  }

  final AuthService _authService;
  StreamSubscription<User?>? _subscription;

  User? _currentUser;
  bool _isLoadingSession = true;
  bool _isBusy = false;
  String? _errorMessage;
  String? _infoMessage;

  User? get currentUser => _currentUser;
  bool get isAuthenticated => _currentUser != null;
  bool get isLoadingSession => _isLoadingSession;
  bool get isBusy => _isBusy;
  String? get errorMessage => _errorMessage;
  String? get infoMessage => _infoMessage;

  void clearMessages() {
    _errorMessage = null;
    _infoMessage = null;
    notifyListeners();
  }

  Future<void> signInWithEmailAndPassword(String email, String password) async {
    await _runAction(() async {
      await _authService.signInWithEmailAndPassword(email, password);
    });
  }

  Future<void> signUpWithEmailAndPassword(
    String name,
    String email,
    String password,
  ) async {
    await _runAction(() async {
      await _authService.signUpWithEmailAndPassword(name, email, password);
      _infoMessage =
          'Conta criada com sucesso. Enviamos um email de confirmacao para voce.';
    });
  }

  Future<void> signOut() async {
    await _runAction(() async {
      await _authService.signOut();
    });
  }

  Future<void> signInWithGoogle() async {
    await _runAction(() async {
      await _authService.signInWithGoogle();
    });
  }

  Future<void> sendPasswordReset(String email) async {
    await _runAction(() async {
      await _authService.sendPasswordReset(email);
      _infoMessage =
          'Se existir uma conta com senha para este email, enviamos o link de redefinicao.';
    });
  }

  Future<void> _runAction(Future<void> Function() action) async {
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
      _errorMessage = _mapErrorToMessage(error);
    } finally {
      _isBusy = false;
      notifyListeners();
    }
  }

  String _mapErrorToMessage(Object error) {
    String? code;

    if (error is AuthFlowException) {
      return error.message;
    }

    if (error is FirebaseAuthException) {
      code = error.code;
    }

    switch (code) {
      case 'invalid-email':
        return 'Email invalido. Verifique e tente novamente.';
      case 'user-disabled':
        return 'Esta conta foi desabilitada.';
      case 'user-not-found':
        return 'Nenhuma conta encontrada com este email.';
      case 'wrong-password':
      case 'invalid-credential':
        return 'Email ou senha incorretos.';
      case 'too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'email-already-in-use':
        return 'Este email ja esta em uso.';
      case 'operation-not-allowed':
        return 'Operacao nao permitida para esta conta.';
      case 'weak-password':
        return 'Senha muito fraca. Use ao menos 6 caracteres.';
      case 'missing-email':
        return 'Informe um email valido para continuar.';
      case 'network-request-failed':
        return 'Erro de conexao. Verifique sua internet.';
      case 'popup-blocked':
        return 'O popup do Google foi bloqueado pelo navegador.';
      case 'popup-closed-by-user':
        return 'A autenticacao com Google foi cancelada.';
      default:
        return 'Nao foi possivel concluir a operacao. Tente novamente.';
    }
  }

  @override
  void dispose() {
    _subscription?.cancel();
    super.dispose();
  }
}
