/**
 * CreditCard Component
 * Displays a modern credit card with balance and card details
 * @module components/CreditCard
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Shadows } from '../constants';
import { formatCurrency } from '../utils';

/**
 * CreditCard Component
 * @param {Object} props
 * @param {number} props.balance - Current balance
 * @param {string} props.cardNumber - Card number (will be masked)
 * @param {string} props.cardHolder - Cardholder name
 * @param {string} props.expiryDate - Card expiry date (MM/YY)
 * @param {string} props.currency - Currency code
 * @param {string} props.cardType - Card type (visa, mastercard, etc.)
 * @param {function} props.onPress - Callback when card is pressed
 */
const CreditCard = ({
  balance = 0,
  cardNumber = '**** **** **** 4862',
  cardHolder = 'CARD HOLDER',
  expiryDate = '12/26',
  currency = 'XOF',
  cardType = 'visa',
  onPress,
}) => {
  const maskCardNumber = (number) => {
    if (!number) return '**** **** **** ****';
    const cleaned = number.replace(/\s/g, '');
    const lastFour = cleaned.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  const getCardIcon = () => {
    switch (cardType.toLowerCase()) {
      case 'visa':
        return 'credit-card';
      case 'mastercard':
        return 'credit-card';
      case 'amex':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#0D9488', '#14B8A6', '#2DD4BF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.chipContainer}>
            <View style={styles.chip}>
              <View style={styles.chipInner} />
            </View>
          </View>
          <Icon name={getCardIcon()} size={40} color="rgba(255, 255, 255, 0.9)" />
        </View>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance, currency)}</Text>
        </View>

        {/* Card Details */}
        <View style={styles.cardFooter}>
          <View style={styles.cardInfoRow}>
            <View style={styles.cardInfoItem}>
              <Text style={styles.cardInfoLabel}>CARD HOLDER</Text>
              <Text style={styles.cardInfoValue}>{cardHolder.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    minHeight: 200,
    ...Shadows.lg,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  chipContainer: {
    width: 50,
    height: 40,
  },
  chip: {
    width: 50,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: 40,
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 0, 0.3)',
  },
  balanceSection: {
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.inverse,
    letterSpacing: 1,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  cardNumberSection: {
    marginBottom: Spacing.md,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.inverse,
    letterSpacing: 2,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfoItem: {
    flex: 1,
  },
  cardInfoLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.inverse,
    letterSpacing: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -30,
    left: -30,
  },
});

export default CreditCard;
