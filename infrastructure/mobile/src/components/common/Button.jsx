import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onPress,
  loading = false,
  style,
  textStyle,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.black,
          borderColor: colors.black,
        };
      case 'secondary':
        return {
          backgroundColor: colors.gray200,
          borderColor: colors.gray200,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.gray300,
        };
      case 'danger':
        return {
          backgroundColor: colors.red600,
          borderColor: colors.red600,
        };
      default:
        return {
          backgroundColor: colors.black,
          borderColor: colors.black,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14 };
      case 'medium':
        return { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 };
      case 'large':
        return { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 };
      default:
        return { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return colors.white;
      case 'secondary':
        return colors.gray900;
      case 'outline':
        return colors.gray700;
      default:
        return colors.white;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles,
        sizeStyles,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize: sizeStyles.fontSize }, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;

