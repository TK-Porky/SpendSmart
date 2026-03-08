/**
 * Balance Card Component
 * Displays current balance with income/expense summary
 * Minimalist flat design with Modern Teal accent
 * @module components/BalanceCard
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCurrency } from '../utils';
import { Colors, Spacing, Radius, Shadows, Typography } from '../constants';

const BalanceCard = ({
  balance,
  income,
  expenses,
  currency = 'XOF',
  onMorePress,
}) => {
  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`Solde total: ${formatCurrency(balance, currency)}. Revenus: ${formatCurrency(income, currency)}. Dépenses: ${formatCurrency(Math.abs(expenses), currency)}`}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solde Total</Text>
        {onMorePress && (
          <TouchableOpacity
            onPress={onMorePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Plus d'options"
          >
            <Icon name="dots-horizontal" size={24} color={Colors.neutral[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Balance Amount */}
      <Text style={styles.balanceText}>{formatCurrency(balance, currency)}</Text>

      {/* Income / Expense Summary */}
      <View style={styles.summaryContainer}>
        {/* Income */}
        <View style={styles.summaryItem}>
          <View style={[styles.iconCircle, styles.incomeIcon]}>
            <Icon name="arrow-down" size={16} color={Colors.success} />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Revenus</Text>
            <Text style={styles.incomeText}>+{formatCurrency(income, currency)}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Expenses */}
        <View style={styles.summaryItem}>
          <View style={[styles.iconCircle, styles.expenseIcon]}>
            <Icon name="arrow-up" size={16} color={Colors.error} />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Dépenses</Text>
            <Text style={styles.expenseText}>-{formatCurrency(Math.abs(expenses), currency)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    ...Typography.caption,
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceText: {
    ...Typography.h1,
    color: Colors.neutral[800],
    marginBottom: Spacing.lg,
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  incomeIcon: {
    backgroundColor: `${Colors.success}15`,
  },
  expenseIcon: {
    backgroundColor: `${Colors.error}15`,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    ...Typography.small,
    color: Colors.neutral[500],
    marginBottom: 2,
  },
  incomeText: {
    ...Typography.bodyBold,
    color: Colors.success,
  },
  expenseText: {
    ...Typography.bodyBold,
    color: Colors.error,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
});

export default BalanceCard;
