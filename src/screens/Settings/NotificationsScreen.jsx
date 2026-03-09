/**
 * NotificationsScreen
 * Notification preferences and settings
 * @module screens/Settings/NotificationsScreen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, Radius, Shadows } from '../../constants';

function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState({
    // General
    pushEnabled: true,
    emailEnabled: true,
    // Transactions
    transactionAdded: true,
    largeTransaction: true,
    // Budgets
    budgetAlert: true,
    budgetExceeded: true,
    budgetReminder: false,
    // Accounts
    lowBalance: true,
    accountUpdates: false,
    // Security
    securityAlerts: true,
    loginAlerts: true,
  });

  const handleToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // TODO: Save to AsyncStorage or user preferences
    Alert.alert('Success', 'Notification settings saved!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const ToggleSwitch = ({ value, onValueChange }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleActive]}
      onPress={onValueChange}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );

  const NotificationItem = ({ icon, label, description, value, onToggle, iconColor, showDivider = true }) => (
    <>
      <View style={styles.notificationItem}>
        <View style={[styles.notificationIcon, { backgroundColor: `${iconColor}15` }]}>
          <Icon name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationLabel}>{label}</Text>
          {description && <Text style={styles.notificationDescription}>{description}</Text>}
        </View>
        <ToggleSwitch value={value} onValueChange={onToggle} />
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#F59E0B', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>Manage your alerts</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* General */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            <NotificationItem
              icon="bell"
              label="Push Notifications"
              description="Receive notifications on your device"
              value={notifications.pushEnabled}
              onToggle={() => handleToggle('pushEnabled')}
              iconColor="#F59E0B"
            />
            <NotificationItem
              icon="email"
              label="Email Notifications"
              description="Receive updates via email"
              value={notifications.emailEnabled}
              onToggle={() => handleToggle('emailEnabled')}
              iconColor="#3B82F6"
              showDivider={false}
            />
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <View style={styles.card}>
            <NotificationItem
              icon="swap-horizontal"
              label="Transaction Added"
              description="Notify when a transaction is recorded"
              value={notifications.transactionAdded}
              onToggle={() => handleToggle('transactionAdded')}
              iconColor="#10B981"
            />
            <NotificationItem
              icon="alert-circle"
              label="Large Transactions"
              description="Alert for transactions over 100,000 XOF"
              value={notifications.largeTransaction}
              onToggle={() => handleToggle('largeTransaction')}
              iconColor="#EF4444"
              showDivider={false}
            />
          </View>
        </View>

        {/* Budgets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budgets</Text>
          <View style={styles.card}>
            <NotificationItem
              icon="chart-pie"
              label="Budget Alerts"
              description="Notify when approaching budget limit (80%)"
              value={notifications.budgetAlert}
              onToggle={() => handleToggle('budgetAlert')}
              iconColor="#F59E0B"
            />
            <NotificationItem
              icon="alert"
              label="Budget Exceeded"
              description="Alert when budget is exceeded"
              value={notifications.budgetExceeded}
              onToggle={() => handleToggle('budgetExceeded')}
              iconColor="#EF4444"
            />
            <NotificationItem
              icon="calendar-clock"
              label="Budget Reminders"
              description="Weekly budget summary notifications"
              value={notifications.budgetReminder}
              onToggle={() => handleToggle('budgetReminder')}
              iconColor="#8B5CF6"
              showDivider={false}
            />
          </View>
        </View>

        {/* Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <View style={styles.card}>
            <NotificationItem
              icon="cash-minus"
              label="Low Balance Warning"
              description="Alert when account balance is low"
              value={notifications.lowBalance}
              onToggle={() => handleToggle('lowBalance')}
              iconColor="#EF4444"
            />
            <NotificationItem
              icon="bank"
              label="Account Updates"
              description="Notify when accounts are modified"
              value={notifications.accountUpdates}
              onToggle={() => handleToggle('accountUpdates')}
              iconColor="#06B6D4"
              showDivider={false}
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <NotificationItem
              icon="shield-alert"
              label="Security Alerts"
              description="Important security notifications"
              value={notifications.securityAlerts}
              onToggle={() => handleToggle('securityAlerts')}
              iconColor="#EF4444"
            />
            <NotificationItem
              icon="login"
              label="Login Alerts"
              description="Notify on new device logins"
              value={notifications.loginAlerts}
              onToggle={() => handleToggle('loginAlerts')}
              iconColor="#F59E0B"
              showDivider={false}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#F59E0B', '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Icon name="check" size={20} color={Colors.text.inverse} />
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </LinearGradient>
        </TouchableOpacity>

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
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + Spacing.md : Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 68,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.border.light,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary.main,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.background.card,
    ...Shadows.sm,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    height: 52,
    ...Shadows.md,
    elevation: 6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: '100%',
    paddingHorizontal: Spacing.lg,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

export default NotificationsScreen;
