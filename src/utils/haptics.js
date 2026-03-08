/**
 * Haptic Feedback Utilities
 * Provides tactile feedback for user interactions
 * @module utils/haptics
 */
import { Platform, Vibration } from 'react-native';

/**
 * Haptic feedback types with vibration patterns
 */
const HAPTIC_PATTERNS = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [0, 30, 50, 30],
  warning: [0, 20, 40, 20],
  error: [0, 50, 100, 50],
  selection: 5,
};

/**
 * Triggers haptic feedback
 * @param {'light'|'medium'|'heavy'|'success'|'warning'|'error'|'selection'} type - Feedback type
 */
export const triggerHaptic = (type = 'light') => {
  try {
    const pattern = HAPTIC_PATTERNS[type] || HAPTIC_PATTERNS.light;

    if (Platform.OS === 'android') {
      if (Array.isArray(pattern)) {
        Vibration.vibrate(pattern);
      } else {
        Vibration.vibrate(pattern);
      }
    }
    // iOS would use react-native-haptic-feedback library
  } catch (error) {
    // Silently fail if haptics not available
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Haptic feedback for button press
 */
export const hapticPress = () => triggerHaptic('light');

/**
 * Haptic feedback for success actions
 */
export const hapticSuccess = () => triggerHaptic('success');

/**
 * Haptic feedback for error/warning
 */
export const hapticError = () => triggerHaptic('error');

/**
 * Haptic feedback for selection change
 */
export const hapticSelection = () => triggerHaptic('selection');

/**
 * Higher-order function to add haptic feedback to a handler
 * @param {function} handler - Original handler function
 * @param {'light'|'medium'|'heavy'|'success'|'warning'|'error'|'selection'} type - Feedback type
 * @returns {function} Handler with haptic feedback
 */
export const withHaptic = (handler, type = 'light') => {
  return (...args) => {
    triggerHaptic(type);
    return handler?.(...args);
  };
};

export default {
  trigger: triggerHaptic,
  press: hapticPress,
  success: hapticSuccess,
  error: hapticError,
  selection: hapticSelection,
  withHaptic,
};
