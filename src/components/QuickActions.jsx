/**
 * QuickActions Component
 * Displays quick action buttons for common tasks
 * @module components/QuickActions
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius } from '../constants';

/**
 * QuickActions Component
 * @param {Object} props
 * @param {function} props.onSend - Callback for send action
 * @param {function} props.onReceive - Callback for receive action
 * @param {function} props.onPay - Callback for pay action
 * @param {function} props.onMore - Callback for more action
 */
const QuickActions = ({ onSend, onReceive, onPay, onMore }) => {
  const actions = [
    {
      id: 'send',
      icon: 'arrow-up',
      label: 'Send',
      color: Colors.primary.main,
      onPress: onSend,
    },
    {
      id: 'receive',
      icon: 'arrow-down',
      label: 'Receive',
      color: Colors.success,
      onPress: onReceive,
    },
    {
      id: 'pay',
      icon: 'credit-card',
      label: 'Pay',
      color: Colors.info,
      onPress: onPay,
    },
    {
      id: 'more',
      icon: 'dots-horizontal',
      label: 'More',
      color: Colors.neutral[600],
      onPress: onMore,
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionButton}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
            <Icon name={action.icon} size={24} color={action.color} />
          </View>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

export default QuickActions;
