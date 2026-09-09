import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MoveDetailScreen from '../screens/MoveDetailScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import PokemonListScreen from '../screens/PokemonListScreen';
import SplashScreen from '../screens/SplashScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

/**
 * Mapa de navegação entregue na fase 1.
 *
 *   Splash  --replace-->  PokemonList  --push-->  PokemonDetail  --push-->  MoveDetail
 *                              <----- goBack ----------- <----- goBack ------
 *
 * O fluxo é linear e reversível. A abertura usa replace para não voltar ao
 * splash; as demais transições empilham, então o botão voltar (e o gesto do
 * sistema) preservam automaticamente a posição de rolagem e os filtros
 * aplicados na listagem, porque a tela permanece montada na pilha.
 *
 * Os cabeçalhos nativos ficam desativados: cada tela desenha o próprio
 * cabeçalho, colorido conforme o tipo do Pokémon ou do movimento.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen name="PokemonList" component={PokemonListScreen} />
        <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} />
        <Stack.Screen name="MoveDetail" component={MoveDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
