import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';

/**
 * Pokémon Explorer — Fase 2
 * Desenvolvimento de Sistemas Mobile
 * Pedro Lucas Fonseca Nunes
 *
 * Tecnologia principal: React Native (Expo)
 * Dados: PokéAPI (https://pokeapi.co/api/v2)
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
