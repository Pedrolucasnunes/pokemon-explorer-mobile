import 'package:flutter/material.dart';

import '../theme/pokemon_types.dart';

/// Tamanhos previstos para o chip de tipo.
enum TypeChipSize { small, large }

/// Chip colorido de tipo de Pokémon.
///
/// Equivalente ao componente `TypeChip` da versão em React Native: é o menor
/// bloco reutilizável da tela e aparece tanto no cabeçalho (variante invertida)
/// quanto em cada linha da lista de movimentos.
class TypeChip extends StatelessWidget {
  const TypeChip({
    super.key,
    required this.typeName,
    this.size = TypeChipSize.small,
    this.inverted = false,
  });

  final String typeName;
  final TypeChipSize size;

  /// Quando verdadeiro, o chip fica branco com o texto na cor do tipo — usado
  /// sobre o cabeçalho colorido.
  final bool inverted;

  @override
  Widget build(BuildContext context) {
    final PokemonTypeInfo info = typeInfo(typeName);
    final bool isLarge = size == TypeChipSize.large;

    final Color background = inverted ? Colors.white : info.color;
    final Color foreground =
        inverted ? info.color : contrastingTextColor(info.color);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isLarge ? 16 : 10,
        vertical: isLarge ? 8 : 4,
      ),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        info.label,
        style: TextStyle(
          color: foreground,
          fontSize: isLarge ? 14 : 12,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
