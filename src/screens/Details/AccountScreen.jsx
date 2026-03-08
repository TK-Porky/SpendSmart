/**
 * Account Detail Screen
 * View account details and transaction history
 * @module screens/Details/AccountScreen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../constants';
import { formatCurrency, formatDate } from '../../utils';
import { accountService } from '../../services/AccountService';
import { transactionService } from '../../services/TransactionService';
import { categoryService } from '../../services/CategoryService';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/EmptyState';
import { useToast } from '../../context/ToastContext';

// Account type configuration
const ACCOUNT_TYPES = {
  checking: { label: 'Compte courant', icon: 'bank' },
  savings: { label: 'Epargne', icon: 'piggy-bank' },
  cash: { label: 'Especes', icon: 'cash' },
  credit_card: { label: 'Carte de credit', icon: 'credit-card' },
  investment: { label: 'Investissement', icon: 'chart-line' },
  other: { label: 'Autre', icon: 'wallet' },
};

const AccountScreen = ({ route, navigation }) => {
  const { accountId } = route.params || {};
  const { showToast } = useToast();

  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const user = auth().currentUser;

  // Load account data
  const loadData = useCallback(async () => {
    if (!user || !accountId) return;

    try {
      const [accountData, allTransactions, allCategories] = await Promise.all([
        accountService.getAccount(user.uid, accountId),
        transactionService.getTransactions(user.uid),
        categoryService.getAllCategories(user.uid),
      ]);

      setAccount(accountData);
      setCategories(allCategories);

      // Filter transactions for this account
      const accountTransactions = allTransactions.filter(
        t => t.accountId === accountId || t.transferToAccountId === accountId
      );
      setTransactions(accountTransactions);
    } catch (error) {
      console.error('Error loading account data:', error);
      showToast('Erreur de chargement', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, accountId, showToast]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Handle delete
  const handleDelete = () => {
    if (account?.isDefault) {
      Alert.alert(
        'Action impossible',
        'Vous ne pouvez pas supprimer le compte par defaut. Definissez un autre compte par defaut avant de supprimer celui-ci.'
      );
      return;
    }

    if (transactions.length > 0) {
      Alert.alert(
        'Attention',
        `Ce compte contient ${transactions.length} transaction(s). La suppression du compte n'affectera pas ces transactions mais elles ne seront plus associees a un compte.`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer quand meme',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    } else {
      Alert.alert(
        'Supprimer le compte',
        'Etes-vous sur de vouloir supprimer ce compte ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
  };

  const performDelete = async () => {
    try {
      setDeleting(true);
      await accountService.deleteAccount(user.uid, accountId);
      showToast('Compte supprime', 'success');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting account:', error);
      showToast('Erreur lors de la suppression', 'error');
      setDeleting(false);
    }
  };

  // Get category for transaction
  const getCategoryForTransaction = (transaction) => {
    if (!transaction.category) return null;
    return categories.find(c => c.id === transaction.category);
  };

  // Render transaction item
  const renderTransactionItem = ({ item }) => {
    const category = getCategoryForTransaction(item);
    const isIncoming = item.type === 'income' ||
      (item.type === 'transfer' && item.transferToAccountId === accountId);
    const isOutgoing = item.type === 'expense' ||
      (item.type === 'transfer' && item.accountId === accountId);

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
        accessibilityRole="button"
        accessibilityLabel={`${item.description}, ${formatCurrency(Math.abs(item.amount), 'XOF')}`}
      >
        <View style={[
          styles.categoryIcon,
          { backgroundColor: category ? `${category.color}20` : Colors.neutral[100] }
        ]}>
          <Icon
            name={category?.icon || 'cash'}
            size={20}
            color={category?.color || Colors.neutral[500]}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDate(item.date, 'short')}
          </Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: isIncoming ? Colors.success : isOutgoing ? Colors.error : Colors.text.primary }
        ]}>
          {isIncoming ? '+' : isOutgoing ? '-' : ''}
          {formatCurrency(Math.abs(item.amount), 'XOF')}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  if (!account) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color={Colors.neutral[400]} />
        <Text style={styles.errorText}>Compte non trouve</Text>
        <Button
          title="Retour"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const accountType = ACCOUNT_TYPES[account.type] || ACCOUNT_TYPES.other;
  const balanceChange = account.currentBalance - account.initialBalance;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Icon name="arrow-left" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details du compte</Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          disabled={deleting}
          accessibilityRole="button"
          accessibilityLabel="Supprimer le compte"
        >
          {deleting ? (
            <ActivityIndicator size="small" color={Colors.error} />
          ) : (
            <Icon name="trash-can-outline" size={24} color={Colors.error} />
          )}
        </TouchableOpacity>
      </View>

      {/* Account Card */}
      <View style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={styles.accountIconContainer}>
            <Icon name={accountType.icon} size={28} color={Colors.primary.main} />
          </View>
          <View style={styles.accountTitleContainer}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountType}>{accountType.label}</Text>
          </View>
          {account.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Par defaut</Text>
            </View>
          )}
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Solde actuel</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(account.currentBalance, 'XOF')}
          </Text>
        </View>

        <View style={styles.balanceStats}>
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Solde initial</Text>
            <Text style={styles.balanceStatValue}>
              {formatCurrency(account.initialBalance, 'XOF')}
            </Text>
          </View>
          <View style={styles.balanceStatDivider} />
          <View style={styles.balanceStat}>
            <Text style={styles.balanceStatLabel}>Variation</Text>
            <Text style={[
              styles.balanceStatValue,
              { color: balanceChange >= 0 ? Colors.success : Colors.error }
            ]}>
              {balanceChange >= 0 ? '+' : ''}{formatCurrency(balanceChange, 'XOF')}
            </Text>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>
          Transactions ({transactions.length})
        </Text>

        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.transactionsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary.main]}
              tintColor={Colors.primary.main}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="swap-horizontal"
              title="Aucune transaction"
              message="Ce compte n'a pas encore de transactions"
            />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  errorText: {
    ...Typography.h3,
    color: Colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  deleteButton: {
    padding: Spacing.sm,
    marginRight: -Spacing.sm,
  },
  accountCard: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  accountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.subtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  accountTitleContainer: {
    flex: 1,
  },
  accountName: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  accountType: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  defaultBadge: {
    backgroundColor: Colors.primary.subtle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  defaultBadgeText: {
    ...Typography.small,
    color: Colors.primary.main,
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  balanceLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  balanceStats: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
  },
  balanceStat: {
    flex: 1,
    alignItems: 'center',
  },
  balanceStatLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  balanceStatValue: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  balanceStatDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
  transactionsSection: {
    flex: 1,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  transactionsList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  transactionDate: {
    ...Typography.small,
    color: Colors.text.secondary,
  },
  transactionAmount: {
    ...Typography.bodyBold,
  },
});

export default AccountScreen;
