import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SearchIcon } from './Icons';
import { colors, radius, spacing } from '../theme/colors';

/**
 * Estado (c) da Tela 7: busca sem resultados.
 *
 * Diferencia "não encontrei" de "deu erro", que são problemas distintos para o
 * usuário, e oferece o atalho para limpar a busca.
 */
export default function EmptyState({ query, onClear }) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <SearchIcon size={26} color={colors.textMuted} />
      </View>

      <Text style={styles.title}>Nenhum Pokémon encontrado</Text>
      <Text style={styles.message}>
        {query
          ? `Não achamos resultados para “${query}”. Tente outro nome.`
          : 'Nenhum Pokémon corresponde aos filtros aplicados.'}
      </Text>

      <Pressable
        onPress={onClear}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Limpar busca</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.sm,
    fontSize: 15,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  buttonPressed: {
    backgroundColor: colors.border,
  },
  buttonText: {
    color: colors.brand,
    fontSize: 15,
    fontWeight: '700',
  },
});
