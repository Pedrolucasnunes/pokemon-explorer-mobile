import 'package:flutter/material.dart';

/// Paleta base do aplicativo, equivalente ao arquivo `theme/colors.js` da
/// versão em React Native.
class AppColors {
  const AppColors._();

  static const Color brand = Color(0xFFE3002B);
  static const Color background = Color(0xFFF2F2F7);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE5E5EA);
  static const Color divider = Color(0xFFEDEDF0);
  static const Color text = Color(0xFF111114);
  static const Color textSecondary = Color(0xFF6E6E73);
  static const Color textMuted = Color(0xFF9A9AA0);
  static const Color statsCard = Color(0xFFEBEBF0);

  /// Branco translúcido usado nos círculos decorativos e no fundo do sprite.
  /// Declarado como literal ARGB para não depender de `withOpacity`, cuja
  /// assinatura mudou entre versões do Flutter.
  static const Color overlayLight = Color(0x1FFFFFFF);
  static const Color overlayLighter = Color(0x33FFFFFF);
  static const Color textOnDarkSoft = Color(0xE0FFFFFF);
}
