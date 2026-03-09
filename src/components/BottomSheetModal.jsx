/**
 * BottomSheetModal Component
 * Reusable bottom sheet for action selections
 * @module components/BottomSheetModal
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Shadows } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * BottomSheetModal Component
 * @param {boolean} visible - Controls modal visibility
 * @param {function} onClose - Called when modal is closed
 * @param {string} title - Modal title
 * @param {Array} options - Array of option objects with { label, icon, color, onPress }
 */
const BottomSheetModal = ({ visible, onClose, title, options = [] }) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 25,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim]);

  const handleOptionPress = (onPress) => {
    onClose();
    // Small delay to allow animation to complete
    setTimeout(() => {
      onPress();
    }, 100);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Title */}
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}

          {/* Options */}
          <View style={styles.options}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  index === options.length - 1 && styles.lastOption,
                ]}
                onPress={() => handleOptionPress(option.onPress)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${option.color}15` }]}>
                  <Icon name={option.icon} size={24} color={option.color} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {option.description && (
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  )}
                </View>
                <Icon name="chevron-right" size={20} color={Colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          {/* Bottom Safe Area */}
          <View style={styles.bottomSafeArea} />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: Colors.background.secondary,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.sm,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border.light,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  options: {
    backgroundColor: Colors.background.card,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  cancelButton: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  bottomSafeArea: {
    height: Platform.OS === 'ios' ? Spacing.lg : Spacing.md,
  },
});

export default BottomSheetModal;
