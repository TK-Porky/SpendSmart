/**
 * Transaction Detail Screen
 * View and manage a single transaction
 * @module screens/Details/TransactionDetailScreen
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../constants';
import { formatCurrency, formatDate } from '../../utils';
import { transactionService } from '../../services/TransactionService';
import { categoryService } from '../../services/CategoryService';
import { accountService } from '../../services/AccountService';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const TransactionDetailScreen = ({ route, navigation }) => {
  const { transactionId, transaction: initialTransaction } = route.params || {};
  const { showToast } = useToast();

  const [transaction, setTransaction] = useState(initialTransaction || null);
  const [category, setCategory] = useState(null);
  const [account, setAccount] = useState(null);
  const [transferAccount, setTransferAccount] = useState(null);
  const [loading, setLoading] = useState(!initialTransaction);
  const [deleting, setDeleting] = useState(false);

  const user = auth().currentUser;

  // Load transaction data
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!user) return;

        try {
          // Load categories and accounts
          const [categories, accounts] = await Promise.all([
            categoryService.getAllCategories(user.uid),
            accountService.getAccounts(user.uid),
          ]);

          // Find the category for this transaction
          if (transaction?.category) {
            const cat = categories.find(c => c.id === transaction.category);
            setCategory(cat);
          }

          // Find the account
          if (transaction?.accountId) {
            const acc = accounts.find(a => a.id === transaction.accountId);
            setAccount(acc);
          }

          // Find transfer destination account
          if (transaction?.transferToAccountId) {
            const transferAcc = accounts.find(a => a.id === transaction.transferToAccountId);
            setTransferAccount(transferAcc);
          }
        } catch (error) {
          console.error('Error loading transaction details:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [user, transaction])
  );

  // Get transaction type display info
  const getTypeInfo = (type) => {
    switch (type) {
      case 'income':
        return { label: 'Revenu', color: Colors.success, icon: 'arrow-down' };
      case 'expense':
        return { label: 'Depense', color: Colors.error, icon: 'arrow-up' };
      case 'transfer':
        return { label: 'Transfert', color: Colors.primary.main, icon: 'swap-horizontal' };
      default:
        return { label: 'Transaction', color: Colors.neutral[500], icon: 'cash' };
    }
  };

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Supprimer la transaction',
      'Etes-vous sur de vouloir supprimer cette transaction ? Cette action est irreversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await transactionService.deleteTransaction(user.uid, transaction.id);
              showToast('Transaction supprimee', 'success');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting transaction:', error);
              showToast('Erreur lors de la suppression', 'error');
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Handle edit navigation
  const handleEdit = () => {
    navigation.navigate('EditTransaction', { transaction });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={64} color={Colors.neutral[400]} />
        <Text style={styles.errorText}>Transaction non trouvee</Text>
        <Button
          title="Retour"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const typeInfo = getTypeInfo(transaction.type);
  const isExpense = transaction.type === 'expense';
  const isTransfer = transaction.type === 'transfer';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Icon name="arrow-left" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          disabled={deleting}
          accessibilityRole="button"
          accessibilityLabel="Supprimer la transaction"
        >
          {deleting ? (
            <ActivityIndicator size="small" color={Colors.error} />
          ) : (
            <Icon name="trash-can-outline" size={24} color={Colors.error} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={[styles.typeIcon, { backgroundColor: `${typeInfo.color}15` }]}>
            <Icon name={typeInfo.icon} size={28} color={typeInfo.color} />
          </View>
          <Text style={[styles.amount, { color: typeInfo.color }]}>
            {isExpense ? '-' : isTransfer ? '' : '+'}
            {formatCurrency(Math.abs(transaction.amount), 'XOF')}
          </Text>
          <View style={[styles.typeBadge, { backgroundColor: `${typeInfo.color}15` }]}>
            <Text style={[styles.typeBadgeText, { color: typeInfo.color }]}>
              {typeInfo.label}
            </Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Description */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="text" size={20} color={Colors.neutral[500]} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{transaction.description}</Text>
            </View>
          </View>

          {/* Detail (memo) */}
          {transaction.detail ? (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="note-text-outline" size={20} color={Colors.neutral[500]} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Note</Text>
                <Text style={styles.detailValue}>{transaction.detail}</Text>
              </View>
            </View>
          ) : null}

          {/* Category */}
          {category && (
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: `${category.color}20` }]}>
                <Icon name={category.icon} size={20} color={category.color} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Categorie</Text>
                <Text style={styles.detailValue}>{category.name}</Text>
              </View>
            </View>
          )}

          {/* Account */}
          {account && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="wallet-outline" size={20} color={Colors.neutral[500]} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  {isTransfer ? 'Compte source' : 'Compte'}
                </Text>
                <Text style={styles.detailValue}>{account.name}</Text>
              </View>
            </View>
          )}

          {/* Transfer destination */}
          {isTransfer && transferAccount && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Icon name="wallet-plus-outline" size={20} color={Colors.primary.main} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Compte destination</Text>
                <Text style={styles.detailValue}>{transferAccount.name}</Text>
              </View>
            </View>
          )}

          {/* Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="calendar" size={20} color={Colors.neutral[500]} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {formatDate(transaction.date, 'full')}
              </Text>
            </View>
          </View>

          {/* Transaction ID */}
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="identifier" size={20} color={Colors.neutral[500]} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>ID Transaction</Text>
              <Text style={[styles.detailValue, styles.idText]}>{transaction.id}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Button */}
      <View style={styles.footer}>
        <Button
          title="Modifier"
          variant="primary"
          size="lg"
          fullWidth
          leftIcon="pencil"
          onPress={handleEdit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  errorText: {
    ...Typography.h3,
    color: Colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  deleteButton: {
    padding: Spacing.sm,
    marginRight: -Spacing.sm,
  },
  content: {
    flex: 1,
  },
  amountCard: {
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  typeBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: Radius.lg,
    ...Shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  idText: {
    ...Typography.small,
    fontFamily: 'monospace',
    color: Colors.neutral[500],
  },
  footer: {
    padding: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
});

export default TransactionDetailScreen;
