import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../../theme';

const LoadingSpinner = ({ size = 'small', color = colors.black, text, style }) => {
  const spinnerSize = size === 'large' ? 'large' : 'small';

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={spinnerSize} color={color} />
      {text && (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  text: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.gray600,
  },
});

export default LoadingSpinner;

