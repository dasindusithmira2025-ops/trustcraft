import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

abstract final class TCColors {
  static const teal950 = Color(0xFF063333);
  static const teal900 = Color(0xFF0A5858);
  static const teal800 = Color(0xFF0B6B6B);
  static const teal700 = Color(0xFF0D7E7E);
  static const teal600 = Color(0xFF129494);
  static const teal200 = Color(0xFFB3E0E0);
  static const teal100 = Color(0xFFE0F2F2);
  static const teal50 = Color(0xFFF0F9F9);

  static const ink950 = Color(0xFF0A0B0D);
  static const ink900 = Color(0xFF0F1114);
  static const ink800 = Color(0xFF1A1D22);
  static const ink700 = Color(0xFF2D3139);
  static const ink600 = Color(0xFF4B515C);
  static const ink500 = Color(0xFF6B7280);
  static const ink400 = Color(0xFF9BA3AF);
  static const ink300 = Color(0xFFC5C9D0);
  static const ink200 = Color(0xFFE2E4E8);
  static const ink100 = Color(0xFFF0F1F3);
  static const canvas = Color(0xFFF7F5F0);
  static const gold600 = Color(0xFF9A6D1E);
  static const gold500 = Color(0xFFB8842A);
  static const gold100 = Color(0xFFFDF3E3);
  static const success800 = Color(0xFF145533);
  static const success700 = Color(0xFF1D7A47);
  static const success100 = Color(0xFFE8F5EE);
  static const warning700 = Color(0xFFC17D11);
  static const danger700 = Color(0xFFB83232);
  static const danger100 = Color(0xFFFDECEC);
}

abstract final class TCSpacing {
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 12.0;
  static const lg = 16.0;
  static const xl = 24.0;
  static const xxl = 32.0;
}

abstract final class TCRadius {
  static const sm = 10.0;
  static const md = 14.0;
  static const lg = 18.0;
  static const xl = 24.0;
}

abstract final class TCMotion {
  static const fast = Duration(milliseconds: 160);
  static const standard = Duration(milliseconds: 240);
  static const reveal = Duration(milliseconds: 420);
  static const curve = Curves.easeOutCubic;
}

abstract final class TCTheme {
  static ThemeData get light {
    const scheme = ColorScheme.light(
      primary: TCColors.teal800,
      onPrimary: Colors.white,
      secondary: TCColors.gold500,
      surface: Colors.white,
      onSurface: TCColors.ink900,
      error: TCColors.danger700,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: TCColors.canvas,
      fontFamily: 'Inter',
      splashFactory: InkSparkle.splashFactory,
      textTheme: const TextTheme(
        bodyLarge: TextStyle(fontSize: 16, height: 1.5, color: TCColors.ink700),
        bodyMedium: TextStyle(
          fontSize: 14,
          height: 1.45,
          color: TCColors.ink700,
        ),
        labelLarge: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
      ),
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: PredictiveBackPageTransitionsBuilder(),
          TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        },
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TCRadius.md),
          borderSide: const BorderSide(color: TCColors.ink200),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TCRadius.md),
          borderSide: const BorderSide(color: TCColors.ink200),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(TCRadius.md),
          borderSide: const BorderSide(color: TCColors.teal700, width: 1.5),
        ),
      ),
    );
  }
}

extension TCText on BuildContext {
  TextStyle get display => const TextStyle(
    fontFamily: 'InstrumentSerif',
    color: TCColors.ink900,
    fontWeight: FontWeight.w400,
  );

  TextStyle get data => const TextStyle(
    fontFamily: 'DMMono',
    color: TCColors.ink500,
    letterSpacing: 1.1,
  );
}
