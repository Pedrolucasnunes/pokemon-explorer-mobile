import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius } from '../theme/colors';
import { getContrastingTextColor, getTypeInfo } from '../theme/pokemonTypes';

/**
 * Chip colorido de tipo de Pokémon.
 *
 * Componente base reaproveitado nos cards da listagem, no cabeçalho do detalhe
 * e em cada linha da lista de movimentos.
 *
 * variant "solid"    -> fundo na cor do tipo (cards e lista de movimentos)
 * variant "inverted" -> fundo branco com texto na cor do tipo (cabeçalho colorido)
 */
export default function TypeChip({ type, size = 'md', variant = 'solid' }) {
  const info = getTypeInfo(type);
  const isSolid = variant === 'solid';

  const backgroundColor = isSolid ? info.color : '#FFFFFF';
  const textColor = isSolid ? getContrastingTextColor(info.color) : info.color;

  return (
    <View style={[styles.chip, styles[`${size}Chip`], { backgroundColor }]}>
      <Text style={[styles.label, styles[`${size}Label`], { color: textColor }]} numberOfLines={1}>
        {info.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
  },
  smChip: { paddingHorizontal: 9, paddingVertical: 3 },
  smLabel: { fontSize: 11 },
  mdChip: { paddingHorizontal: 12, paddingVertical: 5 },
  mdLabel: { fontSize: 12.5 },
  lgChip: { paddingHorizontal: 16, paddingVertical: 8 },
  lgLabel: { fontSize: 14 },
});
