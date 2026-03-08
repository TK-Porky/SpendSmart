/**
 * Network Status Hook
 * Monitors network connectivity and provides status
 * @module hooks/useNetworkStatus
 */
import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Network status object
 * @typedef {Object} NetworkStatus
 * @property {boolean} isConnected - Whether device is connected to internet
 * @property {boolean} isInternetReachable - Whether internet is actually reachable
 * @property {string|null} type - Connection type (wifi, cellular, etc.)
 * @property {boolean} isLoading - Whether status is still being determined
 */

/**
 * Hook to monitor network connectivity status
 * @returns {NetworkStatus} Current network status
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: null,
    isLoading: true,
  });

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        isLoading: false,
      });
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        isLoading: false,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return status;
};

/**
 * Hook to check network before performing an action
 * @returns {Object} Network check utilities
 */
export const useNetworkCheck = () => {
  const status = useNetworkStatus();

  /**
   * Checks if network is available before executing callback
   * @param {function} callback - Function to execute if online
   * @param {function} [onOffline] - Function to execute if offline
   * @returns {Promise<any>} Result of callback
   */
  const checkAndExecute = useCallback(async (callback, onOffline) => {
    if (!status.isConnected || !status.isInternetReachable) {
      if (onOffline) {
        onOffline();
      }
      throw new Error('No internet connection');
    }
    return await callback();
  }, [status.isConnected, status.isInternetReachable]);

  return {
    ...status,
    checkAndExecute,
    isOffline: !status.isConnected || !status.isInternetReachable,
  };
};

export default useNetworkStatus;
