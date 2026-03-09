/**
 * ReceiveMoneyScreen
 * Interface for receiving money with QR code and payment details
 * @module screens/QuickActions/ReceiveMoneyScreen
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
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

function ReceiveMoneyScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const paymentDetails = {
    accountNumber: '**** **** 1234',
    phoneNumber: '+1 234 567 890',
    email: 'user@spendsmart.app',
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Send me money via SpendSmart\nPhone: ${paymentDetails.phoneNumber}\nEmail: ${paymentDetails.email}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyToClipboard = (text, label) => {
    // In a real app, use Clipboard API
    console.log('Copied:', text);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
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
          <Text style={styles.headerTitle}>Receive Money</Text>
          <Text style={styles.headerSubtitle}>Share your payment details</Text>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.7}>
          <Icon name="share-variant" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <Icon name="qrcode" size={150} color={Colors.text.tertiary} />
            </View>
            <Text style={styles.qrLabel}>Scan to pay</Text>
          </View>
        </View>

        {/* Amount Section (Optional) */}
        <View style={styles.amountSection}>
          <Text style={styles.sectionLabel}>Request Amount (Optional)</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>XOF</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="numeric"
            />
          </View>
          {amount && (
            <Text style={styles.amountNote}>
              Requesting {amount} XOF from sender
            </Text>
          )}
        </View>

        {/* Note Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Note (Optional)</Text>
          <View style={styles.noteContainer}>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note for the sender..."
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Icon name="credit-card-outline" size={24} color={Colors.text.secondary} />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Account Number</Text>
                  <Text style={styles.detailValue}>{paymentDetails.accountNumber}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopyToClipboard(paymentDetails.accountNumber, 'Account')}
                activeOpacity={0.7}
              >
                <Icon name="content-copy" size={18} color={Colors.primary.main} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Icon name="phone-outline" size={24} color={Colors.text.secondary} />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Phone Number</Text>
                  <Text style={styles.detailValue}>{paymentDetails.phoneNumber}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopyToClipboard(paymentDetails.phoneNumber, 'Phone')}
                activeOpacity={0.7}
              >
                <Icon name="content-copy" size={18} color={Colors.primary.main} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Icon name="email-outline" size={24} color={Colors.text.secondary} />
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{paymentDetails.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => handleCopyToClipboard(paymentDetails.email, 'Email')}
                activeOpacity={0.7}
              >
                <Icon name="content-copy" size={18} color={Colors.primary.main} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Share Button */}
        <TouchableOpacity style={styles.mainShareButton} onPress={handleShare} activeOpacity={0.9}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareButtonGradient}
          >
            <Icon name="share-variant" size={20} color={Colors.text.inverse} />
            <Text style={styles.shareButtonText}>Share Payment Details</Text>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  qrSection: {
    backgroundColor: Colors.background.card,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.background.secondary,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
  },
  qrLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  amountSection: {
    backgroundColor: Colors.background.card,
    paddingVertical: Spacing.lg,
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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginRight: Spacing.sm,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text.primary,
    padding: 0,
    minWidth: 120,
    textAlign: 'center',
  },
  amountNote: {
    fontSize: 13,
    color: Colors.success,
    textAlign: 'center',
    marginTop: Spacing.sm,
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
  noteContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  noteInput: {
    fontSize: 15,
    color: Colors.text.primary,
    minHeight: 80,
    padding: 0,
  },
  detailCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  copyButton: {
    padding: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.xs,
  },
  mainShareButton: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    height: 52,
    ...Shadows.md,
    elevation: 6,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: '100%',
    paddingHorizontal: Spacing.lg,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.inverse,
  },
  bottomSpacer: {
    height: Spacing.xl,
  },
});

export default ReceiveMoneyScreen;
