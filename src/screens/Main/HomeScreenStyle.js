/**
 * Home Screen Styles
 * Minimalist flat design with Modern Teal accent
 * @module screens/Main/HomeScreenStyle
 */
import { StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  heroHeader: {
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  loadingIndicator: {
    marginTop: Spacing.xl + Spacing.lg,
  },

  // Transactions section styles
  transactionsSection: {
    marginTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  listTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  viewAllButton: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primary.main,
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
