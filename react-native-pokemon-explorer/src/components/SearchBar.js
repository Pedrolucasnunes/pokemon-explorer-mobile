import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CloseIcon, SearchIcon } from './Icons';
import { colors, radius, spacing } from '../theme/colors';

/**
 * Campo de busca da Tela 3.
 *
 * O botão de limpar só aparece quando há texto, conforme o protótipo, e a
 * borda ganha a cor da marca enquanto o campo está em foco.
 */
export default function SearchBar({ value, onChangeText, onClear, placeholder = 'Buscar por nome' }) {
  const [isFocused, setIsFocused] = React.useState(false);
  const hasText = value.length > 0;

  return (
    <View style={[styles.container, (isFocused || hasText) && styles.containerActive]}>
      <SearchIcon size={20} color={colors.textSecondary} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar Pokémon por nome"
      />

      {hasText ? (
        <Pressable
          onPress={onClear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
        >
          <CloseIcon size={22} filled />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.surface,
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  containerActive: {
    borderColor: colors.brand,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    padding: 0,
  },
});
