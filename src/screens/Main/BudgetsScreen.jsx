/**
 * BudgetsScreen
 * Modern budget and account management with clean UI
 * @module screens/Main/BudgetsScreen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  BudgetCard,
  AccountCard,
  SkeletonList,
  EmptyState,
  EmptyStatePresets
} from '../../components';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

import { budgetService } from '../../services/BudgetService';
import { transactionService } from '../../services/TransactionService';
import { accountService } from '../../services/AccountService';

function BudgetsScreen({ navigation }) {
  const [user] = useState(auth().currentUser);
  const [activeTab, setActiveTab] = useState('budgets');

  // Data states
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Stats
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const [fetchedBudgets, fetchedAccounts, fetchedTransactions] = await Promise.all([
        budgetService.getBudgets(user.uid),
        accountService.getAccounts(user.uid),
        transactionService.getTransactions(user.uid),
      ]);

      setBudgets(fetchedBudgets);
      setAccounts(fetchedAccounts);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate budget spent
  const calculateSpent = useCallback((budget) => {
    const budgetStartDate = budget.startDate?.toDate ? budget.startDate.toDate() : budget.startDate;
    const budgetEndDate = budget.endDate?.toDate ? budget.endDate.toDate() : budget.endDate;

    return transactions.reduce((sum, tx) => {
      const txDate = tx.date?.toDate ? tx.date.toDate() : tx.date;
      const isExpense = tx.type === 'expense';
      const isWithinDateRange = txDate >= budgetStartDate && txDate <= budgetEndDate;
      const isCategoryMatch = !budget.categoryIds || budget.categoryIds.length === 0 || budget.categoryIds.includes(tx.categoryId);

      if (isExpense && isWithinDateRange && isCategoryMatch) {
        return sum + Math.abs(tx.amount);
      }
      return sum;
    }, 0);
  }, [transactions]);

  // Calculate stats
  useEffect(() => {
    const budgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
    const spent = budgets.reduce((sum, b) => sum + calculateSpent(b), 0);
    const balance = accounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0);

    setTotalBudgeted(budgeted);
    setTotalSpent(spent);
    setTotalBalance(balance);
  }, [budgets, accounts, calculateSpent]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Handlers
  const handleBudgetPress = (budget) => {
    // TODO: Navigate to budget details
    console.log('Budget pressed:', budget.id);
  };

  const handleAccountPress = (account) => {
    navigation.navigate('AccountDetail', { accountId: account.id });
  };

  const handleEditBudget = (budget) => {
    navigation.navigate('BudgetForm', {
      budgetId: budget.id,
      budget: budget,
    });
  };

  const handleDeleteBudget = (budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete "${budget.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await budgetService.deleteBudget(user.uid, budget.id);
              Alert.alert('Success', 'Budget deleted!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete budget.');
            }
          },
        },
      ]
    );
  };

  const handleEditAccount = (account) => {
    navigation.navigate('AccountForm', {
      accountId: account.id,
      account: account,
    });
  };

  const handleDeleteAccount = (account) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? All related transactions may be affected.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await accountService.deleteAccount(user.uid, account.id);
              Alert.alert('Success', 'Account deleted!');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account.');
            }
          },
        },
      ]
    );
  };

  const handleAddNew = () => {
    if (activeTab === 'budgets') {
      navigation.navigate('BudgetForm');
    } else {
      navigation.navigate('AccountForm');
    }
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>
          {activeTab === 'budgets' ? 'Budgets' : 'Accounts'}
        </Text>
        {activeTab === 'budgets' && budgets.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{budgets.length}</Text>
          </View>
        )}
        {activeTab === 'accounts' && accounts.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{accounts.length}</Text>
          </View>
        )}
      </View>
      <Text style={styles.headerSubtitle}>
        {activeTab === 'budgets'
          ? 'Track your spending limits'
          : 'Manage your financial accounts'}
      </Text>
    </View>
  );

  // Render stats
  const renderStats = () => {
    if (activeTab === 'budgets' && budgets.length > 0) {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Budgeted</Text>
            <Text style={styles.statValue}>{totalBudgeted.toLocaleString()}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={[styles.statValue, { color: Colors.error }]}>
              {totalSpent.toLocaleString()}
            </Text>
          </View>
        </View>
      );
    }

    if (activeTab === 'accounts' && accounts.length > 0) {
      return (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Balance</Text>
            <Text style={[styles.statValue, { color: totalBalance >= 0 ? Colors.success : Colors.error }]}>
              {totalBalance.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Accounts</Text>
            <Text style={styles.statValue}>{accounts.length}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  // Render tabs
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'budgets' && styles.activeTab]}
        onPress={() => setActiveTab('budgets')}
      >
        <Icon
          name="chart-pie"
          size={20}
          color={activeTab === 'budgets' ? Colors.primary.main : Colors.text.secondary}
        />
        <Text style={[styles.tabText, activeTab === 'budgets' && styles.activeTabText]}>
          Budgets
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'accounts' && styles.activeTab]}
        onPress={() => setActiveTab('accounts')}
      >
        <Icon
          name="bank"
          size={20}
          color={activeTab === 'accounts' ? Colors.primary.main : Colors.text.secondary}
        />
        <Text style={[styles.tabText, activeTab === 'accounts' && styles.activeTabText]}>
          Accounts
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render content
  const renderContent = () => {
    if (loading && !refreshing) {
      return <SkeletonList count={4} variant="budget" />;
    }

    if (activeTab === 'budgets') {
      if (budgets.length === 0) {
        return (
          <EmptyState
            {...EmptyStatePresets.budgets}
            onAction={handleAddNew}
            style={{ paddingVertical: 60 }}
          />
        );
      }

      return (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <BudgetCard
              budget={item}
              spent={calculateSpent(item)}
              onPress={() => handleBudgetPress(item)}
              onEdit={() => handleEditBudget(item)}
              onDelete={() => handleDeleteBudget(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      );
    }

    // Accounts tab
    if (accounts.length === 0) {
      return (
        <EmptyState
          {...EmptyStatePresets.accounts}
          onAction={handleAddNew}
          style={{ paddingVertical: 60 }}
        />
      );
    }

    return (
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onPress={() => handleAccountPress(item)}
            onEdit={() => handleEditAccount(item)}
            onDelete={() => handleDeleteAccount(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary.main]}
            tintColor={Colors.primary.main}
          />
        }
      >
        {renderHeader()}
        {renderTabs()}
        {renderStats()}

        <View style={styles.contentSection}>
          {renderContent()}
        </View>

        {/* Bottom padding for floating tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + Spacing.md : Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.text.primary,
  },
  countBadge: {
    backgroundColor: Colors.primary.subtle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    minWidth: 32,
    alignItems: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary.main,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background.primary,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
  },
  activeTab: {
    backgroundColor: Colors.primary.subtle,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary.main,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
  contentSection: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.lg,
    marginTop: Spacing.md,
    minHeight: 400,
  },
  listContent: {
    paddingBottom: Spacing.md,
  },
  bottomSpacer: {
    height: 120, // Space for floating tab bar
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 120 : 100,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    elevation: 8,
  },
});

export default BudgetsScreen;
