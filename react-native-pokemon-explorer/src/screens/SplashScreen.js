import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { PhotoPlaceholderIcon } from '../components/Icons';
import { preloadFirstPage } from '../api/pokeApi';
import { colors, spacing } from '../theme/colors';

const MAX_SPLASH_MS = 3000;

/**
 * TELA 1 — ABERTURA (SPLASH)
 *
 * Apresenta a marca e, ao mesmo tempo, dispara a primeira requisição da coleção
 * (GET /pokemon?limit=20&offset=0). Permanece visível por no máximo 3 segundos
 * ou até a resposta chegar, o que ocorrer primeiro.
 *
 * O resultado fica no cache do cliente HTTP, então a listagem já abre preenchida.
 * Se a chamada falhar, seguimos para a listagem mesmo assim: ela reexecuta a
 * requisição e assume o estado de erro da Tela 7.
 */
export default function SplashScreen({ navigation }) {
  const hasNavigated = useRef(false);

  useEffect(() => {
    const goToList = () => {
      if (hasNavigated.current) return;
      hasNavigated.current = true;
      navigation.replace('PokemonList');
    };

    const timeoutId = setTimeout(goToList, MAX_SPLASH_MS);

    preloadFirstPage()
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeoutId);
        goToList();
      });

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Círculos decorativos do protótipo */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <View style={styles.content}>
        <View style={styles.logo}>
          <PhotoPlaceholderIcon size={92} />
        </View>

        <Text style={styles.title}>Pokémon Explorer</Text>
        <Text style={styles.subtitle}>Consulte Pokémon e seus movimentos</Text>

        <View style={styles.loadingBlock}>
          <ActivityIndicator size="large" color={colors.textOnDark} />
          <Text style={styles.loadingText}>Carregando Pokédex…</Text>
        </View>
      </View>

      <Text style={styles.footer}>Dados fornecidos por PokéAPI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circleTop: {
    position: 'absolute',
    top: -120,
    right: -90,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: colors.overlayLight,
  },
  circleBottom: {
    position: 'absolute',
    bottom: -160,
    left: -110,
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: colors.overlayLight,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: colors.textOnDark,
    backgroundColor: colors.overlayLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: spacing.xxl,
    fontSize: 34,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  subtitle: {
    marginTop: spacing.md,
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.88)',
  },
  loadingBlock: {
    marginTop: 56,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
