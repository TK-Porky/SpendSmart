/**
 * TransactionsScreen
 * Modern transaction list with search, filter, and month selection
 * @module screens/Main/TransactionsScreen
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Platform
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TransactionCard,
  SkeletonList,
  EmptyState,
  EmptyStatePresets,
  MonthSelector,
  FilterBar,
  SearchBar
} from '../../components';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

import { transactionService } from '../../services/TransactionService';

function TransactionsScreen({ navigation, route }) {
  const [user] = useState(auth().currentUser);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Stats
  const [monthStats, setMonthStats] = useState({
    income: 0,
    expense: 0,
    total: 0,
    count: 0
  });

  // Load transactions
  const fetchTransactions = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const allTransactions = await transactionService.getTransactions(user.uid);
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by month/year
    filtered = filtered.filter(tx => {
      const txDate = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
      return (
        txDate.getMonth() === selectedMonth &&
        txDate.getFullYear() === selectedYear
      );
    });

    // Filter by type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tx =>
        tx.description?.toLowerCase().includes(query) ||
        tx.detail?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [transactions, selectedMonth, selectedYear, activeFilter, searchQuery]);

  // Calculate month stats
  useEffect(() => {
    const stats = filteredTransactions.reduce((acc, tx) => {
      const amount = Math.abs(tx.amount);

      if (tx.type === 'income') {
        acc.income += amount;
      } else if (tx.type === 'expense') {
        acc.expense += amount;
      }

      acc.count++;
      return acc;
    }, { income: 0, expense: 0, count: 0 });

    stats.total = stats.income - stats.expense;

    setMonthStats(stats);
  }, [filteredTransactions]);

  const handleSelectTransaction = (transaction) => {
    navigation.navigate('TransactionDetail', { transactionId: transaction.id });
  };

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction');
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const renderMonthStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: `${Colors.success}15` }]}>
          <Icon name="arrow-down" size={20} color={Colors.success} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            +{monthStats.income.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statCard}>
        <View style={[styles.statIcon, { backgroundColor: `${Colors.error}15` }]}>
          <Icon name="arrow-up" size={20} color={Colors.error} />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={[styles.statValue, { color: Colors.error }]}>
            -{monthStats.expense.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={styles.transactionCount}>
          <Text style={styles.transactionCountText}>{filteredTransactions.length}</Text>
        </View>
      </View>
      <Text style={styles.headerSubtitle}>
        Track and manage your transactions
      </Text>
    </View>
  );

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

        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={handleMonthChange}
        />

        {renderMonthStats()}

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search transactions..."
        />

        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'All Transactions'}
            </Text>
            {filteredTransactions.length > 0 && (
              <Text style={styles.sectionSubtitle}>
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {loading ? (
            <SkeletonList count={8} variant="transaction" />
          ) : filteredTransactions.length > 0 ? (
            <FlatList
              data={filteredTransactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TransactionCard
                  transaction={item}
                  onPress={handleSelectTransaction}
                />
              )}
              scrollEnabled={false}
              contentContainerStyle={styles.transactionsList}
            />
          ) : (
            <EmptyState
              {...EmptyStatePresets.transactions}
              onAction={handleAddTransaction}
              style={{ paddingVertical: 60 }}
            />
          )}
        </View>

        {/* Bottom padding for floating tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTransaction}
        activeOpacity={0.9}
      >
        <Icon name="plus" size={28} color={Colors.text.inverse} />
      </TouchableOpacity>
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
  transactionCount: {
    backgroundColor: Colors.primary.subtle,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    minWidth: 32,
    alignItems: 'center',
  },
  transactionCountText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary.main,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
  transactionsSection: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.lg,
    marginTop: Spacing.md,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  transactionsList: {
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

export default TransactionsScreen;
