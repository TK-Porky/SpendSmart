/**
 * Card Component
 * Base card component with consistent styling
 * @module components/ui/Card
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Shadows } from '../../constants';

const Card = ({
  children,
  variant = 'default',
  onPress,
  padding = 'md',
  style,
  ...props
}) => {
  const cardStyles = [
    styles.base,
    styles[variant],
    styles[`padding_${padding}`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },

  // Variants
  default: {
    // Uses base styles
  },
  elevated: {
    ...Shadows.md,
  },
  outlined: {
    ...Shadows.none,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  flat: {
    ...Shadows.none,
  },

  // Padding sizes
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: Spacing.sm,
  },
  padding_md: {
    padding: Spacing.md,
  },
  padding_lg: {
    padding: Spacing.lg,
  },
});

export default Card;
