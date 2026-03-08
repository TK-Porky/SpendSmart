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
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';
import { LoadingSpinner } from '../../components';
import { transactionService } from '../../services/TransactionService';
import { categoryService } from '../../services/CategoryService';
import { accountService } from '../../services/AccountService';

const TRANSACTION_TYPES = [
  { id: 'expense', label: 'Expense', icon: 'arrow-up', color: Colors.error },
  { id: 'income', label: 'Income', icon: 'arrow-down', color: Colors.success },
  { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal', color: Colors.info },
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

  if (loading) {
    return <LoadingSpinner message="Loading..." fullScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Transaction</Text>

        <View style={styles.headerSpacer} />
      </View>

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
                  type === transactionType.id && {
                    backgroundColor: `${transactionType.color}15`,
                    borderColor: transactionType.color,
                  },
                ]}
                onPress={() => handleTypeChange(transactionType.id)}
                activeOpacity={0.7}
              >
                <Icon
                  name={transactionType.icon}
                  size={24}
                  color={type === transactionType.id ? transactionType.color : Colors.text.secondary}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    type === transactionType.id && { color: transactionType.color, fontWeight: '700' },
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
          <View style={styles.amountInput}>
            <Text style={styles.currencySymbol}>XOF</Text>
            <TextInput
              style={styles.amountField}
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
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., Grocery shopping"
            placeholderTextColor={Colors.text.tertiary}
          />
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
                    styles.categoryButton,
                    selectedCategory?.id === category.id && {
                      backgroundColor: `${category.color}15`,
                      borderColor: category.color,
                    },
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={category.icon}
                    size={28}
                    color={selectedCategory?.id === category.id ? category.color : Colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      selectedCategory?.id === category.id && {
                        color: category.color,
                        fontWeight: '700',
                      },
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
                  <Icon name="bank" size={20} color={Colors.text.secondary} />
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
            <Icon name="calendar" size={20} color={Colors.text.secondary} />
            <Text style={styles.dateText}>{formatDateDisplay(date)}</Text>
            <Text style={styles.dateSubtext}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            placeholderTextColor={Colors.text.tertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <LoadingSpinner size="small" color={Colors.text.inverse} />
          ) : (
            <>
              <Icon name="check" size={20} color={Colors.text.inverse} />
              <Text style={styles.saveButtonText}>Save Transaction</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + Spacing.md : Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.primary,
    ...Shadows.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  amountField: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    padding: 0,
  },
  input: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.text.primary,
    ...Shadows.sm,
  },
  categoryScroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  categoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 90,
    ...Shadows.sm,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
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
    gap: Spacing.sm,
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
    color: Colors.text.tertiary,
  },
  notesInput: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.text.primary,
    minHeight: 80,
    ...Shadows.sm,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary.main,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    ...Shadows.md,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default AddTransactionScreen;
