/**
 * Home Screen Styles
 * Modern design with credit card and spending overview
 * @module screens/Main/HomeScreenStyle
 */
import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },

  // Header Section
  headerSection: {
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },

  // Spending Overview Section
  spendingSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  spendingCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  spendingItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spendingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  spendingInfo: {
    flex: 1,
  },
  spendingLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  spendingValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  spendingDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },

  // Transactions Section
  transactionsSection: {
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.lg,
    paddingBottom: 120, // Extra padding for floating tab bar
    minHeight: 300,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  transactionsList: {
    paddingHorizontal: Spacing.md,
  },

  // Loading & Empty States
  loadingIndicator: {
    marginTop: Spacing.xl,
  },
  noTransactionsCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    alignItems: 'center',
    ...Shadows.sm,
  },
  noTransactionsText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.text.secondary,
  },
});
