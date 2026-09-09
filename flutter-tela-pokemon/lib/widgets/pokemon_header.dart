import 'package:flutter/material.dart';

import '../models/pokemon_detail.dart';
import '../theme/pokemon_types.dart';
import 'type_chip.dart';

/// Cabeçalho da Tela 5: recebe a cor do tipo primário e reúne botão de voltar,
/// nome, número, categoria da espécie, chips de tipo e o sprite.
class PokemonHeader extends StatelessWidget {
  const PokemonHeader({
    super.key,
    required this.pokemon,
    required this.onBack,
  });

  final PokemonDetail pokemon;
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    final Color headerColor = typeInfo(pokemon.primaryType).color;
    final double topInset = MediaQuery.of(context).padding.top;

    return ClipRect(
      child: Container(
        color: headerColor,
        padding: EdgeInsets.fromLTRB(16, topInset + 8, 16, 24),
        child: Stack(
          clipBehavior: Clip.none,
          children: <Widget>[
            // Círculo decorativo do protótipo.
            Positioned(
              top: -180,
              right: -80,
              child: Container(
                width: 320,
                height: 320,
                decoration: const BoxDecoration(
                  color: AppColors.overlayLight,
                  shape: BoxShape.circle,
                ),
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                IconButton(
                  onPressed: onBack,
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(
                    minWidth: 40,
                    minHeight: 40,
                  ),
                  alignment: Alignment.centerLeft,
                  icon: const Icon(
                    Icons.arrow_back,
                    color: Colors.white,
                    size: 26,
                  ),
                  tooltip: 'Voltar',
                ),
                const SizedBox(height: 8),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        pokemon.name,
                        style: const TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Text(
                        pokemon.pokedexNumber,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textOnDarkSoft,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  pokemon.genus,
                  style: const TextStyle(
                    fontSize: 16,
                    color: AppColors.textOnDarkSoft,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: <Widget>[
                    for (final String type in pokemon.types) ...<Widget>[
                      TypeChip(
                        typeName: type,
                        size: TypeChipSize.large,
                        inverted: true,
                      ),
                      const SizedBox(width: 12),
                    ],
                  ],
                ),
                const SizedBox(height: 16),
                Center(
                  child: Container(
                    width: 190,
                    height: 190,
                    decoration: const BoxDecoration(
                      color: AppColors.overlayLighter,
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: _PokemonSprite(imageUrl: pokemon.imageUrl),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

/// Sprite com estados de carregamento e de falha, para que a tela continue
/// apresentável mesmo sem acesso à internet.
class _PokemonSprite extends StatelessWidget {
  const _PokemonSprite({required this.imageUrl});

  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return Image.network(
      imageUrl,
      width: 150,
      height: 150,
      fit: BoxFit.contain,
      loadingBuilder: (
        BuildContext context,
        Widget child,
        ImageChunkEvent? progress,
      ) {
        if (progress == null) return child;
        return const SizedBox(
          width: 32,
          height: 32,
          child: CircularProgressIndicator(
            color: Colors.white,
            strokeWidth: 2.5,
          ),
        );
      },
      errorBuilder: (BuildContext context, Object error, StackTrace? stack) {
        return const Icon(
          Icons.image_not_supported_outlined,
          color: Colors.white,
          size: 72,
        );
      },
    );
  }
}
