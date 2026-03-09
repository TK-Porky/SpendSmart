/**
 * CurrencyLanguageScreen
 * Currency and language preferences
 * @module screens/Settings/CurrencyLanguageScreen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, Radius, Shadows } from '../../constants';

const CURRENCIES = [
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'XOF', flag: '🇸🇳' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
];

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof', flag: '🇸🇳' },
];

function CurrencyLanguageScreen({ navigation }) {
  const [selectedCurrency, setSelectedCurrency] = useState('XOF');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showCurrencySymbol, setShowCurrencySymbol] = useState(true);

  const handleSave = () => {
    // TODO: Save to AsyncStorage or user preferences
    Alert.alert('Success', 'Settings saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const ToggleSwitch = ({ value, onValueChange }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleActive]}
      onPress={onValueChange}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );

  const CurrencyItem = ({ currency, isSelected, onSelect }) => (
    <TouchableOpacity
      style={[styles.currencyItem, isSelected && styles.currencyItemSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={styles.currencyFlag}>{currency.flag}</Text>
      <View style={styles.currencyInfo}>
        <Text style={styles.currencyCode}>{currency.code}</Text>
        <Text style={styles.currencyName}>{currency.name}</Text>
      </View>
      <Text style={styles.currencySymbol}>{currency.symbol}</Text>
      {isSelected && (
        <View style={styles.checkmark}>
          <Icon name="check-circle" size={24} color={Colors.primary.main} />
        </View>
      )}
    </TouchableOpacity>
  );

  const LanguageItem = ({ language, isSelected, onSelect }) => (
    <TouchableOpacity
      style={[styles.languageItem, isSelected && styles.languageItemSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={styles.languageFlag}>{language.flag}</Text>
      <View style={styles.languageInfo}>
        <Text style={styles.languageName}>{language.name}</Text>
        <Text style={styles.languageNative}>{language.nativeName}</Text>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Icon name="check-circle" size={24} color={Colors.primary.main} />
        </View>
      )}
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Currency & Language</Text>
          <Text style={styles.headerSubtitle}>Regional preferences</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Currency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          <View style={styles.card}>
            {CURRENCIES.map((currency) => (
              <CurrencyItem
                key={currency.code}
                currency={currency}
                isSelected={selectedCurrency === currency.code}
                onSelect={() => setSelectedCurrency(currency.code)}
              />
            ))}
          </View>
        </View>

        {/* Currency Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency Display</Text>
          <View style={styles.card}>
            <View style={styles.displayItem}>
              <View style={styles.displayContent}>
                <Text style={styles.displayLabel}>Show Currency Symbol</Text>
                <Text style={styles.displayHint}>
                  {showCurrencySymbol
                    ? `Display as: ${CURRENCIES.find((c) => c.code === selectedCurrency)?.symbol} 1,000`
                    : 'Display as: 1,000 XOF'}
                </Text>
              </View>
              <ToggleSwitch
                value={showCurrencySymbol}
                onValueChange={setShowCurrencySymbol}
              />
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.card}>
            {LANGUAGES.map((language) => (
              <LanguageItem
                key={language.code}
                language={language}
                isSelected={selectedLanguage === language.code}
                onSelect={() => setSelectedLanguage(language.code)}
              />
            ))}
          </View>
          <Text style={styles.sectionHint}>App will restart to apply language changes</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            <Icon name="check" size={20} color={Colors.text.inverse} />
            <Text style={styles.saveButtonText}>Save Settings</Text>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  sectionHint: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  currencyItemSelected: {
    backgroundColor: Colors.primary.subtle,
  },
  currencyFlag: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.tertiary,
    marginRight: Spacing.sm,
  },
  checkmark: {
    marginLeft: Spacing.sm,
  },
  displayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  displayContent: {
    flex: 1,
  },
  displayLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  displayHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.border.light,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary.main,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.background.card,
    ...Shadows.sm,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  languageItemSelected: {
    backgroundColor: Colors.primary.subtle,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 13,
    color: Colors.text.secondary,
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

export default CurrencyLanguageScreen;
