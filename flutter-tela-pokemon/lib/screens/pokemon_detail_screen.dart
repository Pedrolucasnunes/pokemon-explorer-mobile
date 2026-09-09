import 'package:flutter/material.dart';

import '../models/pokemon_detail.dart';
import '../theme/pokemon_types.dart';
import '../widgets/method_filter_bar.dart';
import '../widgets/move_tile.dart';
import '../widgets/pokemon_header.dart';
import '../widgets/stat_box.dart';

/// TELA 5 — DETALHES DO POKÉMON E LISTA DE MOVIMENTOS
///
/// Versão em Flutter da tela desenvolvida como tecnologia secundária da fase 2.
/// A estrutura visual e o comportamento do filtro são os mesmos da versão em
/// React Native; a única diferença é a origem dos dados, que aqui vêm de uma
/// constante em memória em vez da PokéAPI.
class PokemonDetailScreen extends StatefulWidget {
  const PokemonDetailScreen({super.key, required this.pokemon});

  final PokemonDetail pokemon;

  @override
  State<PokemonDetailScreen> createState() => _PokemonDetailScreenState();
}

class _PokemonDetailScreenState extends State<PokemonDetailScreen> {
  /// Método selecionado na régua de filtros; `null` significa "Todos".
  LearnMethod? _selectedMethod;

  /// Movimento destacado na lista.
  String? _selectedMoveName;

  void _handleMoveTap(MoveSummary move) {
    setState(() => _selectedMoveName = move.name);

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(
            '${move.name} · no aplicativo principal, este toque abre a '
            'tela de detalhes do movimento.',
          ),
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    final PokemonDetail pokemon = widget.pokemon;
    final List<MoveSummary> visibleMoves = pokemon.movesBy(_selectedMethod);
    final Color headerColor = typeInfo(pokemon.primaryType).color;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Container(
        // Pinta a área da status bar com a cor do tipo primário.
        color: headerColor,
        child: CustomScrollView(
          slivers: <Widget>[
            SliverToBoxAdapter(
              child: PokemonHeader(
                pokemon: pokemon,
                onBack: () => Navigator.of(context).maybePop(),
              ),
            ),
            SliverToBoxAdapter(
              child: Container(
                color: AppColors.background,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const SizedBox(height: 24),
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppColors.statsCard,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: <Widget>[
                          StatBox(
                            value: pokemon.formattedHeight,
                            label: 'Altura',
                          ),
                          StatBox(
                            value: pokemon.formattedWeight,
                            label: 'Peso',
                            showDivider: true,
                          ),
                          StatBox(
                            value: '${pokemon.baseExperience}',
                            label: 'Exp. base',
                            showDivider: true,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Movimentos (${pokemon.moves.length})',
                        style: const TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w800,
                          color: AppColors.text,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    MethodFilterBar(
                      selected: _selectedMethod,
                      onChanged: (LearnMethod? method) {
                        setState(() => _selectedMethod = method);
                      },
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
            if (visibleMoves.isEmpty)
              const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 32),
                  child: Text(
                    'Nenhum movimento aprendido por este método.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 15,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              )
            else
              SliverList.builder(
                itemCount: visibleMoves.length,
                itemBuilder: (BuildContext context, int index) {
                  final MoveSummary move = visibleMoves[index];
                  return MoveTile(
                    move: move,
                    isSelected: move.name == _selectedMoveName,
                    onTap: () => _handleMoveTap(move),
                  );
                },
              ),
            SliverToBoxAdapter(
              child: Container(
                height: MediaQuery.of(context).padding.bottom + 24,
                color: AppColors.surface,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
