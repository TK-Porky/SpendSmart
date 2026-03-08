/**
 * Loading Spinner Component
 * Displays a centered loading indicator with optional message
 * @module components/LoadingSpinner
 */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants';

/**
 * Loading Spinner Props
 * @typedef {Object} LoadingSpinnerProps
 * @property {string} [message] - Optional loading message
 * @property {string} [size='large'] - Spinner size ('small' | 'large')
 * @property {string} [color] - Spinner color
 * @property {boolean} [fullScreen=false] - Whether to take full screen
 * @property {Object} [style] - Additional container styles
 */

/**
 * Loading Spinner Component
 * @param {LoadingSpinnerProps} props
 */
const LoadingSpinner = ({
  message,
  size = 'large',
  color = Colors.primary.main,
  fullScreen = false,
  style,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
