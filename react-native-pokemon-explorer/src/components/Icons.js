import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

/**
 * Ícones montados com View e Text.
 *
 * Optei por desenhá-los em vez de instalar uma biblioteca de ícones: são cinco
 * formas simples, e assim o projeto roda sem nenhuma dependência nativa extra.
 */

export function SearchIcon({ size = 18, color = colors.textSecondary }) {
  const circleSize = size * 0.72;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center' }}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderWidth: 2,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 0,
          bottom: 1,
          width: 2,
          height: size * 0.34,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

export function CloseIcon({ size = 20, color = colors.textSecondary, filled = false }) {
  return (
    <View
      style={[
        styles.closeWrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: filled ? colors.border : 'transparent',
        },
      ]}
    >
      <Text style={{ color, fontSize: size * 0.55, fontWeight: '600', lineHeight: size * 0.7 }}>
        ✕
      </Text>
    </View>
  );
}

export function BackArrowIcon({ size = 26, color = colors.textOnDark }) {
  return <Text style={{ color, fontSize: size, fontWeight: '400' }}>←</Text>;
}

export function ChevronRightIcon({ size = 26, color = colors.textMuted }) {
  return (
    <Text style={{ color, fontSize: size, fontWeight: '300', lineHeight: size * 1.05 }}>›</Text>
  );
}

export function PhotoPlaceholderIcon({ size = 96, color = colors.textOnDark }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.18,
        borderWidth: size * 0.05,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.16,
          height: size * 0.16,
          borderRadius: size * 0.08,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.2,
          left: size * 0.2,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: size * 0.16,
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.24,
          borderRightWidth: size * 0.24,
          borderBottomWidth: size * 0.3,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  closeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
