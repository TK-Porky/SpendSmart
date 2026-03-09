/**
 * AddTransactionScreen
 * Modern form for adding transactions
 * @module screens/Forms/AddTransactionScreen
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
import { Colors, Spacing, Radius, Shadows } from '../../constants';
import { LoadingSpinner } from '../../components';
import { transactionService } from '../../services/TransactionService';
import { categoryService } from '../../services/CategoryService';
import { accountService } from '../../services/AccountService';

const TRANSACTION_TYPES = [
  { id: 'expense', label: 'Expense', icon: 'arrow-up', color: '#EF4444' },
  { id: 'income', label: 'Income', icon: 'arrow-down', color: '#10B981' },
  { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal', color: '#3B82F6' },
];

function AddTransactionScreen({ navigation, route }) {
  const [user] = useState(auth().currentUser);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');

  // Data
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const [fetchedCategories, fetchedAccounts] = await Promise.all([
        categoryService.getAllCategories(user.uid),
        accountService.getAccounts(user.uid),
      ]);

      // Filter categories by type
      const filteredCategories = fetchedCategories.filter(
        (c) => c.type === type || type === 'transfer'
      );
      setCategories(filteredCategories);
      setAccounts(fetchedAccounts);

      // Auto-select first category and default account
      if (filteredCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(filteredCategories[0]);
      }
      if (fetchedAccounts.length > 0 && !selectedAccount) {
        const defaultAccount = fetchedAccounts.find((a) => a.isDefault) || fetchedAccounts[0];
        setSelectedAccount(defaultAccount);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load categories and accounts.');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setSelectedCategory(null);
  };

  const handleSave = async () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (!selectedCategory && type !== 'transfer') {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Missing Account', 'Please select an account.');
      return;
    }

    setSaving(true);
    try {
      const transaction = {
        type,
        amount: parseFloat(amount),
        description: description || `${type} transaction`,
        categoryId: selectedCategory?.id || null,
        categoryName: selectedCategory?.name || '',
        categoryIcon: selectedCategory?.icon || '',
        categoryColor: selectedCategory?.color || Colors.neutral[500],
        accountId: selectedAccount.id,
        accountName: selectedAccount.name,
        date: date,
        detail: notes,
        userId: user.uid,
      };

      await transactionService.addTransaction(user.uid, transaction);

      Alert.alert('Success', 'Transaction added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDateDisplay = (date) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getHeaderGradient = () => {
    const gradients = {
      expense: ['#EF4444', '#DC2626'],
      income: ['#10B981', '#059669'],
      transfer: ['#3B82F6', '#2563EB'],
    };
    return gradients[type];
  };

  if (loading) {
    return <LoadingSpinner message="Loading..." fullScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header with Dynamic Gradient */}
      <LinearGradient
        colors={getHeaderGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="close" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Add Transaction</Text>
          <Text style={styles.headerSubtitle}>Record your {type}</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Transaction Type</Text>
          <View style={styles.typeSelector}>
            {TRANSACTION_TYPES.map((transactionType) => (
              <TouchableOpacity
                key={transactionType.id}
                style={[
                  styles.typeButton,
                  type === transactionType.id && styles.typeButtonSelected,
                ]}
                onPress={() => handleTypeChange(transactionType.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.typeIcon,
                    { backgroundColor: `${transactionType.color}15` },
                    type === transactionType.id && {
                      backgroundColor: transactionType.color,
                    },
                  ]}
                >
                  <Icon
                    name={transactionType.icon}
                    size={24}
                    color={
                      type === transactionType.id
                        ? Colors.text.inverse
                        : transactionType.color
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.typeLabel,
                    type === transactionType.id && styles.typeLabelSelected,
                  ]}
                >
                  {transactionType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>XOF</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
              autoFocus
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description (Optional)</Text>
          <View style={styles.inputContainer}>
            <Icon name="text" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g., Grocery shopping"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </View>

        {/* Category Selector */}
        {type !== 'transfer' && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory?.id === category.id && styles.categoryCardSelected,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      { backgroundColor: `${category.color}15` },
                      selectedCategory?.id === category.id && {
                        backgroundColor: category.color,
                      },
                    ]}
                  >
                    <Icon
                      name={category.icon}
                      size={28}
                      color={
                        selectedCategory?.id === category.id
                          ? Colors.text.inverse
                          : category.color
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory?.id === category.id && styles.categoryLabelSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Account Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.accountList}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountButton,
                  selectedAccount?.id === account.id && styles.accountButtonSelected,
                ]}
                onPress={() => setSelectedAccount(account)}
                activeOpacity={0.7}
              >
                <View style={styles.accountInfo}>
                  <View
                    style={[
                      styles.accountIconContainer,
                      { backgroundColor: `${account.color || '#3B82F6'}15` },
                    ]}
                  >
                    <Icon
                      name={account.icon || 'bank'}
                      size={20}
                      color={account.color || '#3B82F6'}
                    />
                  </View>
                  <Text style={styles.accountName}>{account.name}</Text>
                </View>
                {selectedAccount?.id === account.id && (
                  <Icon name="check-circle" size={20} color={Colors.primary.main} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <TouchableOpacity style={styles.dateButton} activeOpacity={0.7}>
            <Icon name="calendar" size={20} color={Colors.text.tertiary} />
            <Text style={styles.dateText}>{formatDateDisplay(date)}</Text>
            <Text style={styles.dateSubtext}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (Optional)</Text>
          <View style={styles.notesContainer}>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes..."
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
            colors={saving ? ['#94A3B8', '#94A3B8'] : getHeaderGradient()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            {saving ? (
              <LoadingSpinner size="small" color={Colors.text.inverse} />
            ) : (
              <>
                <Icon name="check" size={20} color={Colors.text.inverse} />
                <Text style={styles.saveButtonText}>Save Transaction</Text>
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
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  typeButtonSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.subtle,
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  typeLabelSelected: {
    color: Colors.primary.main,
    fontWeight: '700',
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
  categoryScroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 90,
    ...Shadows.sm,
  },
  categoryCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.subtle,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: Colors.primary.main,
    fontWeight: '700',
  },
  accountList: {
    gap: Spacing.sm,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  accountButtonSelected: {
    backgroundColor: Colors.primary.subtle,
    borderColor: Colors.primary.main,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  dateSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.tertiary,
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

export default AddTransactionScreen;
