import 'package:flutter/material.dart';

import 'data/mock_pokemon.dart';
import 'screens/pokemon_detail_screen.dart';
import 'theme/pokemon_types.dart';

/// Pokémon Explorer — Fase 2
/// Desenvolvimento de Sistemas Mobile
/// Pedro Lucas Fonseca Nunes
///
/// Tecnologia SECUNDÁRIA do projeto: reimplementação da Tela 5 (detalhes do
/// Pokémon e lista de movimentos) em Flutter, alimentada por dados em memória,
/// conforme o item 2 do enunciado da fase 2.
void main() {
  runApp(const PokemonExplorerApp());
}

class PokemonExplorerApp extends StatelessWidget {
  const PokemonExplorerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pokémon Explorer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.brand),
      ),
      home: const PokemonDetailScreen(pokemon: bulbasaur),
    );
  }
}
