import 'package:flutter/material.dart';

class RoyaleDexColors {
  static const Color background = Color(0xFF0D1B2A);
  static const Color backgroundDeep = Color(0xFF07111D);
  static const Color surfaceLow = Color(0xFF1A2B3C);
  static const Color surfaceHigh = Color(0xFF243B53);
  static const Color primary = Color(0xFFF0C040);
  static const Color primarySoft = Color(0xFFFFD874);
  static const Color primaryDeep = Color(0xFFC9A033);
  static const Color accent = Color(0xFF7B2FBE);
  static const Color textMain = Color(0xFFF8FBFF);
  static const Color textMuted = Color(0xFFB0BEC5);
  static const Color danger = Color(0xFFEF4444);
}

class RoyaleDexTheme {
  static ThemeData get darkTheme {
    const colorScheme = ColorScheme(
      brightness: Brightness.dark,
      primary: RoyaleDexColors.primary,
      onPrimary: RoyaleDexColors.background,
      secondary: RoyaleDexColors.accent,
      onSecondary: RoyaleDexColors.textMain,
      error: RoyaleDexColors.danger,
      onError: RoyaleDexColors.textMain,
      surface: RoyaleDexColors.surfaceLow,
      onSurface: RoyaleDexColors.textMain,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: RoyaleDexColors.background,
      dividerColor: RoyaleDexColors.surfaceHigh,
      appBarTheme: const AppBarTheme(
        backgroundColor: RoyaleDexColors.background,
        foregroundColor: RoyaleDexColors.textMain,
        elevation: 0,
        centerTitle: false,
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          color: RoyaleDexColors.textMain,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.3,
        ),
        headlineMedium: TextStyle(
          color: RoyaleDexColors.textMain,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.2,
        ),
        titleLarge: TextStyle(
          color: RoyaleDexColors.textMain,
          fontWeight: FontWeight.w600,
        ),
        bodyLarge: TextStyle(color: RoyaleDexColors.textMain),
        bodyMedium: TextStyle(color: RoyaleDexColors.textMuted),
        labelLarge: TextStyle(
          color: RoyaleDexColors.textMain,
          fontWeight: FontWeight.w600,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: RoyaleDexColors.surfaceLow,
        hintStyle: const TextStyle(color: RoyaleDexColors.textMuted),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 12,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RoyaleDexColors.surfaceHigh),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RoyaleDexColors.primary),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RoyaleDexColors.danger),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: RoyaleDexColors.danger),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: RoyaleDexColors.primary,
          foregroundColor: RoyaleDexColors.background,
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: RoyaleDexColors.primary,
          side: const BorderSide(color: RoyaleDexColors.surfaceHigh),
          textStyle: const TextStyle(fontWeight: FontWeight.w600),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: RoyaleDexColors.surfaceHigh,
        contentTextStyle: const TextStyle(color: RoyaleDexColors.textMain),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: RoyaleDexColors.primary,
      ),
    );
  }
}
