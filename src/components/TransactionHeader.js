/**
 * Transaction Header Component
 * Displays current balance and status message
 * Minimalist flat design with Modern Teal accent
 * @module components/TransactionHeader
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils';
import { Colors, Spacing, Radius, Shadows, Typography } from '../constants';

/**
 * TransactionHeader - Clean header showing balance and status
 *
 * @param {object} props - Component props
 * @param {number} props.currentBalance - Current balance to display
 * @param {string} props.currency - Currency code
 * @param {string} props.statusMessage - Status message (e.g., budget deficit warning)
 * @param {boolean} props.isBudgetDeficit - Whether the status indicates a budget deficit
 */
const TransactionHeader = ({
  currentBalance,
  currency = 'XOF',
  statusMessage,
  isBudgetDeficit = false
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.label}>Solde actuel</Text>
        <Text style={styles.balance}>{formatCurrency(currentBalance, currency)}</Text>
        {statusMessage && (
          <View style={[
            styles.statusBadge,
            isBudgetDeficit ? styles.deficitBadge : styles.normalBadge
          ]}>
            <Text style={[
              styles.statusText,
              isBudgetDeficit && styles.deficitText
            ]}>
              {statusMessage}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  balanceCard: {
    backgroundColor: Colors.primary.main,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.primary.subtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  balance: {
    ...Typography.h1,
    color: Colors.text.inverse,
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    marginTop: Spacing.xs,
  },
  normalBadge: {
    backgroundColor: `${Colors.text.inverse}20`,
  },
  deficitBadge: {
    backgroundColor: `${Colors.error}20`,
  },
  statusText: {
    ...Typography.small,
    color: Colors.text.inverse,
  },
  deficitText: {
    color: '#FFCDD2',
    fontWeight: '600',
  },
});

export default TransactionHeader;
