/**
 * AccountCard Component
 * Modern card display for financial accounts
 * @module components/AccountCard
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Shadows } from '../constants';
import { formatCurrency } from '../utils';

const accountTypeConfig = {
  checking: {
    icon: 'bank',
    label: 'Checking',
    color: Colors.info,
  },
  savings: {
    icon: 'piggy-bank',
    label: 'Savings',
    color: Colors.success,
  },
  cash: {
    icon: 'cash',
    label: 'Cash',
    color: Colors.warning,
  },
  credit_card: {
    icon: 'credit-card',
    label: 'Credit Card',
    color: Colors.error,
  },
  investment: {
    icon: 'chart-line',
    label: 'Investment',
    color: Colors.primary.main,
  },
  other: {
    icon: 'wallet',
    label: 'Other',
    color: Colors.neutral[600],
  },
};

const AccountCard = ({ account, onPress, onEdit, onDelete }) => {
  const config = accountTypeConfig[account.type] || accountTypeConfig.other;
  const isNegative = account.currentBalance < 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
            <Icon name={config.icon} size={24} color={config.color} />
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName} numberOfLines={1}>
              {account.name}
            </Text>
            <View style={styles.typeRow}>
              <Text style={styles.accountType}>{config.label}</Text>
              {account.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Icon name="pencil-outline" size={18} color={Colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Icon name="delete-outline" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text
          style={[
            styles.balanceAmount,
            isNegative && { color: Colors.error },
          ]}
        >
          {formatCurrency(account.currentBalance)}
        </Text>
      </View>

      {/* Additional Info */}
      {account.description && (
        <Text style={styles.description} numberOfLines={2}>
          {account.description}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  accountType: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
  },
  defaultBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    backgroundColor: Colors.primary.subtle,
    borderRadius: Radius.xs,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary.main,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceSection: {
    marginBottom: Spacing.sm,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  description: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});

export default AccountCard;
