/**
 * ProfileScreen
 * Modern user profile with settings and account info
 * @module screens/Main/ProfileScreen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { LoadingSpinner } from '../../components';
import { Colors, Spacing, Radius, Shadows } from '../../constants';

// Import services for stats
import { transactionService } from '../../services/TransactionService';
import { budgetService } from '../../services/BudgetService';
import { accountService } from '../../services/AccountService';

function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    transactions: 0,
    budgets: 0,
    accounts: 0,
  });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchStats(currentUser.uid);
      }
    });

    return subscriber;
  }, []);

  const fetchStats = useCallback(async (uid) => {
    try {
      const [transactions, budgets, accounts] = await Promise.all([
        transactionService.getTransactions(uid),
        budgetService.getBudgets(uid),
        accountService.getAccounts(uid),
      ]);

      setStats({
        transactions: transactions.length,
        budgets: budgets.length,
        accounts: accounts.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const onRefresh = useCallback(() => {
    if (user?.uid) {
      setRefreshing(true);
      fetchStats(user.uid).finally(() => setRefreshing(false));
    }
  }, [user?.uid, fetchStats]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await auth().signOut();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleEditAvatar = () => {
    // TODO: Implement avatar picker
    console.log('Edit avatar');
    Alert.alert('Coming Soon', 'Avatar editing will be available soon.');
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." fullScreen />;
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="account-off-outline" size={64} color={Colors.text.secondary} />
        <Text style={styles.emptyText}>No user logged in</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const profileImage = user.photoURL
    ? { uri: user.photoURL }
    : require('../../../assets/AppIcon.png');

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
        {/* Header with Gradient and Profile */}
        <LinearGradient
          colors={['#0D9488', '#14B8A6', '#2DD4BF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={profileImage} style={styles.avatar} />
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={handleEditAvatar}
                activeOpacity={0.8}
              >
                <Icon name="camera" size={14} color={Colors.text.inverse} />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.displayName || 'User'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>

              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Icon name="pencil" size={14} color={Colors.primary.main} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Icon name="swap-horizontal" size={24} color={Colors.primary.main} />
            <Text style={styles.statValue}>{stats.transactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Icon name="chart-pie" size={24} color={Colors.success} />
            <Text style={styles.statValue}>{stats.budgets}</Text>
            <Text style={styles.statLabel}>Budgets</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Icon name="bank" size={24} color={Colors.info} />
            <Text style={styles.statValue}>{stats.accounts}</Text>
            <Text style={styles.statLabel}>Accounts</Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.menuCard}>
            <MenuItem
              icon="cog-outline"
              label="General Settings"
              color={Colors.primary.main}
              onPress={() => navigateTo('GeneralSettings')}
            />
            <MenuItem
              icon="bell-outline"
              label="Notifications"
              color={Colors.warning}
              onPress={() => navigateTo('Notifications')}
            />
            <MenuItem
              icon="shield-lock-outline"
              label="Security & Privacy"
              color={Colors.error}
              onPress={() => navigateTo('SecurityPrivacy')}
              showDivider={false}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.menuCard}>
            <MenuItem
              icon="currency-usd"
              label="Currency & Language"
              color={Colors.success}
              onPress={() => navigateTo('CurrencyLanguage')}
            />
            <MenuItem
              icon="palette-outline"
              label="Appearance"
              color={Colors.info}
              onPress={() => navigateTo('Appearance')}
            />
            <MenuItem
              icon="database-outline"
              label="Data & Storage"
              color={Colors.neutral[600]}
              onPress={() => Alert.alert('Coming Soon', 'Data & Storage settings will be available soon.')}
              showDivider={false}
            />
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>

          <View style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              label="FAQ"
              color={Colors.info}
              onPress={() => Alert.alert('FAQ', 'This feature will be available soon.')}
            />
            <MenuItem
              icon="lifebuoy"
              label="Contact Support"
              color={Colors.primary.main}
              onPress={() =>
                Alert.alert('Support', 'Contact us at support@spendsmart.app')
              }
            />
            <MenuItem
              icon="information-outline"
              label="About SpendSmart"
              color={Colors.neutral[600]}
              onPress={() => Alert.alert('SpendSmart', 'Version 1.0.0\n\nA modern expense tracking app.')}
              showDivider={false}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Bottom Spacer for Floating Tab Bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

// Menu Item Component
const MenuItem = ({ icon, label, color, onPress, showDivider = true }) => (
  <>
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconContainer, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Icon name="chevron-right" size={20} color={Colors.text.tertiary} />
    </TouchableOpacity>
    {showDivider && <View style={styles.menuDivider} />}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  loginButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.sm,
    ...Shadows.sm,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + Spacing.md : Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.inverse,
    flex: 1,
    textAlign: 'left',
  },
  headerSpacer: {
    width: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.sm,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.xs,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.main,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: Spacing.xs,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  menuCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background.card,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error,
  },
  bottomSpacer: {
    height: 120, // Space for floating tab bar
  },
});

export default ProfileScreen;
