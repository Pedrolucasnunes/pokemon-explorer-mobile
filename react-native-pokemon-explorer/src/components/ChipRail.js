import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';
import { getContrastingTextColor } from '../theme/pokemonTypes';

/**
 * Régua horizontal de chips selecionáveis.
 *
 * Um único componente atende dois usos diferentes do aplicativo:
 *  - o filtro por tipo da Tela 4, em que o chip selecionado assume a cor do tipo;
 *  - o filtro por método de aprendizado da Tela 5, em que o selecionado fica escuro.
 *
 * Cada opção é { key, label, color? }; quando color existe, ela é usada no
 * estado selecionado.
 */
export default function ChipRail({ options, selectedKey, onSelect, contentStyle }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, contentStyle]}
    >
      {options.map((option) => {
        const isSelected = option.key === selectedKey;
        const activeColor = option.color || colors.chipNeutral;

        const backgroundColor = isSelected ? activeColor : colors.surface;
        const textColor = isSelected ? getContrastingTextColor(activeColor) : colors.text;
        const borderColor = isSelected ? activeColor : colors.border;

        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.chip,
              { backgroundColor, borderColor, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={[styles.label, { color: textColor }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
