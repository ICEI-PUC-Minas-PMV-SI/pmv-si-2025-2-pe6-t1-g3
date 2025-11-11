import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export default function Error404Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Página não encontrada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
});

