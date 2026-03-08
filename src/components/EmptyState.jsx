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
    title: 'Aucune transaction',
    message: 'Commencez à suivre vos finances en ajoutant votre première transaction',
    actionLabel: 'Ajouter une transaction',
  },
  budgets: {
    icon: 'wallet-outline',
    title: 'Aucun budget',
    message: 'Créez un budget pour mieux gérer vos dépenses',
    actionLabel: 'Créer un budget',
  },
  accounts: {
    icon: 'bank-outline',
    title: 'Aucun compte',
    message: 'Ajoutez vos comptes bancaires pour commencer',
    actionLabel: 'Ajouter un compte',
  },
  statistics: {
    icon: 'chart-bar',
    title: 'Pas assez de données',
    message: 'Ajoutez des transactions pour voir vos statistiques',
  },
  search: {
    icon: 'magnify',
    title: 'Aucun résultat',
    message: 'Essayez de modifier vos critères de recherche',
  },
  error: {
    icon: 'alert-circle-outline',
    title: 'Erreur de chargement',
    message: 'Impossible de charger les données. Veuillez réessayer.',
    actionLabel: 'Réessayer',
  },
  offline: {
    icon: 'wifi-off',
    title: 'Hors connexion',
    message: 'Vérifiez votre connexion internet et réessayez',
    actionLabel: 'Réessayer',
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
