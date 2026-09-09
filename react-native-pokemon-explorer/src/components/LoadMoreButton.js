import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';

/** Botão "Carregar mais" do rodapé da listagem: avança a paginação em 20 itens. */
export default function LoadMoreButton({ onPress, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      {loading ? (
        <ActivityIndicator color={colors.brand} />
      ) : (
        <Text style={styles.text}>Carregar mais</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    minHeight: 56,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  text: {
    color: colors.brand,
    fontSize: 16,
    fontWeight: '700',
  },
});
