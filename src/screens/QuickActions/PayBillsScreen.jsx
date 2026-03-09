/**
 * PayBillsScreen
 * Interface for paying bills and utilities
 * @module screens/QuickActions/PayBillsScreen
 */
import React, { useState } from 'react';
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
import { LoadingSpinner } from '../../components';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

function PayBillsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);

  const billCategories = [
    { id: 'electricity', name: 'Electricity', icon: 'lightning-bolt', color: '#F59E0B' },
    { id: 'water', name: 'Water', icon: 'water', color: '#3B82F6' },
    { id: 'internet', name: 'Internet', icon: 'wifi', color: '#8B5CF6' },
    { id: 'phone', name: 'Phone', icon: 'phone', color: '#10B981' },
    { id: 'gas', name: 'Gas', icon: 'fire', color: '#EF4444' },
    { id: 'tv', name: 'TV/Cable', icon: 'television', color: '#EC4899' },
  ];

  const recentBills = [
    {
      id: '1',
      category: 'electricity',
      provider: 'City Electric Co.',
      billNumber: 'ELEC-123456',
      amount: 15000,
      dueDate: '2024-03-15',
    },
    {
      id: '2',
      category: 'internet',
      provider: 'FastNet ISP',
      billNumber: 'NET-789012',
      amount: 8500,
      dueDate: '2024-03-20',
    },
  ];

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handlePayBill = async () => {
    if (!selectedCategory) {
      Alert.alert('Select Category', 'Please select a bill category.');
      return;
    }

    if (!billNumber) {
      Alert.alert('Missing Bill Number', 'Please enter your bill number.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    setPaying(true);
    // Simulate API call
    setTimeout(() => {
      setPaying(false);
      Alert.alert(
        'Success',
        `Successfully paid ${amount} XOF for ${selectedCategory.name} bill`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const handleQuickPay = (bill) => {
    const category = billCategories.find((c) => c.id === bill.category);
    setSelectedCategory(category);
    setBillNumber(bill.billNumber);
    setAmount(bill.amount.toString());
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
          <Text style={styles.headerTitle}>Pay Bills</Text>
          <Text style={styles.headerSubtitle}>Quick bill payment</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bill Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Category</Text>
          <View style={styles.categoriesGrid}>
            {billCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory?.id === category.id && styles.categoryCardSelected,
                ]}
                onPress={() => handleSelectCategory(category)}
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
                    styles.categoryName,
                    selectedCategory?.id === category.id && styles.categoryNameSelected,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Bills */}
        {recentBills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Bills</Text>
            {recentBills.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                style={styles.billCard}
                onPress={() => handleQuickPay(bill)}
                activeOpacity={0.7}
              >
                <View style={styles.billLeft}>
                  <View
                    style={[
                      styles.billIcon,
                      {
                        backgroundColor: `${
                          billCategories.find((c) => c.id === bill.category)?.color
                        }15`,
                      },
                    ]}
                  >
                    <Icon
                      name={billCategories.find((c) => c.id === bill.category)?.icon || 'receipt'}
                      size={24}
                      color={billCategories.find((c) => c.id === bill.category)?.color}
                    />
                  </View>
                  <View style={styles.billInfo}>
                    <Text style={styles.billProvider}>{bill.provider}</Text>
                    <Text style={styles.billNumber}>{bill.billNumber}</Text>
                    <Text style={styles.billDueDate}>Due: {bill.dueDate}</Text>
                  </View>
                </View>
                <Text style={styles.billAmount}>{bill.amount.toLocaleString()} XOF</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bill Details Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bill Number</Text>
            <View style={styles.inputContainer}>
              <Icon name="receipt" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={billNumber}
                onChangeText={setBillNumber}
                placeholder="Enter bill number"
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.inputContainer}>
              <Icon name="cash" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="numeric"
              />
              <Text style={styles.inputCurrency}>XOF</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentMethod} activeOpacity={0.7}>
            <View style={styles.paymentMethodLeft}>
              <View style={styles.paymentIcon}>
                <Icon name="wallet" size={24} color={Colors.primary.main} />
              </View>
              <View>
                <Text style={styles.paymentMethodTitle}>Main Wallet</Text>
                <Text style={styles.paymentMethodBalance}>Balance: 50,000 XOF</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payButton, paying && styles.payButtonDisabled]}
          onPress={handlePayBill}
          disabled={paying}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={paying ? ['#94A3B8', '#94A3B8'] : ['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payButtonGradient}
          >
            {paying ? (
              <LoadingSpinner size="small" color={Colors.text.inverse} />
            ) : (
              <>
                <Icon name="check-circle" size={20} color={Colors.text.inverse} />
                <Text style={styles.payButtonText}>Pay Bill</Text>
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
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  categoryCard: {
    width: '30%',
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
    width: 56,
    height: 56,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: Colors.primary.main,
    fontWeight: '700',
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  billIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  billInfo: {
    flex: 1,
  },
  billProvider: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  billNumber: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  billDueDate: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '500',
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
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
  inputCurrency: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
  paymentMethod: {
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
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary.subtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  paymentMethodBalance: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  payButton: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    height: 52,
    ...Shadows.md,
    elevation: 6,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: '100%',
    paddingHorizontal: Spacing.lg,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

export default PayBillsScreen;
