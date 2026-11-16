import 'package:flutter/material.dart';

class AppTheme {
  // NSU Official Color Palette
  static const Color canvas = Color(0xFFF8FAFC);
  static const Color canvasAlt = Color(0xFFF1F5F9);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE2E8F0);
  
  static const Color navy = Color(0xFF0F2942);
  static const Color navyDark = Color(0xFF0A1C2E);
  static const Color navyLight = Color(0xFF0B3B59);
  
  static const Color teal = Color(0xFF0D7A91);
  static const Color tealLight = Color(0xFF0891B2);
  
  static const Color emerald = Color(0xFF10B981);
  static const Color emeraldLight = Color(0xFFECFDF5);
  static const Color emeraldDark = Color(0xFF065F46);
  
  static const Color amber = Color(0xFFF59E0B);
  static const Color amberLight = Color(0xFFFFFBEB);
  static const Color amberDark = Color(0xFF92400E);
  
  static const Color crimson = Color(0xFFDC2626);
  static const Color crimsonLight = Color(0xFFFEF2F2);
  static const Color crimsonDark = Color(0xFF991B1B);

  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);
  static const Color textMuted = Color(0xFF94A3B8);

  static ThemeData get themeData {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: canvas,
      colorScheme: ColorScheme.fromSeed(
        seedColor: navy,
        primary: navy,
        secondary: teal,
        surface: cardBg,
        error: crimson,
      ),
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: navy,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
      ),
      cardTheme: CardThemeData(
        color: cardBg,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: border, width: 1),
        ),
      ),
    );
  }
}
