import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import ErrorState from '../components/ErrorState';
import InfoCard, { InfoRow } from '../components/InfoCard';
import StatBox from '../components/StatBox';
import TypeChip from '../components/TypeChip';
import { BackArrowIcon } from '../components/Icons';
import { getDamageClassLabel } from '../api/adapters';
import { useMoveDetail } from '../hooks/useResource';
import { colors, radius, spacing } from '../theme/colors';
import { getTypeColor } from '../theme/pokemonTypes';
import { formatNullable, formatVersionName } from '../utils/format';

/**
 * TELA 6 — DETALHES DO MOVIMENTO
 *
 * Números primeiro, texto depois: essa hierarquia permite comparar movimentos
 * rapidamente. Campos que a API devolve como null (power e accuracy de golpes
 * de status) aparecem como travessão, e não omitidos, para não dar a impressão
 * de erro de carregamento.
 */
export default function MoveDetailScreen({ navigation, route }) {
  const { moveName, moveDisplayName, pokemonDisplayName } = route.params;
  const insets = useSafeAreaInsets();

  const { move, status, error, retry } = useMoveDetail(moveName);

  const headerColor = move ? getTypeColor(move.type) : colors.brand;

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={{ height: insets.top }} />
        <Pressable onPress={() => navigation.goBack()} style={styles.backButtonDark} hitSlop={12}>
          <BackArrowIcon color={colors.text} />
        </Pressable>
        <ErrorState error={error} onRetry={retry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={{ height: insets.top, backgroundColor: headerColor }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: headerColor }]}>
          <View style={styles.headerCircle} />

          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
          >
            <BackArrowIcon />
          </Pressable>

          <Text style={styles.name}>{move ? move.displayName : moveDisplayName}</Text>
          <Text style={styles.origin}>
            {move ? `Movimento #${move.id} · ${pokemonDisplayName}` : pokemonDisplayName}
          </Text>
        </View>

        <View style={styles.sheet}>
          {status === 'loading' || !move ? (
            <Text style={styles.loadingText}>Carregando movimento…</Text>
          ) : (
            <>
              <View style={styles.chipRow}>
                <TypeChip type={move.type} size="lg" />

                <View style={[styles.classChip, { backgroundColor: '#3F4046' }]}>
                  <Text style={styles.classChipText}>
                    {getDamageClassLabel(move.damageClass)}
                  </Text>
                </View>

                {move.ailmentLabel ? (
                  <View style={styles.outlineChip}>
                    <Text style={styles.outlineChipText}>{move.ailmentLabel}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.statsRow}>
                <StatBox variant="boxed" value={formatNullable(move.power)} label="Poder" />
                <StatBox variant="boxed" value={formatNullable(move.accuracy, '%')} label="Precisão" />
                <StatBox variant="boxed" value={formatNullable(move.pp)} label="PP" />
                <StatBox variant="boxed" value={formatNullable(move.priority)} label="Prioridade" />
              </View>

              <InfoCard title="EFEITO" style={styles.block}>
                <Text style={styles.paragraph}>
                  {move.shortEffect || 'Sem descrição de efeito disponível.'}
                </Text>
              </InfoCard>

              <InfoCard title="DESCRIÇÃO" style={styles.block}>
                <Text style={styles.paragraph}>
                  {move.flavor ? move.flavor.text : 'Sem texto descritivo nos jogos.'}
                </Text>
                {move.flavor?.versionGroup ? (
                  <Text style={styles.version}>
                    Versão: {formatVersionName(move.flavor.versionGroup)}
                  </Text>
                ) : null}
              </InfoCard>

              <InfoCard title="DETALHES" style={styles.block}>
                <InfoRow label="Alvo" value={move.target || '—'} />
                <InfoRow label="Geração" value={move.generation || '—'} />
                <InfoRow label="Classe de dano" value={move.damageClass || '—'} />
                <InfoRow
                  label="Chance de efeito"
                  value={formatNullable(move.effectChance, '%')}
                  isLast
                />
              </InfoCard>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute',
    top: -150,
    right: -70,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.overlayLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonDark: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
  },
  name: {
    marginTop: spacing.lg,
    fontSize: 38,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  origin: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    minHeight: 420,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 15,
    paddingVertical: spacing.xxl,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
  },
  classChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  classChipText: {
    color: colors.textOnDark,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineChipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  block: {
    marginTop: spacing.lg,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.text,
  },
  version: {
    marginTop: spacing.md,
    fontSize: 13.5,
    color: colors.textMuted,
  },
});
