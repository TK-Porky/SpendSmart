// src/screens/Main/TransactionsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import TransactionHeader from '../../components/TransactionHeader';
import TabSelector from '../../components/TabSelector';
import TransactionCard from '../../components/TransactionCard';
import { SkeletonList, EmptyState, EmptyStatePresets, LoadingSpinner } from '../../components';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

import { transactionService } from '../../services/TransactionService';
import { balanceService } from '../../services/BalanceService';
import { accountService } from '../../services/AccountService';
import { categoryService } from '../../services/CategoryService';
import Transaction from '../../models/Transaction';

function TransactionsScreen({ navigation }) {
  const [user, setUser] = useState(auth().currentUser);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [budgetStatusMessage, setBudgetStatusMessage] = useState("Pas de déficit budgétaire");
  const [isBudgetDeficit, setIsBudgetDeficit] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // États pour les données du formulaire
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formLoading, setFormLoading] = useState(true);

  // États pour le formulaire d'ajout (basés sur le formulaire original)
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    detail: '',
    type: 'expense', // 'expense', 'income', 'transfer'
    selectedCategory: '',
    selectedAccount: '',
    transferToAccount: '',
    date: new Date()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchTransactionData = useCallback(async (uid) => {
    setLoading(true);
    try {
      setBudgetStatusMessage("Vous êtes en déficit budgétaire");
      setIsBudgetDeficit(true);
      const allTransactions = await transactionService.getTransactions(uid);
      const balance = await balanceService.getBalanceSummary(user.uid);
      setCurrentBalance(balance.currentBalance);
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Erreur lors du chargement des données de TransactionsScreen:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.uid]);

  // Chargement des données pour le formulaire
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribeAccounts = accountService.listenToAccounts(user.uid, (accs) => {
      setAccounts(accs);
      if (accs.length > 0 && !formData.selectedAccount) {
        setFormData(prev => ({
          ...prev,
          selectedAccount: accs[0].id
        }));
      }
      if (accs.length > 1 && !formData.transferToAccount) {
        setFormData(prev => ({
          ...prev,
          transferToAccount: accs[1].id || accs[0].id
        }));
      }
      setFormLoading(false);
    });

    const unsubscribeCategories = categoryService.listenToAllCategories(user.uid, (cats) => {
      setCategories(cats);
      if (cats.length > 0 && !formData.selectedCategory) {
        const defaultExpenseCat = cats.find(c => c.type === 'expense');
        setFormData(prev => ({
          ...prev,
          selectedCategory: defaultExpenseCat ? defaultExpenseCat.id : cats[0].id
        }));
      }
      setFormLoading(false);
    });

    return () => {
      unsubscribeAccounts();
      unsubscribeCategories();
    };
  }, [formData.selectedAccount, formData.selectedCategory, formData.transferToAccount, user.uid]);

  useEffect(() => {
    if (user) {
      fetchTransactionData(user.uid);
    }
  }, [user, fetchTransactionData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (user) {
      fetchTransactionData(user.uid);
    } else {
      setRefreshing(false);
    }
  }, [user, fetchTransactionData]);

  const handleSelectTransaction = (transaction) => {
    console.log("Transaction sélectionnée:", transaction.id);
    navigation.navigate('TransactionDetail', { transactionId: transaction.id });
  };

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    console.log(`Onglet sélectionné: ${tab}`);
    
    if (tab === 'add') {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      description: '',
      detail: '',
      type: 'expense',
      selectedCategory: categories.find(c => c.type === 'expense')?.id || '',
      selectedAccount: accounts.length > 0 ? accounts[0].id : '',
      transferToAccount: accounts.length > 1 ? accounts[1].id : '',
      date: new Date()
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion du changement de type de transaction
  const handleTypeChange = (newType) => {
    setFormData(prev => {
      const updates = { type: newType };
      
      if (newType !== 'transfer') {
        const defaultCat = categories.find(c => c.type === newType);
        updates.selectedCategory = defaultCat ? defaultCat.id : '';
      } else {
        updates.selectedCategory = '';
      }
      
      return { ...prev, ...updates };
    });
  };

  const getFilteredCategories = useCallback(() => {
    return categories.filter(cat => cat.type === formData.type);
  }, [categories, formData.type]);

  // Gestion de la date
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(Platform.OS === 'ios');
    setFormData(prev => ({ ...prev, date: currentDate }));
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const validateForm = () => {
    if (!formData.amount || !formData.description || !formData.selectedAccount) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le montant, la description et sélectionner un compte.');
      return false;
    }
    
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Erreur', 'Le montant doit être un nombre positif.');
      return false;
    }

    if (formData.type === 'transfer') {
      if (!formData.transferToAccount || formData.selectedAccount === formData.transferToAccount) {
        Alert.alert('Erreur', 'Veuillez sélectionner un compte de destination différent pour le transfert.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmitTransaction = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const parsedAmount = parseFloat(formData.amount);
      let finalAmount = parsedAmount;
      
      if (formData.type === 'expense') {
        finalAmount = -parsedAmount; // Les dépenses sont négatives
      } else if (formData.type === 'transfer') {
        finalAmount = -parsedAmount; // Le transfert sort du compte sélectionné
      }

      const newTransaction = new Transaction(
        user.uid,
        formData.selectedAccount,
        finalAmount,
        formData.description,
        formData.type,
        formData.type !== 'transfer' ? formData.selectedCategory : null,
        formData.date,
        '', // ID vide, Firestore le générera
        formData.detail,
        formData.type === 'transfer' ? formData.transferToAccount : ''
      );

      await transactionService.addTransaction(user.uid, newTransaction);
      
      Alert.alert(
        'Succès', 
        'Transaction ajoutée avec succès !',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              setActiveTab('transactions');
              fetchTransactionData(user.uid);
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
      Alert.alert('Erreur', 'Échec de l\'ajout de la transaction: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTransactionForm = () => {
    if (formLoading) {
      return (
        <LoadingSpinner message="Chargement des données..." />
      );
    }

    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Ajouter une Nouvelle Transaction</Text>
        
        {/* Type de transaction */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Type de transaction</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.type}
              style={styles.picker}
              onValueChange={handleTypeChange}
            >
              <Picker.Item label="Dépense" value="expense" />
              <Picker.Item label="Revenu" value="income" />
              <Picker.Item label="Transfert" value="transfer" />
            </Picker>
          </View>
        </View>

        {/* Montant */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Montant *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: 50000"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(value) => handleInputChange('amount', value)}
          />
        </View>

        {/* Compte */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Compte *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.selectedAccount}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('selectedAccount', value)}
            >
              {accounts.map(account => (
                <Picker.Item key={account.id} label={account.name} value={account.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Compte de destination pour transfert */}
        {formData.type === 'transfer' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vers le compte *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.transferToAccount}
                style={styles.picker}
                onValueChange={(value) => handleInputChange('transferToAccount', value)}
              >
                {accounts.filter(acc => acc.id !== formData.selectedAccount).map(account => (
                  <Picker.Item key={account.id} label={account.name} value={account.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Catégorie (sauf pour transfert) */}
        {formData.type !== 'transfer' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Catégorie *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.selectedCategory}
                style={styles.picker}
                onValueChange={(value) => handleInputChange('selectedCategory', value)}
              >
                {getFilteredCategories().map(cat => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Achat de courses, Salaire du mois"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
          />
        </View>

        {/* Détail */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Détail (Optionnel)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Carrefour, Paiement de Victoire"
            value={formData.detail}
            onChangeText={(value) => handleInputChange('detail', value)}
          />
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
            <Text style={styles.dateText}>{formData.date.toLocaleDateString()}</Text>
            <Icon name="calendar" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={formData.date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>

        {/* Boutons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, styles.primaryButton]}
            onPress={handleSubmitTransaction}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.submitButtonText}>Ajouter la Transaction</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.submitButton, styles.secondaryButton]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={styles.secondaryButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TransactionHeader
        currentBalance={currentBalance}
        currency="XOF"
        statusMessage={'Attention aux dépenses abusives'}
        isBudgetDeficit={isBudgetDeficit}
      />

      <TabSelector
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'historiques' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Historique des transactions</Text>
            {loading ? (
              <SkeletonList count={6} variant="transaction" />
            ) : transactions.length > 0 ? (
              <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TransactionCard
                    transaction={item}
                    onPress={handleSelectTransaction}
                  />
                )}
                scrollEnabled={false}
              />
            ) : (
              <EmptyState
                {...EmptyStatePresets.transactions}
                onAction={() => setActiveTab('transaction')}
                style={{ paddingVertical: 40 }}
              />
            )}
          </View>
        )}

        {activeTab === 'transaction' && renderTransactionForm()}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollViewContent: {
    flex: 1,
    marginTop: Spacing.lg,
  },
  sectionContainer: {
    paddingBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  loadingIndicator: {
    marginTop: Spacing.xl + Spacing.lg,
  },
  noDataCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    alignItems: 'center',
    ...Shadows.sm,
  },
  noDataText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.text.secondary,
  },

  // Form styles
  formContainer: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  formTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl + Spacing.lg,
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.sm,
    color: Colors.text.secondary,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.bodyBold,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  textInput: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pickerContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: Colors.background.card,
    height: 50,
    color: Colors.text.primary,
  },
  datePickerButton: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  dateText: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  submitButton: {
    borderRadius: Radius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  submitButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  secondaryButtonText: {
    ...Typography.button,
    color: Colors.error,
  },
});

export default TransactionsScreen;

/*
SUGGESTIONS D'AMÉLIORATIONS :

1. **Validation en temps réel** :
   - Ajouter une validation visuelle des champs pendant la saisie
   - Indicateurs de champ requis plus visibles

2. **UX améliorées** :
   - Auto-complétion pour les descriptions courantes
   - Sauvegarde automatique en brouillon
   - Raccourcis pour les transactions fréquentes

3. **Gestion des erreurs** :
   - Messages d'erreur plus spécifiques
   - Retry automatique en cas d'échec réseau
   - Mode hors-ligne avec synchronisation

4. **Fonctionnalités avancées** :
   - Support des devises multiples
   - Géolocalisation automatique
   - Photos de reçus
   - Transactions récurrentes

5. **Performance** :
   - Pagination pour l'historique
   - Cache des catégories et comptes
   - Optimisation des re-renders

6. **Accessibilité** :
   - Labels accessibles
   - Support clavier
   - Contraste amélioré

7. **Analytics** :
   - Tracking des types de transactions les plus utilisés
   - Temps moyen de saisie
   - Taux d'erreur de validation
*/