/**
 * BudgetCard Component
 * Modern card display for budgets with progress visualization
 * @module components/BudgetCard
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Shadows } from '../constants';
import { formatCurrency } from '../utils';

const BudgetCard = ({ budget, spent, onPress, onEdit, onDelete }) => {
  const progress = (spent / budget.amount) * 100;
  const remaining = budget.amount - spent;
  const isOverBudget = spent > budget.amount;

  // Calculate remaining days
  const endDate = budget.endDate?.toDate ? budget.endDate.toDate() : budget.endDate;
  const remainingDays = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = remainingDays < 0;

  // Get progress bar color
  const getProgressColor = () => {
    if (isOverBudget) return Colors.error;
    if (progress > 80) return Colors.warning;
    return Colors.success;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${getProgressColor()}20` }]}>
            <Icon name="chart-pie" size={20} color={getProgressColor()} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.budgetName} numberOfLines={1}>{budget.name}</Text>
            <Text style={styles.budgetPeriod}>
              {!isExpired ? `${remainingDays} days left` : 'Expired'}
            </Text>
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

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, progress)}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
      </View>

      {/* Amounts */}
      <View style={styles.amounts}>
        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Spent</Text>
          <Text style={[styles.amountValue, isOverBudget && { color: Colors.error }]}>
            {formatCurrency(spent)}
          </Text>
        </View>

        <View style={styles.amountDivider} />

        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Budget</Text>
          <Text style={styles.amountValue}>{formatCurrency(budget.amount)}</Text>
        </View>

        <View style={styles.amountDivider} />

        <View style={styles.amountItem}>
          <Text style={styles.amountLabel}>Remaining</Text>
          <Text style={[styles.amountValue, { color: isOverBudget ? Colors.error : Colors.success }]}>
            {formatCurrency(Math.abs(remaining))}
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      {isOverBudget && (
        <View style={styles.statusBadge}>
          <Icon name="alert-circle" size={14} color={Colors.error} />
          <Text style={styles.statusText}>Over budget by {formatCurrency(Math.abs(remaining))}</Text>
        </View>
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
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  budgetPeriod: {
    fontSize: 12,
    color: Colors.text.secondary,
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
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: Radius.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.xs,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.secondary,
    minWidth: 40,
    textAlign: 'right',
  },
  amounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  amountDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: `${Colors.error}10`,
    borderRadius: Radius.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
  },
});

export default BudgetCard;
