import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import ChipRail from '../components/ChipRail';
import ErrorState from '../components/ErrorState';
import MoveRow from '../components/MoveRow';
import SkeletonGrid from '../components/SkeletonGrid';
import StatBox from '../components/StatBox';
import TypeChip from '../components/TypeChip';
import { BackArrowIcon } from '../components/Icons';
import { usePokemonDetail } from '../hooks/useResource';
import { colors, radius, spacing } from '../theme/colors';
import { getTypeColor } from '../theme/pokemonTypes';
import { formatHeight, formatPokedexNumber, formatWeight } from '../utils/format';

const METHOD_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'level-up', label: 'Nível' },
  { key: 'machine', label: 'MT/HM' },
  { key: 'egg', label: 'Ovo' },
  { key: 'tutor', label: 'Tutor' },
];

/**
 * TELA 5 — DETALHES DO POKÉMON E LISTA DE MOVIMENTOS
 *
 * Cabeçalho na cor do tipo primário com nome, número, categoria da espécie,
 * tipos e imagem; em seguida altura, peso e experiência base; e por fim a lista
 * de movimentos com chips para filtrar por método de aprendizado.
 *
 * Cada linha da lista leva à Tela 6.
 */
export default function PokemonDetailScreen({ navigation, route }) {
  const { name, displayName } = route.params;
  const insets = useSafeAreaInsets();

  const { pokemon, moveTypes, status, error, retry } = usePokemonDetail(name);
  const [methodFilter, setMethodFilter] = useState('all');

  const headerColor = pokemon ? getTypeColor(pokemon.types[0]) : colors.brand;

  const visibleMoves = useMemo(() => {
    if (!pokemon) return [];
    if (methodFilter === 'all') return pokemon.moves;
    return pokemon.moves.filter((move) => move.methods.includes(methodFilter));
  }, [pokemon, methodFilter]);

  const handleOpenMove = useCallback(
    (move) => {
      navigation.navigate('MoveDetail', {
        moveName: move.name,
        moveDisplayName: move.displayName,
        pokemonDisplayName: pokemon ? pokemon.displayName : displayName,
      });
    },
    [navigation, pokemon, displayName]
  );

  const renderMove = useCallback(
    ({ item }) => (
      <MoveRow move={item} typeName={moveTypes[item.name]} onPress={handleOpenMove} />
    ),
    [moveTypes, handleOpenMove]
  );

  const listHeader = pokemon ? (
    <View>
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

        <View style={styles.titleRow}>
          <Text style={styles.name}>{pokemon.displayName}</Text>
          <Text style={styles.number}>{formatPokedexNumber(pokemon.id)}</Text>
        </View>

        {pokemon.genus ? <Text style={styles.genus}>{pokemon.genus}</Text> : null}

        <View style={styles.typeRow}>
          {pokemon.types.map((type) => (
            <TypeChip key={type} type={type} size="lg" variant="inverted" />
          ))}
        </View>

        <View style={styles.spriteWrapper}>
          {pokemon.imageUrl ? (
            <Image source={{ uri: pokemon.imageUrl }} style={styles.sprite} resizeMode="contain" />
          ) : null}
        </View>
      </View>

      <View style={styles.statsCard}>
        <StatBox value={formatHeight(pokemon.height)} label="Altura" />
        <StatBox value={formatWeight(pokemon.weight)} label="Peso" showDivider />
        <StatBox value={String(pokemon.baseExperience ?? '—')} label="Exp. base" showDivider />
      </View>

      <Text style={styles.sectionTitle}>Movimentos ({pokemon.moves.length})</Text>

      <View style={styles.filterWrapper}>
        <ChipRail options={METHOD_FILTERS} selectedKey={methodFilter} onSelect={setMethodFilter} />
      </View>
    </View>
  ) : null;

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={{ height: insets.top }} />
        <SkeletonGrid count={4} />
      </View>
    );
  }

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
      {/* Faixa da status bar pintada com a cor do tipo primário */}
      <View style={{ height: insets.top, backgroundColor: headerColor }} />

      <FlatList
        data={visibleMoves}
        renderItem={renderMove}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Text style={styles.emptyMoves}>
            Nenhum movimento aprendido por este método.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: spacing.xxl + insets.bottom }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={9}
        removeClippedSubviews
      />
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
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute',
    top: -140,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  name: {
    flexShrink: 1,
    fontSize: 36,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  number: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    paddingBottom: 6,
  },
  genus: {
    marginTop: spacing.xs,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  spriteWrapper: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.overlayLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: 150,
    height: 150,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#EBEBF0',
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  filterWrapper: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyMoves: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 15,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
});
