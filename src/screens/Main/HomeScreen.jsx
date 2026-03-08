/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import { HomeScreenStyles } from './HomeScreenStyle';
import UserHeader from '../../components/UserHeader';
import CreditCard from '../../components/CreditCard';
import QuickActions from '../../components/QuickActions';
import TransactionCard from '../../components/TransactionCard';
import { SkeletonCard, SkeletonList, EmptyState, EmptyStatePresets } from '../../components';
import { Colors } from '../../constants';

import { balanceService } from '../../services/BalanceService';
import { transactionService } from '../../services/TransactionService';
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

  useEffect(() => {
    if (!user) return;

    const userUid = user.uid;

    setUserProfile({ photoURL: user.photoURL });

    const unsubscribeBalance = balanceService.listenToBalanceSummary(userUid, (summary) => {
      setBalanceSummary(summary || new BalanceSummary(userUid));
      setLoading(false);
    });

    const unsubscribeTransactions = transactionService.listenToTransactions(userUid, (txs) => {
      // Limit to 5 most recent transactions for home screen
      setRecentTransactions(txs.slice(0, 5));
      setLoading(false);
      setLoadingTransactions(false);
    });

    return () => {
      unsubscribeBalance();
      unsubscribeTransactions();
    };
  }, [user]);

  const handleNavigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleSettingsPress = () => {
    console.log('Paramètres pressés');
    navigation.navigate('Profile', { screen: 'Settings' });
  };

  const handleViewAllTransactions = () => {
    navigation.navigate('Transactions');
  };

  const handleSelectTransaction = (transaction) => {
    navigation.navigate('TransactionDetail', { transactionId: transaction.id });
  };

  const handleCardPress = () => {
    navigation.navigate('AccountDetail');
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

  // Quick Actions
  const handleSend = () => {
    Alert.alert('Send Money', 'Send money feature coming soon!');
  };

  const handleReceive = () => {
    Alert.alert('Receive Money', 'Receive money feature coming soon!');
  };

  const handlePay = () => {
    Alert.alert('Pay Bills', 'Pay bills feature coming soon!');
  };

  const handleMore = () => {
    navigation.navigate('Profile', { screen: 'Settings' });
  };

  const userCurrency = balanceSummary ? balanceSummary.currency || 'XOF' : 'XOF';

  return (
    <View style={HomeScreenStyles.container}>
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
        {/* User Header */}
        <View style={HomeScreenStyles.headerSection}>
          <UserHeader
            userProfile={userProfile}
            userDisplayName={userDisplayName}
            onNavigateToProfile={handleNavigateToProfile}
            onNotificationPress={handleNotificationPress}
          />
        </View>

        {/* Credit Card */}
        {loading ? (
          <SkeletonCard variant="balance" style={{ marginHorizontal: 16 }} />
        ) : (
          <CreditCard
            balance={balanceSummary.currentBalance}
            cardNumber="1234 5678 9012 4862"
            cardHolder={userDisplayName}
            expiryDate="12/26"
            currency={userCurrency}
            cardType="visa"
            onPress={handleCardPress}
          />
        )}

        {/* Quick Actions */}
        <QuickActions
          onSend={handleSend}
          onReceive={handleReceive}
          onPay={handlePay}
          onMore={handleMore}
        />

        {/* Recent Transactions */}
        <View style={HomeScreenStyles.transactionsSection}>
          <View style={HomeScreenStyles.sectionHeader}>
            <Text style={HomeScreenStyles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={HomeScreenStyles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          {loadingTransactions ? (
            <SkeletonList count={3} variant="transaction" />
          ) : recentTransactions.length > 0 ? (
            <View style={HomeScreenStyles.transactionsList}>
              {recentTransactions.map((item) => (
                <TransactionCard
                  key={item.id}
                  transaction={item}
                  onPress={handleSelectTransaction}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              {...EmptyStatePresets.transactions}
              onAction={handleAddTransaction}
              style={{ paddingVertical: 40 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
