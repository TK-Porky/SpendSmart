/**
 * MonthSelector Component
 * Horizontal scroll selector for months
 * @module components/MonthSelector
 */
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius } from '../constants';

const MonthSelector = ({ selectedMonth, selectedYear, onMonthChange }) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const handlePrevious = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear = selectedYear - 1;
    }

    onMonthChange(newMonth, newYear);
  };

  const handleNext = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear = selectedYear + 1;
    }

    // Don't allow future months
    const futureDate = new Date(newYear, newMonth);
    const today = new Date();
    if (futureDate > today) return;

    onMonthChange(newMonth, newYear);
  };

  const handleMonthSelect = (monthIndex) => {
    onMonthChange(monthIndex, selectedYear);
  };

  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear;
  const isFutureMonth = (monthIndex) => {
    const checkDate = new Date(selectedYear, monthIndex);
    return checkDate > new Date();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevious} style={styles.arrowButton}>
          <Icon name="chevron-left" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.currentMonth}>
          <Text style={styles.monthText}>{months[selectedMonth]}</Text>
          <Text style={styles.yearText}>{selectedYear}</Text>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.arrowButton, isFutureMonth(selectedMonth + 1) && styles.disabledButton]}
          disabled={isFutureMonth(selectedMonth + 1)}
        >
          <Icon
            name="chevron-right"
            size={24}
            color={isFutureMonth(selectedMonth + 1) ? Colors.neutral[300] : Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthsScroll}
        contentContainerStyle={styles.monthsContainer}
      >
        {months.map((month, index) => {
          const isSelected = index === selectedMonth;
          const isFuture = isFutureMonth(index);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleMonthSelect(index)}
              style={[
                styles.monthChip,
                isSelected && styles.monthChipSelected,
                isFuture && styles.monthChipDisabled,
              ]}
              disabled={isFuture}
            >
              <Text
                style={[
                  styles.monthChipText,
                  isSelected && styles.monthChipTextSelected,
                  isFuture && styles.monthChipTextDisabled,
                ]}
              >
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    paddingVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  currentMonth: {
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginTop: 2,
  },
  monthsScroll: {
    paddingHorizontal: Spacing.md,
  },
  monthsContainer: {
    gap: Spacing.sm,
  },
  monthChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
    minWidth: 60,
    alignItems: 'center',
  },
  monthChipSelected: {
    backgroundColor: Colors.primary.main,
  },
  monthChipDisabled: {
    backgroundColor: Colors.background.secondary,
    opacity: 0.4,
  },
  monthChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  monthChipTextSelected: {
    color: Colors.text.inverse,
  },
  monthChipTextDisabled: {
    color: Colors.neutral[400],
  },
});

export default MonthSelector;
