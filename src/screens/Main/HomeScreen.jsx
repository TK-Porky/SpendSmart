/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList
} from 'react-native';
import auth from '@react-native-firebase/auth';

import { HomeScreenStyles } from './HomeScreenStyle';
import UserHeader from '../../components/UserHeader';
import BalanceCard from '../../components/BalanceCard';
import TransactionCard from '../../components/TransactionCard';
import { SkeletonCard, SkeletonList, EmptyState, EmptyStatePresets } from '../../components';
import { Colors } from '../../constants';

import { balanceService } from '../../services/BalanceService';
import { transactionService } from '../../services/TransactionService';
import { categoryService } from '../../services/CategoryService';
import BalanceSummary from '../../models/BalanceSummary';

function HomeScreen({ navigation }) {
  const [user, setUser] = useState(auth().currentUser);
  const [userProfile, setUserProfile] = useState(null);
  const [balanceSummary, setBalanceSummary] = useState(new BalanceSummary(user.uid));
  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'Utilisateur';
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balanceData, setBalanceData] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    currency: 'XOF',
  });


  useEffect(() => {
    if (!user) return;
    
    const userUid = user.uid;

    setUserProfile({ photoURL: user.photoURL });

    const unsubscribeBalance = balanceService.listenToBalanceSummary(userUid, (summary) => {
      setBalanceSummary(summary || new BalanceSummary(userUid));
      setLoading(false);
    });

    const unsubscribeTransactions = transactionService.listenToTransactions(userUid, (txs) => {
      setRecentTransactions(txs);
      setLoading(false);
      setLoadingTransactions(false);
    });

    return () => {
      unsubscribeBalance();
      unsubscribeTransactions();
    };
  }, [user]);

  const handleNavigateToProfile = () => {
    navigation.navigate('Profile')
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressées');
  };

  const handleSettingsPress = () => {
    console.log('Paramètres pressés');
    navigation.navigate('Paramètres');
  };

  const handleViewAllTransactions = () => {
    console.log("Naviguer vers l'écran de toutes les transactions");
    navigation.navigate('Transactions'); // Nom de votre Tab.Screen pour les transactions
  };

  const handleSelectTransaction = (transaction) => {
    console.log("Transaction sélectionnée:", transaction);
    navigation.navigate('Transactions', {
      screen: 'TransactionDetail',
      params: { transactionId: transaction.id },
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setLoadingTransactions(true);
    // The listeners will handle the data refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAddTransaction = () => {
    navigation.navigate('Transactions', {
      screen: 'TransactionForm',
    });
  };

  const userCurrency = balanceSummary ? balanceSummary.currency || 'XOF' : 'XOF';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={HomeScreenStyles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary.main]}
          tintColor={Colors.primary.main}
        />
      }
    >
      <View style={HomeScreenStyles.heroHeader}>
        <UserHeader
          userProfile={userProfile}
          userDisplayName={userDisplayName}
          onNavigateToProfile={handleNavigateToProfile}
          onNotificationPress={handleNotificationPress}
          onSettingsPress={handleSettingsPress}
        />

        {loading ? (
          <SkeletonCard variant="balance" style={{ marginHorizontal: 0 }} />
        ) : (
          <BalanceCard
            balance={balanceSummary.currentBalance}
            income={balanceSummary.totalIncome}
            expenses={balanceSummary.totalExpenses}
            currency={userCurrency}
          />
        )}

        {/* Section des transactions récentes */}
        <View style={HomeScreenStyles.transactionsSection}>
          <View style={HomeScreenStyles.listHeader}>
            <Text style={HomeScreenStyles.listTitle}>Transactions Récentes</Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={HomeScreenStyles.viewAllButton}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          {loadingTransactions ? (
            <SkeletonList count={5} variant="transaction" />
          ) : recentTransactions.length > 0 ? (
            <FlatList
              data={recentTransactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TransactionCard
                  transaction={item}
                  onPress={handleSelectTransaction}
                />
              )}
              scrollEnabled={false}
            />
          ) : (
            <EmptyState
              {...EmptyStatePresets.transactions}
              onAction={handleAddTransaction}
              style={{ paddingVertical: 40 }}
            />
          )}
        </View>

      </View>
    </ScrollView>
  );
}

export default HomeScreen;
