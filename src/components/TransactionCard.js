/**
 * Transaction Card Component
 * Displays a single transaction with icon, details, and amount
 * Minimalist flat design
 * @module components/TransactionCard
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatCurrency, formatDate } from '../utils';
import { Colors, Spacing, Radius, Shadows, Typography } from '../constants';

/**
 * Transaction type icon mapping
 */
const getTransactionIcon = (type, categoryIcon) => {
  if (categoryIcon) return categoryIcon;
  switch (type) {
    case 'income':
      return 'arrow-down-circle';
    case 'expense':
      return 'arrow-up-circle';
    case 'transfer':
      return 'swap-horizontal-circle';
    default:
      return 'cash';
  }
};

const TransactionCard = ({ transaction, onPress }) => {
  const isIncome = transaction.type === 'income';
  const isTransfer = transaction.type === 'transfer';

  const amountColor = isIncome
    ? Colors.success
    : isTransfer
      ? Colors.primary.main
      : Colors.error;

  const iconBgColor = isIncome
    ? `${Colors.success}12`
    : isTransfer
      ? `${Colors.primary.main}12`
      : `${Colors.error}12`;

  const iconName = getTransactionIcon(transaction.type, transaction.categoryIcon);

  const displayAmount = isIncome
    ? `+${formatCurrency(transaction.amount, transaction.currency)}`
    : isTransfer
      ? formatCurrency(Math.abs(transaction.amount), transaction.currency)
      : `-${formatCurrency(Math.abs(transaction.amount), transaction.currency)}`;

  const accessibilityLabel = `${transaction.title || transaction.categoryName || 'Transaction'}, ${displayAmount}, ${transaction.description || formatDate(transaction.date)}`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(transaction)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Appuyez pour voir les détails de la transaction"
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon name={iconName} size={22} color={amountColor} />
      </View>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.title || transaction.categoryName || 'Transaction'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {transaction.description || formatDate(transaction.date)}
        </Text>
      </View>

      {/* Amount */}
      <Text style={[styles.amount, { color: amountColor }]}>
        {displayAmount}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  detailsContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  amount: {
    ...Typography.bodyBold,
  },
});

export default TransactionCard;
