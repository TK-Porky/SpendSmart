/**
 * Offline Banner Component
 * Displays a banner when the app is offline
 * @module components/OfflineBanner
 */
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

/**
 * Offline Banner Component
 * Automatically shows/hides based on network status
 */
const OfflineBanner = () => {
  const { isConnected, isInternetReachable, isLoading } = useNetworkStatus();
  const isOffline = !isLoading && (!isConnected || !isInternetReachable);

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View style={styles.container}>
      <Icon name="wifi-off" size={16} color={Colors.text.inverse} />
      <Text style={styles.text}>Mode hors connexion</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.warning.dark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});

export default OfflineBanner;
