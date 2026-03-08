/**
 * Button Component
 * Standardized button with multiple variants and sizes
 * @module components/ui/Button
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Typography, Shadows } from '../../constants';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  const iconColor = variant === 'primary' || variant === 'danger'
    ? Colors.neutral[0]
    : variant === 'outline' || variant === 'ghost'
      ? Colors.primary.main
      : Colors.neutral[700];

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? Colors.neutral[0] : Colors.primary.main}
        />
      );
    }

    return (
      <View style={styles.content}>
        {icon && iconPosition === 'left' && (
          <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />
        )}
        <Text style={textStyles}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconRight} />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary.main,
  },
  secondary: {
    backgroundColor: Colors.neutral[100],
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  danger: {
    backgroundColor: Colors.error,
  },

  // Sizes
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
    minHeight: 44,
  },
  size_lg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    minHeight: 52,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },

  // Text styles
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
  text_primary: {
    color: Colors.neutral[0],
  },
  text_secondary: {
    color: Colors.neutral[700],
  },
  text_outline: {
    color: Colors.primary.main,
  },
  text_ghost: {
    color: Colors.primary.main,
  },
  text_danger: {
    color: Colors.neutral[0],
  },
  text_sm: {
    ...Typography.buttonSmall,
  },
  text_md: {
    ...Typography.button,
  },
  text_lg: {
    ...Typography.button,
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.7,
  },

  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});

export default Button;
