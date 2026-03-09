/**
 * SendMoneyScreen
 * Interface for sending money to contacts
 * @module screens/QuickActions/SendMoneyScreen
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

function SendMoneyScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [sending, setSending] = useState(false);

  const recentContacts = [
    { id: '1', name: 'John Doe', avatar: 'account', phone: '+1234567890' },
    { id: '2', name: 'Jane Smith', avatar: 'account', phone: '+0987654321' },
    { id: '3', name: 'Mike Johnson', avatar: 'account', phone: '+1122334455' },
  ];

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setRecipient(contact.phone);
  };

  const handleSend = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (!recipient) {
      Alert.alert('Missing Recipient', 'Please select or enter a recipient.');
      return;
    }

    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      Alert.alert(
        'Success',
        `Successfully sent ${amount} XOF to ${selectedContact?.name || recipient}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0D9488', '#14B8A6']}
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
          <Text style={styles.headerTitle}>Send Money</Text>
          <Text style={styles.headerSubtitle}>Transfer funds to anyone</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.amountSection}>
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

        {/* Recent Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Contacts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contactsScroll}
          >
            {recentContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactCard,
                  selectedContact?.id === contact.id && styles.contactCardSelected,
                ]}
                onPress={() => handleSelectContact(contact)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.contactAvatar,
                    selectedContact?.id === contact.id && styles.contactAvatarSelected,
                  ]}
                >
                  <Icon
                    name={contact.avatar}
                    size={28}
                    color={
                      selectedContact?.id === contact.id
                        ? Colors.primary.main
                        : Colors.text.secondary
                    }
                  />
                </View>
                <Text style={styles.contactName} numberOfLines={1}>
                  {contact.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recipient Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recipient Phone Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Note (Optional)</Text>
          <View style={styles.inputContainer}>
            <Icon
              name="note-text-outline"
              size={20}
              color={Colors.text.tertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </View>

        {/* Payment Methods */}
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

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={sending}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={sending ? ['#94A3B8', '#94A3B8'] : ['#0D9488', '#14B8A6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendButtonGradient}
          >
            {sending ? (
              <LoadingSpinner size="small" color={Colors.text.inverse} />
            ) : (
              <>
                <Icon name="send" size={20} color={Colors.text.inverse} />
                <Text style={styles.sendButtonText}>Send Money</Text>
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
  amountSection: {
    backgroundColor: Colors.background.card,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.text.primary,
    padding: 0,
    minWidth: 150,
    textAlign: 'center',
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
  contactsScroll: {
    gap: Spacing.md,
  },
  contactCard: {
    alignItems: 'center',
    width: 80,
  },
  contactCardSelected: {
    // Selected state handled by avatar
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contactAvatarSelected: {
    backgroundColor: Colors.primary.subtle,
    borderColor: Colors.primary.main,
  },
  contactName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
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
  sendButton: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    height: 52,
    ...Shadows.md,
    elevation: 6,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: '100%',
    paddingHorizontal: Spacing.lg,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

export default SendMoneyScreen;
