import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';

/**
 * Estado (b) da Tela 7: erro de conexão.
 *
 * Mostra o código HTTP retornado quando ele existe e devolve o controle ao
 * usuário com o botão "Tentar novamente", em vez de encerrar o fluxo.
 */
export default function ErrorState({ error, onRetry, title = 'Não foi possível conectar' }) {
  const statusLine = error?.status ? `Erro ${error.status} · pokeapi.co` : 'Sem conexão · pokeapi.co';

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>!</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>Verifique sua conexão e tente novamente.</Text>

      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </Pressable>

      <Text style={styles.status}>{statusLine}</Text>
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
    backgroundColor: '#FDE7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  badgeText: {
    color: colors.brand,
    fontSize: 28,
    fontWeight: '800',
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
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  buttonPressed: {
    backgroundColor: colors.brandDark,
  },
  buttonText: {
    color: colors.textOnDark,
    fontSize: 15,
    fontWeight: '700',
  },
  status: {
    marginTop: spacing.lg,
    fontSize: 13,
    color: colors.textMuted,
  },
});
