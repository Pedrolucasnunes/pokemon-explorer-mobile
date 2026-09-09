import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme/colors';

/**
 * Estado (a) da Tela 7: placeholders no formato dos cards.
 *
 * Preserva o leiaute do grid enquanto a requisição não retorna, o que reduz a
 * sensação de espera e evita a tela em branco.
 */
function SkeletonCard({ opacity }) {
  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.number} />
      <View style={styles.image} />
      <View style={styles.name} />
      <View style={styles.chip} />
    </Animated.View>
  );
}

export default function SkeletonGrid({ count = 6 }) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 700, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} opacity={pulse} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 190,
  },
  number: {
    alignSelf: 'flex-end',
    width: 42,
    height: 13,
    borderRadius: 4,
    backgroundColor: colors.skeleton,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.skeleton,
    marginTop: spacing.sm,
  },
  name: {
    width: '70%',
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.skeleton,
    marginTop: spacing.md,
  },
  chip: {
    width: 62,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.skeleton,
    marginTop: spacing.sm,
  },
});
