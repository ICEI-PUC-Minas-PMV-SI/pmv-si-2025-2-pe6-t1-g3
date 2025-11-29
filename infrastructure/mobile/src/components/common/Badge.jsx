import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import PropTypes from 'prop-types';

const Badge = ({ children, variant = 'default', style }) => {
  const variantStyles = {
    default: {
      backgroundColor: colors.gray100,
      color: colors.gray800,
    },
    success: {
      backgroundColor: '#D1FAE5',
      color: '#065F46',
    },
    warning: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
    },
    error: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
    },
    info: {
      backgroundColor: '#DBEAFE',
      color: '#1E40AF',
    },
    purple: {
      backgroundColor: '#E9D5FF',
      color: '#6B21A8',
    },
    orange: {
      backgroundColor: '#FFEDD5',
      color: '#9A3412',
    },
  };

  const selectedVariant = variantStyles[variant] || variantStyles.default;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: selectedVariant.backgroundColor },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: selectedVariant.color },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'error', 'info', 'purple', 'orange']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default Badge;
