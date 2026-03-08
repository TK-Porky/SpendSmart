/**
 * User Header Component
 * Displays user profile info with greeting and action icons
 * Minimalist flat design with Modern Teal accent
 * @module components/UserHeader
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Typography } from '../constants';

const UserHeader = ({
  userProfile,
  userDisplayName,
  onNavigateToProfile,
  onNotificationPress,
  onSettingsPress,
}) => {
  const displayChar = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.userInfo} onPress={onNavigateToProfile}>
        {userProfile?.photoURL ? (
          <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{displayChar}</Text>
          </View>
        )}
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{userDisplayName || 'Utilisateur'}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconButton} onPress={onNotificationPress}>
          <Icon name="bell-outline" size={24} color={Colors.neutral[600]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onSettingsPress}>
          <Icon name="cog-outline" size={24} color={Colors.neutral[600]} />
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
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.text.inverse,
  },
  userName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
  },
  greeting: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
});

export default UserHeader;
