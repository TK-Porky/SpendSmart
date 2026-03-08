/**
 * Tab Selector Component
 * Reusable tab switcher for navigating between views
 * Minimalist flat design with Modern Teal accent
 * @module components/TabSelector
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Shadows, Typography } from '../constants';

/**
 * TabSelector - A clean, flat tab navigation component
 *
 * @param {object} props - Component props
 * @param {string} props.activeTab - Currently active tab identifier
 * @param {function} props.onSelectTab - Callback when a tab is selected
 * @param {Array} props.tabs - Array of tab objects { key, label }
 */
const TabSelector = ({
  activeTab,
  onSelectTab,
  tabs = [
    { key: 'historiques', label: 'Historiques' },
    { key: 'transaction', label: 'Transaction' },
  ]
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              isActive && styles.activeTab,
            ]}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText,
              isActive && styles.activeTabText,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: Radius.full,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    padding: Spacing.xs,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  activeTab: {
    backgroundColor: Colors.primary.main,
    ...Shadows.sm,
  },
  tabText: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
});

export default TabSelector;
