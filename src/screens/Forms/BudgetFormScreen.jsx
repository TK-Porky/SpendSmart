/**
 * BudgetFormScreen
 * Create or edit budget with categories and date range
 * @module screens/Forms/BudgetFormScreen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { LoadingSpinner } from '../../components';
import { Colors, Spacing, Radius, Shadows } from '../../constants';
import { budgetService } from '../../services/BudgetService';

const BUDGET_PERIODS = [
  { id: 'weekly', label: 'Weekly', icon: 'calendar-week' },
  { id: 'monthly', label: 'Monthly', icon: 'calendar-month' },
  { id: 'yearly', label: 'Yearly', icon: 'calendar' },
  { id: 'custom', label: 'Custom', icon: 'calendar-range' },
];

const BUDGET_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'food', color: '#F59E0B' },
  { id: 'transport', name: 'Transportation', icon: 'car', color: '#3B82F6' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping', color: '#EC4899' },
  { id: 'entertainment', name: 'Entertainment', icon: 'movie', color: '#8B5CF6' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'receipt', color: '#EF4444' },
  { id: 'health', name: 'Health & Fitness', icon: 'heart', color: '#10B981' },
  { id: 'education', name: 'Education', icon: 'school', color: '#06B6D4' },
  { id: 'other', name: 'Other', icon: 'dots-horizontal', color: '#6B7280' },
];

function BudgetFormScreen({ navigation, route }) {
  const [user] = useState(auth().currentUser);
  const isEditMode = route.params?.budgetId;
  const existingBudget = route.params?.budget;

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    period: 'monthly',
    categoryIds: [],
    notes: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingBudget) {
      setFormData({
        name: existingBudget.name || '',
        amount: existingBudget.amount?.toString() || '',
        period: existingBudget.period || 'monthly',
        categoryIds: existingBudget.categoryIds || [],
        notes: existingBudget.notes || '',
      });
    }
  }, [existingBudget]);

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Missing Name', 'Please enter a budget name.');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }

    setSaving(true);
    try {
      const budgetData = {
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        period: formData.period,
        categoryIds: formData.categoryIds,
        notes: formData.notes.trim(),
        // Calculate start and end dates based on period
        startDate: new Date(),
        endDate: calculateEndDate(formData.period),
      };

      if (isEditMode) {
        await budgetService.updateBudget(user.uid, route.params.budgetId, budgetData);
        Alert.alert('Success', 'Budget updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await budgetService.createBudget(user.uid, budgetData);
        Alert.alert('Success', 'Budget created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      Alert.alert('Error', 'Failed to save budget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateEndDate = (period) => {
    const start = new Date();
    const end = new Date(start);

    switch (period) {
      case 'weekly':
        end.setDate(end.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
      default:
        end.setMonth(end.getMonth() + 1);
    }

    return end;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Budget' : 'Create Budget'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditMode ? 'Update your spending limit' : 'Set a new spending limit'}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Budget Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Budget Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="tag" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Monthly Groceries"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </View>

        {/* Budget Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Budget Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>XOF</Text>
            <TextInput
              style={styles.amountInput}
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              placeholder="0.00"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Budget Period */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Period</Text>
          <View style={styles.periodsGrid}>
            {BUDGET_PERIODS.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodCard,
                  formData.period === period.id && styles.periodCardSelected,
                ]}
                onPress={() => setFormData({ ...formData, period: period.id })}
                activeOpacity={0.7}
              >
                <Icon
                  name={period.icon}
                  size={24}
                  color={
                    formData.period === period.id
                      ? Colors.primary.main
                      : Colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.periodLabel,
                    formData.period === period.id && styles.periodLabelSelected,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Categories (Optional)</Text>
          <Text style={styles.sectionHint}>
            Leave empty to track all expenses, or select specific categories
          </Text>
          <View style={styles.categoriesGrid}>
            {BUDGET_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  formData.categoryIds.includes(category.id) &&
                    styles.categoryCardSelected,
                ]}
                onPress={() => handleCategoryToggle(category.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: `${category.color}15` },
                    formData.categoryIds.includes(category.id) && {
                      backgroundColor: category.color,
                    },
                  ]}
                >
                  <Icon
                    name={category.icon}
                    size={24}
                    color={
                      formData.categoryIds.includes(category.id)
                        ? Colors.text.inverse
                        : category.color
                    }
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                {formData.categoryIds.includes(category.id) && (
                  <View style={styles.checkmark}>
                    <Icon name="check-circle" size={20} color={Colors.primary.main} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (Optional)</Text>
          <View style={styles.notesContainer}>
            <TextInput
              style={styles.notesInput}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Add any notes or reminders..."
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={saving ? ['#94A3B8', '#94A3B8'] : ['#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            {saving ? (
              <LoadingSpinner size="small" color={Colors.text.inverse} />
            ) : (
              <>
                <Icon name="check" size={20} color={Colors.text.inverse} />
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'Update Budget' : 'Create Budget'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + Spacing.md : Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.inverse,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  sectionHint: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    padding: 0,
    height: '100%',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text.primary,
    padding: 0,
    minWidth: 120,
    textAlign: 'center',
  },
  periodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  periodCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  periodCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.subtle,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  periodLabelSelected: {
    color: Colors.primary.main,
  },
  categoriesGrid: {
    gap: Spacing.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  categoryCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.subtle,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  checkmark: {
    marginLeft: Spacing.sm,
  },
  notesContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  notesInput: {
    fontSize: 15,
    color: Colors.text.primary,
    minHeight: 100,
    padding: 0,
  },
  saveButton: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    height: 52,
    ...Shadows.md,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: '100%',
    paddingHorizontal: Spacing.lg,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

export default BudgetFormScreen;
