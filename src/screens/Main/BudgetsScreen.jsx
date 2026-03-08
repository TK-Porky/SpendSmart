/**
 * Budgets Screen
 * Manages budgets and accounts with flat minimalist design
 * @module screens/Main/BudgetsScreen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  Modal, TextInput, Alert, Platform, ScrollView, RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { budgetService } from '../../services/BudgetService';
import { categoryService } from '../../services/CategoryService';
import { transactionService } from '../../services/TransactionService';
import { accountService } from '../../services/AccountService';
import { SkeletonList, EmptyState, EmptyStatePresets } from '../../components';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';
import { formatCurrency } from '../../utils';

import auth from '@react-native-firebase/auth';
import Budget from '../../models/Budget';
import Account from '../../models/Account';

const accountTypeIcons = {
  checking: 'bank',
  savings: 'piggy-bank',
  cash: 'cash',
  credit_card: 'credit-card',
  investment: 'chart-line',
  other: 'wallet',
};

function BudgetsScreen({ navigation }) {
  const [user, setUser] = useState(auth().currentUser);
  const [activeTab, setActiveTab] = useState('budgets');

  // Budget states
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Account states
  const [accounts, setAccounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  // Budget form states
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [frequency, setFrequency] = useState('monthly');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Account form states
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [initialBalance, setInitialBalance] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const fetchedBudgets = await budgetService.getBudgets(user.uid);
      setBudgets(fetchedBudgets);

      const fetchedCategories = await categoryService.getAllCategories(user.uid);
      setCategories(fetchedCategories.filter(c => c.type === 'expense'));

      const fetchedTransactions = await transactionService.getTransactions(user.uid);
      setTransactions(fetchedTransactions);

      const fetchedAccounts = await accountService.getAccounts(user.uid);
      setAccounts(fetchedAccounts);

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      Alert.alert('Erreur', 'Échec du chargement des données.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.uid]);

  useEffect(() => {
    if (!user.uid) return;

    const unsubscribeBudgets = budgetService.listenToBudgets(user.uid, (bgs) => {
      setBudgets(bgs);
    });

    const unsubscribeCategories = categoryService.listenToAllCategories(user.uid, (cats) => {
      setCategories(cats.filter(c => c.type === 'expense'));
    });

    const unsubscribeTransactions = transactionService.listenToTransactions(user.uid, (txs) => {
      setTransactions(txs);
    });

    const unsubscribeAccounts = accountService.listenToAccounts(user.uid, (accs) => {
      setAccounts(accs);
    });

    fetchData();

    return () => {
      unsubscribeBudgets();
      unsubscribeCategories();
      unsubscribeTransactions();
      unsubscribeAccounts();
    };
  }, [user.uid, fetchData]);

  const calculateSpent = useCallback((budget) => {
    const budgetStartDate = budget.startDate.getTime();
    const budgetEndDate = budget.endDate.getTime();

    return transactions.reduce((sum, tx) => {
      const txDate = tx.date.getTime();
      const isExpense = tx.type === 'expense';
      const isWithinDateRange = txDate >= budgetStartDate && txDate <= budgetEndDate;
      const isCategoryMatch = budget.categoryIds && (budget.categoryIds.length === 0 || budget.categoryIds.includes(tx.categoryId));

      if (isExpense && isWithinDateRange && isCategoryMatch) {
        return sum + Math.abs(tx.amount);
      }
      return sum;
    }, 0);
  }, [transactions]);

  const handleAddBudget = async () => {
    if (!budgetName || !budgetAmount || !startDate || !endDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const parsedAmount = parseFloat(budgetAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Erreur', 'Le montant du budget doit être un nombre positif.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('Erreur', 'La date de fin ne peut pas être antérieure à la date de début.');
      return;
    }

    try {
      const newBudget = new Budget(
        user.uid,
        budgetName,
        parsedAmount,
        startDate,
        endDate,
        frequency,
        '',
        selectedCategoryIds
      );
      await budgetService.addBudget(user.uid, newBudget);
      Alert.alert('Succès', 'Budget ajouté !');
      resetBudgetForm();
      setBudgetModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'ajout du budget: ' + error.message);
      console.error(error);
    }
  };

  const handleUpdateBudget = async () => {
    if (!currentBudget || !budgetName || !budgetAmount || !startDate || !endDate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const parsedAmount = parseFloat(budgetAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Erreur', 'Le montant du budget doit être un nombre positif.');
      return;
    }
    if (endDate < startDate) {
      Alert.alert('Erreur', 'La date de fin ne peut pas être antérieure à la date de début.');
      return;
    }

    try {
      await budgetService.updateBudget(user.uid, currentBudget.id, {
        name: budgetName,
        amount: parsedAmount,
        startDate: startDate,
        endDate: endDate,
        frequency: frequency,
        categoryIds: selectedCategoryIds,
      });
      Alert.alert('Succès', 'Budget mis à jour !');
      resetBudgetForm();
      setBudgetModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la mise à jour du budget: ' + error.message);
      console.error(error);
    }
  };

  const handleDeleteBudget = useCallback(async (budgetId) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce budget ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await budgetService.deleteBudget(user.uid, budgetId);
              Alert.alert('Succès', 'Budget supprimé !');
            } catch (error) {
              Alert.alert('Erreur', 'Échec de la suppression: ' + error.message);
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }, [user.uid]);

  const handleAddAccount = async () => {
    if (!accountName || !initialBalance) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    const parsedInitialBalance = parseFloat(initialBalance);
    if (isNaN(parsedInitialBalance)) {
      Alert.alert('Erreur', 'Le solde initial doit être un nombre valide.');
      return;
    }

    try {
      const newAccount = new Account(
        user.uid,
        accountName,
        accountType,
        parsedInitialBalance,
        '',
        new Date(),
        new Date(),
        parsedInitialBalance
      );
      await accountService.addAccount(user.uid, newAccount);
      Alert.alert('Succès', 'Compte ajouté !');
      resetAccountForm();
      setAccountModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'ajout du compte: ' + error.message);
      console.error(error);
    }
  };

  const handleUpdateAccount = async () => {
    if (!currentAccount || !accountName || !initialBalance) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    const parsedInitialBalance = parseFloat(initialBalance);
    if (isNaN(parsedInitialBalance)) {
      Alert.alert('Erreur', 'Le solde initial doit être un nombre valide.');
      return;
    }

    try {
      await accountService.updateAccount(user.uid, currentAccount.id, {
        name: accountName,
        type: accountType,
      });
      Alert.alert('Succès', 'Compte mis à jour !');
      resetAccountForm();
      setAccountModalVisible(false);
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la mise à jour du compte: ' + error.message);
      console.error(error);
    }
  };

  const handleDeleteAccount = useCallback(async (accountId) => {
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer ce compte ? Toutes les transactions liées pourraient être affectées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            try {
              await accountService.deleteAccount(user.uid, accountId);
              Alert.alert('Succès', 'Compte supprimé !');
            } catch (error) {
              Alert.alert('Erreur', 'Échec de la suppression: ' + error.message);
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  }, [user.uid]);

  const openEditBudgetModal = (budget) => {
    setCurrentBudget(budget);
    setBudgetName(budget.name);
    setBudgetAmount(budget.amount.toString());
    setStartDate(budget.startDate.toDate ? budget.startDate.toDate() : budget.startDate);
    setEndDate(budget.endDate.toDate ? budget.endDate.toDate() : budget.endDate);
    setFrequency(budget.frequency);
    setSelectedCategoryIds(budget.categoryIds || []);
    setEditMode(true);
    setBudgetModalVisible(true);
  };

  const openEditAccountModal = (account) => {
    setCurrentAccount(account);
    setAccountName(account.name);
    setAccountType(account.type);
    setInitialBalance(account.initialBalance.toString());
    setEditMode(true);
    setAccountModalVisible(true);
  };

  const resetBudgetForm = () => {
    setBudgetName('');
    setBudgetAmount('');
    setStartDate(new Date());
    setEndDate(new Date());
    setFrequency('monthly');
    setSelectedCategoryIds([]);
    setEditMode(false);
    setCurrentBudget(null);
  };

  const resetAccountForm = () => {
    setAccountName('');
    setAccountType('checking');
    setInitialBalance('');
    setEditMode(false);
    setCurrentAccount(null);
  };

  const onDateChange = (event, selectedDate, type) => {
    if (type === 'start') {
      setShowStartDatePicker(Platform.OS === 'ios');
      if (selectedDate) setStartDate(selectedDate);
    } else {
      setShowEndDatePicker(Platform.OS === 'ios');
      if (selectedDate) setEndDate(selectedDate);
    }
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Gestion Financière</Text>
        </View>
        <View style={styles.tabContainer}>
          <View style={[styles.tab, styles.activeTab]}>
            <Icon name="chart-pie" size={20} color={Colors.primary.main} />
            <Text style={[styles.tabText, styles.activeTabText]}>Budgets</Text>
          </View>
          <View style={styles.tab}>
            <Icon name="bank" size={20} color={Colors.text.secondary} />
            <Text style={styles.tabText}>Comptes</Text>
          </View>
        </View>
        <View style={{ marginTop: Spacing.lg }}>
          <SkeletonList count={4} variant="budget" />
        </View>
      </View>
    );
  }

  const renderBudgetContent = () => (
    <>
      {budgets.length === 0 ? (
        <EmptyState
          {...EmptyStatePresets.budgets}
          onAction={() => {
            resetBudgetForm();
            setBudgetModalVisible(true);
          }}
          style={{ paddingVertical: 60 }}
        />
      ) : (
        <FlatList
          data={budgets}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const spent = calculateSpent(item);
            const progress = (spent / item.amount) * 100;
            const remainingDays = Math.ceil((item.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const budgetStatus = remainingDays > 0 ? `${remainingDays} jours restants` : 'Terminé';
            const progressBarColor = progress > 100 ? Colors.error : Colors.success;
            const isOverBudget = progress > 100;

            return (
              <View style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => openEditBudgetModal(item)} style={styles.iconButton}>
                      <Icon name="pencil-outline" size={20} color={Colors.primary.main} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteBudget(item.id)} style={styles.iconButton}>
                      <Icon name="delete-outline" size={20} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.budgetPeriod}>{item.startDate.toLocaleDateString()} - {item.endDate.toLocaleDateString()}</Text>

                <View style={styles.budgetAmounts}>
                  <Text style={[styles.budgetAmountText, isOverBudget && styles.overBudgetAmount]}>
                    Dépensé: {formatCurrency(spent)}
                  </Text>
                  <Text style={styles.budgetAmountText}>
                    Budget: {formatCurrency(item.amount)}
                  </Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${Math.min(100, progress)}%`, backgroundColor: progressBarColor }]} />
                </View>
                <Text style={[styles.budgetStatusText, isOverBudget && styles.overBudgetStatusText]}>
                  {isOverBudget ? `Dépassement de ${formatCurrency(spent - item.amount)}` : budgetStatus}
                </Text>
                {item.categoryIds && item.categoryIds.length > 0 && (
                  <Text style={styles.budgetCategories}>
                    Catégories: {item.categoryIds.map(id => categories.find(c => c.id === id)?.name || 'Inconnu').join(', ')}
                  </Text>
                )}
              </View>
            );
          }}
        />
      )}
    </>
  );

  const renderAccountContent = () => (
    <>
      {accounts.length === 0 ? (
        <EmptyState
          {...EmptyStatePresets.accounts}
          onAction={() => {
            resetAccountForm();
            setAccountModalVisible(true);
          }}
          style={{ paddingVertical: 60 }}
        />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.accountItemContent}>
                <View style={styles.accountIconContainer}>
                  <Icon name={accountTypeIcons[item.type] || 'wallet'} size={24} color={Colors.text.inverse} />
                </View>
                <View style={styles.accountDetails}>
                  <Text style={styles.itemName}>{item.name} {item.isDefault ? '(Par défaut)' : ''}</Text>
                  <Text style={styles.accountType}>{item.type.replace('_', ' ').toUpperCase()}</Text>
                  <Text style={styles.accountBalance}>Solde: {formatCurrency(item.currentBalance)}</Text>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity onPress={() => openEditAccountModal(item)} style={styles.iconButton}>
                    <Icon name="pencil-outline" size={20} color={Colors.primary.main} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteAccount(item.id)} style={styles.iconButton}>
                    <Icon name="delete-outline" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Gestion Financière</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (activeTab === 'budgets') {
              setBudgetModalVisible(true);
              resetBudgetForm();
            } else {
              setAccountModalVisible(true);
              resetAccountForm();
            }
          }}
        >
          <Icon name="plus" size={20} color={Colors.text.inverse} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'budgets' && styles.activeTab]}
          onPress={() => setActiveTab('budgets')}
        >
          <Icon name="chart-pie" size={20} color={activeTab === 'budgets' ? Colors.primary.main : Colors.text.secondary} />
          <Text style={[styles.tabText, activeTab === 'budgets' && styles.activeTabText]}>Budgets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'accounts' && styles.activeTab]}
          onPress={() => setActiveTab('accounts')}
        >
          <Icon name="bank" size={20} color={activeTab === 'accounts' ? Colors.primary.main : Colors.text.secondary} />
          <Text style={[styles.tabText, activeTab === 'accounts' && styles.activeTabText]}>Comptes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary.main]}
            tintColor={Colors.primary.main}
          />
        }
      >
        {activeTab === 'budgets' ? renderBudgetContent() : renderAccountContent()}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Budget Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={budgetModalVisible}
        onRequestClose={() => {
          setBudgetModalVisible(!budgetModalVisible);
          resetBudgetForm();
        }}
      >
        <ScrollView contentContainerStyle={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editMode ? 'Modifier le Budget' : 'Créer un Budget'}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nom du budget (ex: Alimentation mensuelle)"
              placeholderTextColor={Colors.text.tertiary}
              value={budgetName}
              onChangeText={setBudgetName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Montant du budget (ex: 50000)"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
            />

            <Text style={styles.label}>Fréquence</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={frequency}
                style={styles.picker}
                onValueChange={(itemValue) => setFrequency(itemValue)}
              >
                <Picker.Item label="Mensuel" value="monthly" />
                <Picker.Item label="Hebdomadaire" value="weekly" />
                <Picker.Item label="Personnalisé" value="custom" />
              </Picker>
            </View>

            <Text style={styles.label}>Date de début</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{startDate.toLocaleDateString()}</Text>
              <Icon name="calendar-month-outline" size={20} color={Colors.primary.main} />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'start')}
              />
            )}

            <Text style={styles.label}>Date de fin</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>{endDate.toLocaleDateString()}</Text>
              <Icon name="calendar-month-outline" size={20} color={Colors.primary.main} />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => onDateChange(event, selectedDate, 'end')}
              />
            )}

            <Text style={styles.label}>Catégories concernées (Optionnel)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChipsScrollView}>
              <View style={styles.categorySelectionContainer}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryChip,
                      selectedCategoryIds.includes(cat.id) && styles.selectedCategoryChip,
                      { backgroundColor: selectedCategoryIds.includes(cat.id) ? (cat.color || Colors.primary.main) : Colors.neutral[200] }
                    ]}
                    onPress={() => toggleCategorySelection(cat.id)}
                  >
                    <Text style={[styles.categoryChipText, selectedCategoryIds.includes(cat.id) && styles.selectedCategoryChipText]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={editMode ? handleUpdateBudget : handleAddBudget}
            >
              <Text style={styles.modalActionButtonText}>{editMode ? 'Mettre à Jour le Budget' : 'Créer le Budget'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalActionButton, styles.modalCancelButton]}
              onPress={() => { setBudgetModalVisible(false); resetBudgetForm(); }}
            >
              <Text style={styles.modalCancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={accountModalVisible}
        onRequestClose={() => {
          setAccountModalVisible(!accountModalVisible);
          resetAccountForm();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editMode ? 'Modifier le Compte' : 'Ajouter un Compte'}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nom du compte (ex: Compte Courant)"
              placeholderTextColor={Colors.text.tertiary}
              value={accountName}
              onChangeText={setAccountName}
            />

            <Text style={styles.label}>Type de compte</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={accountType}
                style={styles.picker}
                onValueChange={(itemValue) => setAccountType(itemValue)}
              >
                <Picker.Item label="Courant" value="checking" />
                <Picker.Item label="Épargne" value="savings" />
                <Picker.Item label="Cash" value="cash" />
                <Picker.Item label="Carte de Crédit" value="credit_card" />
                <Picker.Item label="Investissement" value="investment" />
                <Picker.Item label="Autre" value="other" />
              </Picker>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Solde Initial"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
              value={initialBalance}
              onChangeText={setInitialBalance}
              editable={!editMode}
            />

            <TouchableOpacity
              style={styles.modalActionButton}
              onPress={editMode ? handleUpdateAccount : handleAddAccount}
            >
              <Text style={styles.modalActionButtonText}>{editMode ? 'Mettre à Jour' : 'Ajouter'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalActionButton, styles.modalCancelButton]}
              onPress={() => { setAccountModalVisible(false); resetAccountForm(); }}
            >
              <Text style={styles.modalCancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.xl + Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  addButtonText: {
    ...Typography.bodyBold,
    color: Colors.text.inverse,
    marginLeft: Spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    marginHorizontal: Spacing.xs,
  },
  activeTab: {
    backgroundColor: Colors.primary.subtle,
  },
  tabText: {
    ...Typography.body,
    marginLeft: Spacing.sm,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary.main,
    fontWeight: '600',
  },
  scrollViewContent: {
    flex: 1,
    marginTop: Spacing.sm,
  },
  itemCard: {
    backgroundColor: Colors.background.card,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    ...Shadows.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  itemName: {
    ...Typography.bodyBold,
    color: Colors.text.primary,
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: Spacing.sm,
    padding: Spacing.xs,
  },
  // Budget specific styles
  budgetPeriod: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  budgetAmountText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  overBudgetAmount: {
    color: Colors.error,
  },
  progressContainer: {
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: Radius.xs,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: Radius.xs,
  },
  budgetStatusText: {
    ...Typography.small,
    color: Colors.text.secondary,
    textAlign: 'right',
  },
  overBudgetStatusText: {
    color: Colors.error,
    fontWeight: '600',
  },
  budgetCategories: {
    ...Typography.small,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  // Account specific styles
  accountItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  accountDetails: {
    flex: 1,
  },
  accountType: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  accountBalance: {
    ...Typography.bodyBold,
    color: Colors.success,
    marginTop: Spacing.xs,
  },
  // Modal styles
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    width: '90%',
    maxHeight: '90%',
    ...Shadows.lg,
  },
  modalTitle: {
    ...Typography.h2,
    marginBottom: Spacing.lg,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: Radius.sm,
    ...Typography.body,
    color: Colors.text.primary,
    backgroundColor: Colors.background.input,
  },
  label: {
    ...Typography.bodyBold,
    marginBottom: Spacing.sm,
    color: Colors.text.secondary,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    backgroundColor: Colors.background.input,
  },
  picker: {
    width: '100%',
    color: Colors.text.primary,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.input,
  },
  datePickerText: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  categoryChipsScrollView: {
    maxHeight: 100,
    marginBottom: Spacing.md,
  },
  categorySelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  categoryChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    margin: Spacing.xs,
  },
  selectedCategoryChip: {},
  categoryChipText: {
    ...Typography.caption,
    color: Colors.text.primary,
  },
  selectedCategoryChipText: {
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  modalActionButton: {
    backgroundColor: Colors.primary.main,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.sm,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  modalActionButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  modalCancelButtonText: {
    ...Typography.button,
    color: Colors.error,
  },
});

export default BudgetsScreen;
