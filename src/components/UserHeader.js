/**
 * User Header Component
 * Displays user profile info with time-based greeting and action icons
 * Modern design with improved visual hierarchy
 * @module components/UserHeader
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius } from '../constants';

/**
 * Get time-based greeting message
 * @returns {string} Greeting message
 */
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};

/**
 * Get greeting icon based on time of day
 * @returns {string} Icon name
 */
const getGreetingIcon = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'white-balance-sunny';
  } else if (hour < 18) {
    return 'weather-partly-cloudy';
  } else {
    return 'moon-waning-crescent';
  }
};

const UserHeader = ({
  userProfile,
  userDisplayName,
  onNavigateToProfile,
  onNotificationPress,
  onSettingsPress,
}) => {
  const displayChar = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'U';
  const greeting = getTimeBasedGreeting();
  const greetingIcon = getGreetingIcon();

  return (
    <View style={styles.headerContainer}>
      {/* Left Section - User Info */}
      <TouchableOpacity
        style={styles.userInfo}
        onPress={onNavigateToProfile}
        activeOpacity={0.7}
      >
        {userProfile?.photoURL ? (
          <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{displayChar}</Text>
          </View>
        )}
        <View style={styles.greetingContainer}>
          <View style={styles.greetingRow}>
            <Icon name={greetingIcon} size={16} color={Colors.warning} />
            <Text style={styles.greeting}>{greeting}</Text>
          </View>
          <Text style={styles.userName} numberOfLines={1}>
            {userDisplayName || 'User'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right Section - Action Icons */}
      <View style={styles.headerIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Icon name="bell-outline" size={22} color={Colors.text.primary} />
            {/* Notification badge */}
            <View style={styles.notificationBadge} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary.subtle,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary.subtle,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    letterSpacing: 0.2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  iconButton: {
    marginLeft: Spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.background.secondary,
  },
});

export default UserHeader;
