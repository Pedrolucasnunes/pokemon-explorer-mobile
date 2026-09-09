import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import ChipRail from '../components/ChipRail';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadMoreButton from '../components/LoadMoreButton';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import SkeletonGrid from '../components/SkeletonGrid';
import { usePokemonList } from '../hooks/usePokemonList';
import { colors, spacing } from '../theme/colors';
import { getTypeColor, getTypeLabel } from '../theme/pokemonTypes';
import { formatThousands } from '../utils/format';

const ALL_TYPES_OPTION = { key: 'all', label: 'Todos' };

/**
 * TELA 2 — LISTAGEM DE POKÉMON
 * TELA 3 — BUSCA / FILTRAGEM POR NOME  (estado desta tela)
 * TELA 4 — FILTRAGEM POR TIPO          (estado desta tela)
 * TELA 7 — CARREGAMENTO, ERRO E VAZIO  (estados desta tela)
 *
 * Os filtros não abrem uma nova rota: alteram o conteúdo do grid, preservando o
 * contexto e mantendo o aplicativo com quatro rotas apenas.
 */
export default function PokemonListScreen({ navigation }) {
  const {
    items,
    types,
    totalCount,
    matchCount,
    status,
    error,
    isEmpty,
    query,
    setQuery,
    appliedQuery,
    selectedType,
    toggleType,
    clearQuery,
    clearFilters,
    loadingMore,
    canLoadMore,
    loadMore,
    retry,
  } = usePokemonList();

  const typeOptions = useMemo(
    () => [
      ALL_TYPES_OPTION,
      ...types.map((type) => ({ ...type, color: getTypeColor(type.key) })),
    ],
    [types]
  );

  const handleSelectType = useCallback(
    (key) => toggleType(key === 'all' ? null : key),
    [toggleType]
  );

  const handleOpenPokemon = useCallback(
    (pokemon) => {
      navigation.navigate('PokemonDetail', {
        name: pokemon.name,
        displayName: pokemon.displayName,
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => <PokemonCard pokemon={item} onPress={handleOpenPokemon} />,
    [handleOpenPokemon]
  );

  const keyExtractor = useCallback((item) => String(item.id), []);

  const hasActiveFilter = appliedQuery.length > 0 || selectedType !== null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Cabeçalho fixo: título, busca e régua de tipos */}
      <View style={styles.header}>
        <Text style={styles.title}>Pokémon Explorer</Text>
        <Text style={styles.subtitle}>
          {totalCount ? `${formatThousands(totalCount)} Pokémon disponíveis` : 'Carregando…'}
        </Text>

        <View style={styles.searchWrapper}>
          <SearchBar value={query} onChangeText={setQuery} onClear={clearQuery} />
        </View>

        <ChipRail
          options={typeOptions}
          selectedKey={selectedType || 'all'}
          onSelect={handleSelectType}
        />
      </View>

      {/* Linha de contexto do filtro ativo */}
      {hasActiveFilter && status === 'ready' ? (
        <View style={styles.filterInfo}>
          <Text style={styles.filterInfoText} numberOfLines={1}>
            {appliedQuery
              ? `${formatThousands(matchCount)} ${
                  matchCount === 1 ? 'resultado' : 'resultados'
                } para “${appliedQuery}”`
              : `Filtrando por tipo: ${getTypeLabel(selectedType)}`}
          </Text>

          <Pressable
            onPress={clearFilters}
            accessibilityRole="button"
            style={({ pressed }) => [styles.clearButton, pressed && styles.clearButtonPressed]}
          >
            <Text style={styles.clearButtonText}>Limpar</Text>
          </Pressable>
        </View>
      ) : null}

      {status === 'loading' ? <SkeletonGrid count={6} /> : null}

      {status === 'error' ? <ErrorState error={error} onRetry={retry} /> : null}

      {status === 'ready' && isEmpty ? (
        <EmptyState query={appliedQuery} onClear={clearFilters} />
      ) : null}

      {status === 'ready' && !isEmpty ? (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          windowSize={7}
          removeClippedSubviews
          ListFooterComponent={
            canLoadMore ? (
              <LoadMoreButton onPress={loadMore} loading={loadingMore} />
            ) : (
              <Text style={styles.endOfList}>Fim dos resultados</Text>
            )
          }
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    paddingHorizontal: spacing.lg,
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
    fontSize: 15,
    color: colors.textSecondary,
  },
  searchWrapper: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filterInfoText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
  },
  clearButton: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearButtonText: {
    color: colors.brand,
    fontWeight: '700',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  column: {
    gap: spacing.md,
  },
  endOfList: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 15,
    paddingVertical: spacing.xl,
  },
});
