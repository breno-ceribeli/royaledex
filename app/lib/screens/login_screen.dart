import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../config/router.dart';
import '../providers/auth_provider.dart';
import '../widgets/royale_background.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, this.startInSignUp = false});

  final bool startInSignUp;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  late bool _isSignUp;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _isSignUp = widget.startInSignUp;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        context.read<AuthProvider>().clearMessages();
      }
    });
  }

  @override
  void didUpdateWidget(covariant LoginScreen oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.startInSignUp != widget.startInSignUp) {
      setState(() {
        _isSignUp = widget.startInSignUp;
      });
    }
  }

  void _switchMode(bool signUp) {
    if (_isSignUp == signUp) {
      return;
    }

    context.read<AuthProvider>().clearMessages();

    setState(() {
      _isSignUp = signUp;
      _passwordController.clear();
      _confirmPasswordController.clear();
      _obscurePassword = true;
      _obscureConfirmPassword = true;
    });
  }

  Future<void> _handleSubmit() async {
    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    final authProvider = context.read<AuthProvider>();

    if (_isSignUp) {
      await authProvider.signUpWithEmailAndPassword(
        _nameController.text.trim(),
        _emailController.text.trim(),
        _passwordController.text,
      );
    } else {
      await authProvider.signInWithEmailAndPassword(
        _emailController.text.trim(),
        _passwordController.text,
      );
    }

    if (!mounted) {
      return;
    }

    if (authProvider.errorMessage == null) {
      if (_isSignUp) {
        _switchMode(false);
      } else {
        final from = GoRouterState.of(context).uri.queryParameters['from'];
        context.go(from ?? AppRoutes.home);
      }
    }
  }

  Future<void> _handleGoogleSignIn() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.signInWithGoogle();

    if (!mounted) {
      return;
    }

    if (authProvider.errorMessage == null) {
      final from = GoRouterState.of(context).uri.queryParameters['from'];
      context.go(from ?? AppRoutes.home);
    }
  }

  Future<void> _handlePasswordReset() async {
    final email = _emailController.text.trim();
    await context.read<AuthProvider>().sendPasswordReset(email);
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    return Scaffold(
      body: RoyaleBackground(
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xCC1A2B3C),
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: const Color(0xFF243B53)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          IconButton(
                            onPressed: authProvider.isBusy
                                ? null
                                : () => context.go(AppRoutes.home),
                            icon: const Icon(
                              Icons.arrow_back_rounded,
                              color: Color(0xFFB0BEC5),
                            ),
                            tooltip: 'Voltar',
                          ),
                        ],
                      ),
                      Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0D1B2A),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF243B53)),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: _ModeButton(
                                text: 'Entrar',
                                selected: !_isSignUp,
                                onTap: () => _switchMode(false),
                              ),
                            ),
                            const SizedBox(width: 6),
                            Expanded(
                              child: _ModeButton(
                                text: 'Cadastrar',
                                selected: _isSignUp,
                                onTap: () => _switchMode(true),
                              ),
                            ),
                          ],
                        ),
                      ),
                      SvgPicture.asset(
                        'assets/icons/crown.svg',
                        width: 56,
                        height: 56,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _isSignUp
                            ? 'Crie sua conta no RoyaleDex'
                            : 'Bem-vindo ao RoyaleDex',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Color(0xFFF8FBFF),
                          fontWeight: FontWeight.w800,
                          fontSize: 22,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        _isSignUp
                            ? 'Cadastre-se para salvar favoritos e acompanhar jogadores.'
                            : 'Entre para salvar favoritos e acompanhar seus jogadores.',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: Color(0xFFB0BEC5),
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(height: 16),
                      if (authProvider.errorMessage != null) ...[
                        _InlineMessage(
                          message: authProvider.errorMessage!,
                          backgroundColor: const Color(0x663A151A),
                          borderColor: const Color(0x88EF4444),
                          textColor: const Color(0xFFFECACA),
                        ),
                        const SizedBox(height: 10),
                      ],
                      if (authProvider.infoMessage != null) ...[
                        _InlineMessage(
                          message: authProvider.infoMessage!,
                          backgroundColor: const Color(0x662D3A16),
                          borderColor: const Color(0x885E9E28),
                          textColor: const Color(0xFFE8F5C8),
                        ),
                        const SizedBox(height: 10),
                      ],
                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            if (_isSignUp) ...[
                              TextFormField(
                                controller: _nameController,
                                autovalidateMode:
                                    AutovalidateMode.onUserInteraction,
                                validator: (value) {
                                  if (!_isSignUp) {
                                    return null;
                                  }

                                  final normalized = value?.trim() ?? '';
                                  if (normalized.isEmpty) {
                                    return 'Informe seu nome.';
                                  }
                                  if (normalized.length < 2) {
                                    return 'Nome muito curto.';
                                  }
                                  return null;
                                },
                                decoration: const InputDecoration(
                                  labelText: 'Nome',
                                  prefixIcon: Icon(
                                    Icons.person_outline_rounded,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                            ],
                            TextFormField(
                              controller: _emailController,
                              keyboardType: TextInputType.emailAddress,
                              autovalidateMode:
                                  AutovalidateMode.onUserInteraction,
                              validator: (value) {
                                final normalized = value?.trim() ?? '';
                                if (normalized.isEmpty) {
                                  return 'Informe seu email.';
                                }
                                if (!normalized.contains('@')) {
                                  return 'Email invalido.';
                                }
                                return null;
                              },
                              decoration: const InputDecoration(
                                labelText: 'Email',
                                prefixIcon: Icon(Icons.mail_outline_rounded),
                              ),
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _passwordController,
                              obscureText: _obscurePassword,
                              autovalidateMode:
                                  AutovalidateMode.onUserInteraction,
                              validator: (value) {
                                final input = value ?? '';

                                if (input.isEmpty) {
                                  return _isSignUp
                                      ? 'Crie uma senha.'
                                      : 'Informe sua senha.';
                                }

                                if (_isSignUp && input.length < 6) {
                                  return 'Senha deve ter ao menos 6 caracteres.';
                                }

                                return null;
                              },
                              decoration: InputDecoration(
                                labelText: 'Senha',
                                prefixIcon: const Icon(
                                  Icons.lock_outline_rounded,
                                ),
                                suffixIcon: IconButton(
                                  onPressed: () {
                                    setState(() {
                                      _obscurePassword = !_obscurePassword;
                                    });
                                  },
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                  ),
                                ),
                              ),
                            ),
                            if (_isSignUp) ...[
                              const SizedBox(height: 12),
                              TextFormField(
                                controller: _confirmPasswordController,
                                obscureText: _obscureConfirmPassword,
                                autovalidateMode:
                                    AutovalidateMode.onUserInteraction,
                                validator: (value) {
                                  if (!_isSignUp) {
                                    return null;
                                  }

                                  if ((value ?? '').isEmpty) {
                                    return 'Confirme sua senha.';
                                  }

                                  if (value != _passwordController.text) {
                                    return 'As senhas nao coincidem.';
                                  }

                                  return null;
                                },
                                decoration: InputDecoration(
                                  labelText: 'Confirmar senha',
                                  prefixIcon: const Icon(
                                    Icons.lock_reset_rounded,
                                  ),
                                  suffixIcon: IconButton(
                                    onPressed: () {
                                      setState(() {
                                        _obscureConfirmPassword =
                                            !_obscureConfirmPassword;
                                      });
                                    },
                                    icon: Icon(
                                      _obscureConfirmPassword
                                          ? Icons.visibility_off_outlined
                                          : Icons.visibility_outlined,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                            const SizedBox(height: 16),
                            SizedBox(
                              width: double.infinity,
                              child: FilledButton(
                                onPressed: authProvider.isBusy
                                    ? null
                                    : _handleSubmit,
                                child: Text(
                                  authProvider.isBusy
                                      ? (_isSignUp
                                            ? 'Criando conta...'
                                            : 'Entrando...')
                                      : (_isSignUp
                                            ? 'Criar conta'
                                            : 'Entrar com email'),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      if (!_isSignUp)
                        TextButton(
                          onPressed: authProvider.isBusy
                              ? null
                              : _handlePasswordReset,
                          child: const Text('Esqueci minha senha'),
                        ),
                      const SizedBox(height: 8),
                      const _AuthDivider(),
                      const SizedBox(height: 10),
                      _GoogleAuthButton(
                        isSignUp: _isSignUp,
                        isBusy: authProvider.isBusy,
                        onPressed: _handleGoogleSignIn,
                      ),
                      const SizedBox(height: 10),
                      TextButton(
                        onPressed: authProvider.isBusy
                            ? null
                            : () => _switchMode(!_isSignUp),
                        child: Text(
                          _isSignUp
                              ? 'Ja tem conta? Entrar'
                              : 'Nao tem conta? Cadastre-se',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ModeButton extends StatelessWidget {
  const _ModeButton({
    required this.text,
    required this.selected,
    required this.onTap,
  });

  final String text;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? const Color(0xFFF0C040) : Colors.transparent,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        borderRadius: BorderRadius.circular(10),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Text(
            text,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: selected
                  ? const Color(0xFF0D1B2A)
                  : const Color(0xFFB0BEC5),
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }
}

class _AuthDivider extends StatelessWidget {
  const _AuthDivider();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider(color: Color(0x33243B53))),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: Text(
            'ou',
            style: TextStyle(color: Colors.white.withValues(alpha: 0.6)),
          ),
        ),
        const Expanded(child: Divider(color: Color(0x33243B53))),
      ],
    );
  }
}

class _GoogleAuthButton extends StatelessWidget {
  const _GoogleAuthButton({
    required this.isSignUp,
    required this.isBusy,
    required this.onPressed,
  });

  final bool isSignUp;
  final bool isBusy;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: isBusy ? null : onPressed,
      style: OutlinedButton.styleFrom(
        side: const BorderSide(color: Color(0xFF35506A)),
        backgroundColor: const Color(0xFF17344A),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 28,
            height: 28,
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: const Color(0xFF0D1B2A),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: const Color(0xFF42627E)),
            ),
            child: SvgPicture.asset(
              'assets/icons/google_logo.svg',
              width: 16,
              height: 16,
            ),
          ),
          const SizedBox(width: 10),
          Text(
            isSignUp ? 'Cadastrar com Google' : 'Entrar com Google',
            style: const TextStyle(color: Color(0xFFEAF2F8)),
          ),
        ],
      ),
    );
  }
}

class _InlineMessage extends StatelessWidget {
  const _InlineMessage({
    required this.message,
    required this.backgroundColor,
    required this.borderColor,
    required this.textColor,
  });

  final String message;
  final Color backgroundColor;
  final Color borderColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Text(message, style: TextStyle(color: textColor)),
    );
  }
}
