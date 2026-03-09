/**
 * AccountFormScreen
 * Create or edit financial account
 * @module screens/Forms/AccountFormScreen
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
import { accountService } from '../../services/AccountService';

const ACCOUNT_TYPES = [
  { id: 'checking', name: 'Checking', icon: 'bank', color: '#3B82F6' },
  { id: 'savings', name: 'Savings', icon: 'piggy-bank', color: '#10B981' },
  { id: 'credit', name: 'Credit Card', icon: 'credit-card', color: '#EF4444' },
  { id: 'cash', name: 'Cash', icon: 'cash', color: '#F59E0B' },
  { id: 'investment', name: 'Investment', icon: 'trending-up', color: '#8B5CF6' },
  { id: 'loan', name: 'Loan', icon: 'hand-coin', color: '#EC4899' },
];

const ACCOUNT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
  '#06B6D4', '#14B8A6', '#F97316', '#84CC16', '#A855F7', '#E11D48',
];

function AccountFormScreen({ navigation, route }) {
  const [user] = useState(auth().currentUser);
  const isEditMode = route.params?.accountId;
  const existingAccount = route.params?.account;

  const [formData, setFormData] = useState({
    name: '',
    type: 'checking',
    initialBalance: '',
    currentBalance: '',
    color: '#3B82F6',
    icon: 'bank',
    notes: '',
    includeInTotal: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingAccount) {
      setFormData({
        name: existingAccount.name || '',
        type: existingAccount.type || 'checking',
        initialBalance: existingAccount.initialBalance?.toString() || '0',
        currentBalance: existingAccount.currentBalance?.toString() || '0',
        color: existingAccount.color || '#3B82F6',
        icon: existingAccount.icon || 'bank',
        notes: existingAccount.notes || '',
        includeInTotal: existingAccount.includeInTotal !== false,
      });
    }
  }, [existingAccount]);

  const handleTypeSelect = (type) => {
    const selectedType = ACCOUNT_TYPES.find((t) => t.id === type);
    setFormData({
      ...formData,
      type,
      icon: selectedType?.icon || 'bank',
      color: selectedType?.color || '#3B82F6',
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Missing Name', 'Please enter an account name.');
      return;
    }

    if (!formData.initialBalance || parseFloat(formData.initialBalance) < 0) {
      Alert.alert('Invalid Balance', 'Please enter a valid initial balance.');
      return;
    }

    setSaving(true);
    try {
      const accountData = {
        name: formData.name.trim(),
        type: formData.type,
        initialBalance: parseFloat(formData.initialBalance),
        currentBalance: isEditMode
          ? parseFloat(formData.currentBalance)
          : parseFloat(formData.initialBalance),
        color: formData.color,
        icon: formData.icon,
        notes: formData.notes.trim(),
        includeInTotal: formData.includeInTotal,
      };

      if (isEditMode) {
        await accountService.updateAccount(user.uid, route.params.accountId, accountData);
        Alert.alert('Success', 'Account updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await accountService.createAccount(user.uid, accountData);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error('Error saving account:', error);
      Alert.alert('Error', 'Failed to save account. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3B82F6', '#2563EB']}
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
            {isEditMode ? 'Edit Account' : 'Add Account'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditMode ? 'Update account details' : 'Create a new financial account'}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="tag" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="e.g., Main Checking"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </View>

        {/* Account Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Type</Text>
          <View style={styles.typesGrid}>
            {ACCOUNT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  formData.type === type.id && styles.typeCardSelected,
                ]}
                onPress={() => handleTypeSelect(type.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.typeIcon,
                    { backgroundColor: `${type.color}15` },
                    formData.type === type.id && {
                      backgroundColor: type.color,
                    },
                  ]}
                >
                  <Icon
                    name={type.icon}
                    size={28}
                    color={
                      formData.type === type.id ? Colors.text.inverse : type.color
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.typeName,
                    formData.type === type.id && styles.typeNameSelected,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Initial Balance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Initial Balance</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>XOF</Text>
            <TextInput
              style={styles.amountInput}
              value={formData.initialBalance}
              onChangeText={(text) => setFormData({ ...formData, initialBalance: text })}
              placeholder="0.00"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
              editable={!isEditMode}
            />
          </View>
          {isEditMode && (
            <Text style={styles.fieldHint}>
              Initial balance cannot be changed after creation
            </Text>
          )}
        </View>

        {/* Current Balance (Edit Mode Only) */}
        {isEditMode && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Current Balance</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>XOF</Text>
              <TextInput
                style={styles.amountInput}
                value={formData.currentBalance}
                onChangeText={(text) =>
                  setFormData({ ...formData, currentBalance: text })
                }
                placeholder="0.00"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Color</Text>
          <View style={styles.colorsGrid}>
            {ACCOUNT_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  formData.color === color && styles.colorOptionSelected,
                ]}
                onPress={() => setFormData({ ...formData, color })}
                activeOpacity={0.7}
              >
                {formData.color === color && (
                  <Icon name="check" size={20} color={Colors.text.inverse} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Include in Total */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() =>
              setFormData({ ...formData, includeInTotal: !formData.includeInTotal })
            }
            activeOpacity={0.7}
          >
            <View style={styles.toggleLeft}>
              <Icon
                name="calculator"
                size={24}
                color={Colors.text.secondary}
                style={styles.toggleIcon}
              />
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>Include in Total Balance</Text>
                <Text style={styles.toggleHint}>
                  Show this account in your total balance calculation
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.toggle,
                formData.includeInTotal && styles.toggleActive,
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  formData.includeInTotal && styles.toggleThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (Optional)</Text>
          <View style={styles.notesContainer}>
            <TextInput
              style={styles.notesInput}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Add account details, bank info, etc..."
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
            colors={saving ? ['#94A3B8', '#94A3B8'] : ['#3B82F6', '#2563EB']}
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
                  {isEditMode ? 'Update Account' : 'Create Account'}
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
  fieldHint: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
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
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    width: '31%',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  typeCardSelected: {
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
  typeName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  typeNameSelected: {
    color: Colors.primary.main,
    fontWeight: '700',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: Colors.background.card,
    ...Shadows.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    marginRight: Spacing.md,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  toggleHint: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  toggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.neutral[300],
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary.main,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.text.inverse,
    ...Shadows.sm,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
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

export default AccountFormScreen;
