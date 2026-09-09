import 'package:flutter/material.dart';

import '../theme/pokemon_types.dart';

/// Indicador numérico com rótulo (altura, peso e experiência base).
///
/// Recebe `showDivider` para desenhar a linha vertical que separa as células,
/// como no protótipo.
class StatBox extends StatelessWidget {
  const StatBox({
    super.key,
    required this.value,
    required this.label,
    this.showDivider = false,
  });

  final String value;
  final String label;
  final bool showDivider;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          border: showDivider
              ? const Border(left: BorderSide(color: AppColors.border))
              : null,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text(
              value,
              style: const TextStyle(
                fontSize: 21,
                fontWeight: FontWeight.w700,
                color: AppColors.text,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
