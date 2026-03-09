/**
 * AccountCard Component
 * Modern card display for financial accounts with colored header
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
    color: '#3B82F6',
  },
  savings: {
    icon: 'piggy-bank',
    label: 'Savings',
    color: '#10B981',
  },
  cash: {
    icon: 'cash',
    label: 'Cash',
    color: '#F59E0B',
  },
  credit: {
    icon: 'credit-card',
    label: 'Credit Card',
    color: '#EF4444',
  },
  investment: {
    icon: 'trending-up',
    label: 'Investment',
    color: '#8B5CF6',
  },
  loan: {
    icon: 'hand-coin',
    label: 'Loan',
    color: '#EC4899',
  },
  other: {
    icon: 'wallet',
    label: 'Other',
    color: '#6B7280',
  },
};

const accountStatusConfig = {
  active: {
    label: 'Active',
    color: '#10B981',
    icon: 'check-circle',
  },
  inactive: {
    label: 'Inactive',
    color: '#94A3B8',
    icon: 'minus-circle',
  },
  suspended: {
    label: 'Suspended',
    color: '#EF4444',
    icon: 'alert-circle',
  },
  pending: {
    label: 'Pending',
    color: '#F59E0B',
    icon: 'clock',
  },
};

const AccountCard = ({ account, onPress, onEdit, onDelete }) => {
  const config = accountTypeConfig[account.type] || accountTypeConfig.other;
  const accountColor = account.color || config.color;
  const isNegative = account.currentBalance < 0;
  const status = account.status || 'active';
  const statusConfig = accountStatusConfig[status] || accountStatusConfig.active;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Colored Header */}
      <View style={[styles.header, { backgroundColor: accountColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Icon
                name={account.icon || config.icon}
                size={28}
                color={Colors.text.inverse}
              />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName} numberOfLines={1}>
                {account.name}
              </Text>
              <View style={styles.typeRow}>
                <Text style={styles.accountType}>{config.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Icon name="pencil-outline" size={18} color={Colors.text.inverse} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Icon name="delete-outline" size={18} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Tag - Top Right Corner */}
        <View style={[styles.statusTag, { backgroundColor: statusConfig.color }]}>
          <Icon name={statusConfig.icon} size={12} color={Colors.text.inverse} />
          <Text style={styles.statusText}>{statusConfig.label}</Text>
        </View>
      </View>

      {/* Balance Section */}
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

        {account.initialBalance !== undefined && (
          <View style={styles.initialBalanceRow}>
            <Text style={styles.initialBalanceLabel}>Initial: </Text>
            <Text style={styles.initialBalanceValue}>
              {formatCurrency(account.initialBalance)}
            </Text>
          </View>
        )}
      </View>

      {/* Additional Info */}
      {account.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notes} numberOfLines={2}>
            {account.notes}
          </Text>
        </View>
      )}

      {/* Default Badge - Bottom Right */}
      {account.isDefault && (
        <View style={styles.defaultBadge}>
          <Icon name="star" size={14} color="#FFD700" />
          <Text style={styles.defaultText}>Default</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.md,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 4,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  accountType: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderBottomLeftRadius: Radius.md,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actions: {
    paddingTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceSection: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  initialBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialBalanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.tertiary,
  },
  initialBalanceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  notesSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  notes: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  defaultBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    backgroundColor: Colors.background.secondary,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text.primary,
  },
});

export default AccountCard;
