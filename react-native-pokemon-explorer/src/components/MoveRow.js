import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import TypeChip from './TypeChip';
import { ChevronRightIcon } from './Icons';
import { colors, spacing } from '../theme/colors';

/**
 * Linha da lista de movimentos da Tela 5.
 *
 * O subtítulo traduz `move_learn_method.name` em uma frase curta; quando o
 * método é level-up, mostra também o nível em que o Pokémon aprende.
 */
function buildSubtitle(move) {
  switch (move.method) {
    case 'level-up':
      return move.level > 0 ? `level-up · nível ${move.level}` : 'level-up';
    case 'machine':
      return 'machine · MT/HM';
    case 'egg':
      return 'egg';
    case 'tutor':
      return 'tutor';
    default:
      return move.method;
  }
}

function MoveRow({ move, typeName, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(move)}
      accessibilityRole="button"
      accessibilityLabel={`Movimento ${move.displayName}`}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.texts}>
        <Text style={styles.name} numberOfLines={1}>
          {move.displayName}
        </Text>
        <Text style={styles.subtitle}>{buildSubtitle(move)}</Text>
      </View>

      {typeName ? <TypeChip type={typeName} size="sm" /> : null}
      <ChevronRightIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.surface,
  },
  rowPressed: {
    backgroundColor: colors.background,
  },
  texts: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default React.memo(MoveRow);
