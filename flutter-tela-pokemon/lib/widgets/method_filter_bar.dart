import 'package:flutter/material.dart';

import '../models/pokemon_detail.dart';
import '../theme/pokemon_types.dart';

/// Régua horizontal de filtro por método de aprendizado.
///
/// `selected == null` corresponde à opção "Todos". O componente é puramente
/// apresentacional: quem guarda o estado é a tela.
class MethodFilterBar extends StatelessWidget {
  const MethodFilterBar({
    super.key,
    required this.selected,
    required this.onChanged,
  });

  final LearnMethod? selected;
  final ValueChanged<LearnMethod?> onChanged;

  @override
  Widget build(BuildContext context) {
    final List<LearnMethod?> options = <LearnMethod?>[null, ...LearnMethod.values];

    return SizedBox(
      height: 44,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: options.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (BuildContext context, int index) {
          final LearnMethod? method = options[index];
          final bool isSelected = method == selected;

          return _FilterChip(
            label: method?.label ?? 'Todos',
            isSelected: isSelected,
            onTap: () => onChanged(method),
          );
        },
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isSelected ? AppColors.text : AppColors.surface,
      borderRadius: BorderRadius.circular(999),
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onTap: onTap,
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: 18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: isSelected ? AppColors.text : AppColors.border,
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isSelected ? Colors.white : AppColors.text,
            ),
          ),
        ),
      ),
    );
  }
}
