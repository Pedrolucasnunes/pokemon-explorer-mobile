import 'package:flutter/material.dart';

import 'app_colors.dart';

// Reexportado para que quem importa o tema receba também a paleta base.
export 'app_colors.dart';

/// Rótulo em português e cor de um tipo de Pokémon.
class PokemonTypeInfo {
  const PokemonTypeInfo(this.label, this.color);

  final String label;
  final Color color;
}

/// Mesma tabela usada pelo aplicativo principal, mantendo a identidade visual
/// entre as duas tecnologias.
const Map<String, PokemonTypeInfo> kPokemonTypes = <String, PokemonTypeInfo>{
  'normal': PokemonTypeInfo('Normal', Color(0xFFA8A77A)),
  'fighting': PokemonTypeInfo('Lutador', Color(0xFFC22E28)),
  'flying': PokemonTypeInfo('Voador', Color(0xFFA98FF3)),
  'poison': PokemonTypeInfo('Venenoso', Color(0xFFA33EA1)),
  'ground': PokemonTypeInfo('Terrestre', Color(0xFFE2BF65)),
  'rock': PokemonTypeInfo('Pedra', Color(0xFFB6A136)),
  'bug': PokemonTypeInfo('Inseto', Color(0xFFA6B91A)),
  'ghost': PokemonTypeInfo('Fantasma', Color(0xFF735797)),
  'steel': PokemonTypeInfo('Aço', Color(0xFFB7B7CE)),
  'fire': PokemonTypeInfo('Fogo', Color(0xFFEE8130)),
  'water': PokemonTypeInfo('Água', Color(0xFF6390F0)),
  'grass': PokemonTypeInfo('Grama', Color(0xFF63BC5A)),
  'electric': PokemonTypeInfo('Elétrico', Color(0xFFF7D02C)),
  'psychic': PokemonTypeInfo('Psíquico', Color(0xFFF95587)),
  'ice': PokemonTypeInfo('Gelo', Color(0xFF96D9D6)),
  'dragon': PokemonTypeInfo('Dragão', Color(0xFF6F35FC)),
  'dark': PokemonTypeInfo('Sombrio', Color(0xFF705746)),
  'fairy': PokemonTypeInfo('Fada', Color(0xFFD685AD)),
};

const PokemonTypeInfo _fallbackType =
    PokemonTypeInfo('Desconhecido', Color(0xFF68A090));

PokemonTypeInfo typeInfo(String typeName) =>
    kPokemonTypes[typeName] ?? _fallbackType;

/// Escolhe texto claro ou escuro sobre uma cor de fundo, para que tipos claros
/// como Elétrico e Gelo continuem legíveis.
Color contrastingTextColor(Color background) {
  return background.computeLuminance() > 0.62
      ? AppColors.text
      : Colors.white;
}
