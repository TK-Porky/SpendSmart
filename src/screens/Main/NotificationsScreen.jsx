/**
 * NotificationsScreen
 * Modern notification center with activity feed
 * @module screens/Main/NotificationsScreen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';
import { EmptyState, SkeletonList } from '../../components';

function NotificationsScreen({ navigation }) {
  const [user] = useState(auth().currentUser);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock notifications data - replace with actual service later
  const mockNotifications = [
    {
      id: '1',
      type: 'transaction',
      title: 'Payment Received',
      description: 'You received $250.00 from John Doe',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      icon: 'arrow-down-circle',
      iconColor: Colors.success,
    },
    {
      id: '2',
      type: 'budget',
      title: 'Budget Alert',
      description: 'You\'ve spent 85% of your Groceries budget',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      read: false,
      icon: 'alert-circle',
      iconColor: Colors.warning,
    },
    {
      id: '3',
      type: 'transaction',
      title: 'Payment Sent',
      description: 'You sent $120.00 to Jane Smith',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      icon: 'arrow-up-circle',
      iconColor: Colors.error,
    },
    {
      id: '4',
      type: 'account',
      title: 'Account Connected',
      description: 'Successfully linked your Bank of America account',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true,
      icon: 'bank-check',
      iconColor: Colors.info,
    },
    {
      id: '5',
      type: 'system',
      title: 'Welcome to SpendSmart!',
      description: 'Thanks for joining. Start tracking your expenses today.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      read: true,
      icon: 'party-popper',
      iconColor: Colors.primary.main,
    },
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual notification service
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'transaction':
        // TODO: Navigate to transaction detail
        console.log('Navigate to transaction:', notification.id);
        break;
      case 'budget':
        navigation.navigate('Budgets');
        break;
      case 'account':
        navigation.navigate('Budgets', { tab: 'accounts' });
        break;
      default:
        break;
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerAction}
              onPress={handleMarkAllRead}
              activeOpacity={0.7}
            >
              <Icon name="check-all" size={22} color={Colors.primary.main} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerAction}
              onPress={handleClearAll}
              activeOpacity={0.7}
            >
              <Icon name="delete-outline" size={22} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>

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
        {loading ? (
          <SkeletonList count={5} variant="transaction" />
        ) : notifications.length > 0 ? (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onPress={handleNotificationPress}
                getTimeAgo={getTimeAgo}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="bell-off-outline"
            title="No Notifications"
            message="You're all caught up! Check back later for updates."
            style={{ paddingVertical: 80 }}
          />
        )}
      </ScrollView>
    </View>
  );
}

// Notification Item Component
const NotificationItem = ({ notification, onPress, getTimeAgo }) => (
  <TouchableOpacity
    style={[styles.notificationItem, !notification.read && styles.unreadItem]}
    onPress={() => onPress(notification)}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.notificationIcon,
        { backgroundColor: `${notification.iconColor}15` },
      ]}
    >
      <Icon name={notification.icon} size={24} color={notification.iconColor} />
    </View>

    <View style={styles.notificationContent}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        {!notification.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationDescription}>
        {notification.description}
      </Text>
      <Text style={styles.notificationTime}>
        {getTimeAgo(notification.timestamp)}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + Spacing.md : Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.primary,
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  unreadBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsList: {
    paddingTop: Spacing.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  unreadItem: {
    backgroundColor: Colors.primary.subtle,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.main,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary.main,
    marginLeft: Spacing.xs,
  },
  notificationDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
});

export default NotificationsScreen;
