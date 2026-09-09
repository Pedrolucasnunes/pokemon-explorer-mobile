import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';

/**
 * Card branco com título em destaque, usado nos blocos EFEITO, DESCRIÇÃO e
 * DETALHES da Tela 6.
 */
export default function InfoCard({ title, children, style }) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

/** Linha rótulo/valor do bloco DETALHES. */
export function InfoRow({ label, value, isLast = false }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: colors.brand,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  rowValue: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
  },
});
