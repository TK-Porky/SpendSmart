/**
 * Toast Notification Context
 * Provides app-wide toast notification functionality
 * @module context/ToastContext
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants';

/**
 * Toast types with their styling
 */
const TOAST_TYPES = {
  success: {
    icon: 'check-circle',
    backgroundColor: Colors.success.main,
  },
  error: {
    icon: 'alert-circle',
    backgroundColor: Colors.error.main,
  },
  warning: {
    icon: 'alert',
    backgroundColor: Colors.warning.main,
  },
  info: {
    icon: 'information',
    backgroundColor: Colors.info.main,
  },
};

/**
 * Default toast duration in ms
 */
const DEFAULT_DURATION = 3000;

/**
 * Toast context
 */
const ToastContext = createContext(null);

/**
 * Hook to use toast notifications
 * @returns {Object} Toast methods
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Toast Provider Component
 * Wrap your app with this to enable toast notifications
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [visible, setVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);

  /**
   * Shows a toast notification
   */
  const show = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = DEFAULT_DURATION,
      action,
      actionLabel,
    } = options;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set toast content
    setToast({
      message,
      type,
      action,
      actionLabel,
    });
    setVisible(true);

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide after duration
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        hide();
      }, duration);
    }
  }, [fadeAnim, slideAnim]);

  /**
   * Hides the current toast
   */
  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setToast(null);
    });
  }, [fadeAnim, slideAnim]);

  /**
   * Convenience methods for different toast types
   */
  const success = useCallback((message, options = {}) => {
    show(message, { ...options, type: 'success' });
  }, [show]);

  const error = useCallback((message, options = {}) => {
    show(message, { ...options, type: 'error' });
  }, [show]);

  const warning = useCallback((message, options = {}) => {
    show(message, { ...options, type: 'warning' });
  }, [show]);

  const info = useCallback((message, options = {}) => {
    show(message, { ...options, type: 'info' });
  }, [show]);

  const contextValue = {
    show,
    hide,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {visible && toast && (
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: TOAST_TYPES[toast.type]?.backgroundColor || Colors.info.main,
            },
          ]}
        >
          <View style={styles.content}>
            <Icon
              name={TOAST_TYPES[toast.type]?.icon || 'information'}
              size={24}
              color={Colors.text.inverse}
              style={styles.icon}
            />
            <Text style={styles.message} numberOfLines={2}>
              {toast.message}
            </Text>
            {toast.action && toast.actionLabel && (
              <TouchableOpacity
                onPress={() => {
                  toast.action();
                  hide();
                }}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>{toast.actionLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={hide} style={styles.closeButton}>
              <Icon name="close" size={20} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    right: 16,
    borderRadius: 8,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.inverse,
    fontWeight: '500',
  },
  actionButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ToastProvider;
