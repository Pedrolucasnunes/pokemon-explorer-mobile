import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import TypeChip from './TypeChip';
import { colors, radius, spacing } from '../theme/colors';
import { formatPokedexNumber } from '../utils/format';

/**
 * Card do grid da Tela 2: número da Pokédex, sprite, nome e chips de tipo.
 * Envolvido em React.memo porque a lista chega a centenas de itens e o card
 * só muda quando o próprio Pokémon muda.
 */
function PokemonCard({ pokemon, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={`${pokemon.displayName}, número ${pokemon.id}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Text style={styles.number}>{formatPokedexNumber(pokemon.id)}</Text>

      <View style={styles.imageWrapper}>
        {pokemon.imageUrl ? (
          <Image source={{ uri: pokemon.imageUrl }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={styles.imageFallbackText}>?</Text>
          </View>
        )}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {pokemon.displayName}
      </Text>

      <View style={styles.typeRow}>
        {pokemon.types.map((type) => (
          <TypeChip key={type} type={type} size="sm" />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 190,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  number: {
    alignSelf: 'flex-end',
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  imageWrapper: {
    height: 78,
    justifyContent: 'center',
  },
  image: {
    width: 78,
    height: 78,
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  imageFallbackText: {
    color: colors.textMuted,
    fontSize: 26,
    fontWeight: '700',
  },
  name: {
    marginTop: spacing.sm,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
});

export default React.memo(PokemonCard);
