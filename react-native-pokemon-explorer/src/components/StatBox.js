import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';

/**
 * Indicador numérico com rótulo.
 *
 * Usado tanto na faixa altura/peso/experiência da Tela 5 quanto nos quatro
 * indicadores (poder, precisão, PP, prioridade) da Tela 6.
 *
 * variant "inline" -> células divididas por linhas verticais, dentro de um card
 * variant "boxed"  -> cada indicador em seu próprio card
 */
export default function StatBox({ value, label, variant = 'inline', showDivider = false }) {
  const isBoxed = variant === 'boxed';

  return (
    <View style={[styles.container, isBoxed ? styles.boxed : styles.inline, showDivider && styles.divider]}>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    flex: 1,
    paddingVertical: spacing.lg,
  },
  boxed: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  divider: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  value: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.text,
  },
  label: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
