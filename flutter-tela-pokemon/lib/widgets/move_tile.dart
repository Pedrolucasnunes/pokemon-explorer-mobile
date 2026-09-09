import 'package:flutter/material.dart';

import '../models/pokemon_detail.dart';
import '../theme/pokemon_types.dart';
import 'type_chip.dart';

/// Linha da lista de movimentos.
///
/// No aplicativo principal, tocar aqui abre a Tela 6. Nesta versão a tela é
/// única, então o toque apenas destaca a linha selecionada.
class MoveTile extends StatelessWidget {
  const MoveTile({
    super.key,
    required this.move,
    required this.isSelected,
    required this.onTap,
  });

  final MoveSummary move;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isSelected ? AppColors.background : AppColors.surface,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: AppColors.divider)),
          ),
          child: Row(
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      move.name,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      move.subtitle,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              TypeChip(typeName: move.typeName),
              const SizedBox(width: 8),
              const Icon(
                Icons.chevron_right,
                color: AppColors.textMuted,
                size: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
