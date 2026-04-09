import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthFlowException implements Exception {
  AuthFlowException({required this.code, required this.message});

  final String code;
  final String message;

  @override
  String toString() => 'AuthFlowException(code: $code, message: $message)';
}

class AuthService {
  AuthService({FirebaseAuth? auth, GoogleSignIn? googleSignIn})
    : _auth = auth ?? FirebaseAuth.instance,
      _googleSignIn = googleSignIn ?? GoogleSignIn.instance;

  final FirebaseAuth _auth;
  final GoogleSignIn _googleSignIn;

  Stream<User?> authStateChanges() => _auth.authStateChanges();

  User? get currentUser => _auth.currentUser;

  Future<void> signIn(String email, String password) async {
    final credential = await _auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );

    final signedUser = credential.user;
    if (signedUser == null) {
      throw AuthFlowException(
        code: 'auth/internal-error',
        message: 'Nao foi possivel identificar o usuario autenticado.',
      );
    }

    final isPasswordAccount = signedUser.providerData.any(
      (provider) => provider.providerId == 'password',
    );

    if (isPasswordAccount && !signedUser.emailVerified) {
      try {
        await signedUser.sendEmailVerification();
      } catch (_) {
        // Intentionally ignored to preserve the primary auth message.
      }

      await _auth.signOut();
      throw AuthFlowException(
        code: 'auth/email-not-verified',
        message:
            'Seu email ainda nao foi verificado. Enviamos um novo link de confirmacao.',
      );
    }
  }

  Future<void> signUp(String email, String password) async {
    final credential = await _auth.createUserWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );

    final createdUser = credential.user;
    if (createdUser == null) {
      throw AuthFlowException(
        code: 'auth/internal-error',
        message: 'Nao foi possivel concluir a criacao da conta.',
      );
    }

    await createdUser.sendEmailVerification();
    await _auth.signOut();
  }

  Future<void> signInWithGoogle() async {
    if (kIsWeb) {
      final provider = GoogleAuthProvider();
      await _auth.signInWithPopup(provider);
      return;
    }

    await _googleSignIn.initialize(
      serverClientId:
          '881549341879-73rii8qdcnti31gs3flbeghgpvc5li6u.apps.googleusercontent.com',
    );

    final account = await _googleSignIn.authenticate();
    final googleAuth = account.authentication;

    final credential = GoogleAuthProvider.credential(
      idToken: googleAuth.idToken,
    );

    await _auth.signInWithCredential(credential);
  }

  Future<void> sendPasswordReset(String email) async {
    final normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.isEmpty) {
      throw AuthFlowException(
        code: 'auth/missing-email',
        message: 'Informe um email valido para continuar.',
      );
    }

    await _auth.sendPasswordResetEmail(email: normalizedEmail);
  }

  Future<void> logout() async {
    if (!kIsWeb) {
      await _googleSignIn.signOut();
    }

    await _auth.signOut();
  }
}
