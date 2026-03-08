/**
 * FilterBar Component
 * Filter buttons for transaction types
 * @module components/FilterBar
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius } from '../constants';

const FilterBar = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All', icon: 'view-list', color: Colors.neutral[600] },
    { id: 'income', label: 'Income', icon: 'arrow-down', color: Colors.success },
    { id: 'expense', label: 'Expense', icon: 'arrow-up', color: Colors.error },
    { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal', color: Colors.info },
  ];

  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onFilterChange(filter.id)}
            style={[
              styles.filterButton,
              isActive && styles.filterButtonActive,
              isActive && { backgroundColor: `${filter.color}15` },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${filter.color}20` }]}>
              <Icon
                name={filter.icon}
                size={18}
                color={filter.color}
              />
            </View>
            <Text
              style={[
                styles.filterText,
                isActive && { color: filter.color, fontWeight: '700' },
              ]}
            >
              {filter.label}
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background.primary,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
    gap: Spacing.xs,
  },
  filterButtonActive: {
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
});

export default FilterBar;
