/**
 * Empty State Component
 * Displays a friendly message when there's no data to show
 * @module components/EmptyState
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants';

/**
 * Empty State Props
 * @typedef {Object} EmptyStateProps
 * @property {string} icon - MaterialCommunityIcons icon name
 * @property {string} title - Main title text
 * @property {string} [message] - Optional description
 * @property {string} [actionLabel] - Button label
 * @property {function} [onAction] - Button press handler
 * @property {Object} [style] - Additional container styles
 */

/**
 * Empty State Component
 * @param {EmptyStateProps} props
 */
const EmptyState = ({
  icon = 'inbox-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={64} color={Colors.text.tertiary} />
      </View>

      <Text style={styles.title}>{title}</Text>

      {message && <Text style={styles.message}>{message}</Text>}

      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/**
 * Predefined empty state configurations
 */
export const EmptyStatePresets = {
  transactions: {
    icon: 'swap-horizontal',
    title: 'No transactions',
    message: 'Start tracking your finances by adding your first transaction',
    actionLabel: 'Add a transaction',
  },
  budgets: {
    icon: 'wallet-outline',
    title: 'No budgets',
    message: 'Create a budget to better manage your expenses',
    actionLabel: 'Create a budget',
  },
  accounts: {
    icon: 'bank-outline',
    title: 'No accounts',
    message: 'Add your bank accounts to get started',
    actionLabel: 'Add an account',
  },
  statistics: {
    icon: 'chart-bar',
    title: 'Not enough data',
    message: 'Add transactions to see your statistics',
  },
  search: {
    icon: 'magnify',
    title: 'No results',
    message: 'Try modifying your search criteria',
  },
  error: {
    icon: 'alert-circle-outline',
    title: 'Loading error',
    message: 'Unable to load data. Please try again.',
    actionLabel: 'Try again',
  },
  offline: {
    icon: 'wifi-off',
    title: 'Offline',
    message: 'Check your internet connection and try again',
    actionLabel: 'Try again',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.7,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});

export default EmptyState;
