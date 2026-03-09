/**
 * SecurityPrivacyScreen
 * Security and privacy settings
 * @module screens/Settings/SecurityPrivacyScreen
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

function SecurityPrivacyScreen({ navigation }) {
  const [security, setSecurity] = useState({
    // Security
    appLockEnabled: false,
    biometricEnabled: false,
    requirePinOnLaunch: false,
    autoLockTime: '1min',
    // Privacy
    hideBalances: false,
    hideSensitiveInfo: false,
    allowScreenshots: true,
    // Data
    shareAnalytics: false,
    shareUsageData: false,
  });

  const handleToggle = (key) => {
    setSecurity((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSetPIN = () => {
    Alert.alert('Set PIN', 'PIN setup will be available soon.', [{ text: 'OK' }]);
  };

  const handleChangePIN = () => {
    Alert.alert('Change PIN', 'PIN change will be available soon.', [{ text: 'OK' }]);
  };

  const handleSave = () => {
    // TODO: Save to AsyncStorage or user preferences
    Alert.alert('Success', 'Security settings saved!', [
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

  const SecurityItem = ({ icon, label, description, value, onToggle, iconColor, showDivider = true }) => (
    <>
      <View style={styles.securityItem}>
        <View style={[styles.securityIcon, { backgroundColor: `${iconColor}15` }]}>
          <Icon name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.securityContent}>
          <Text style={styles.securityLabel}>{label}</Text>
          {description && <Text style={styles.securityDescription}>{description}</Text>}
        </View>
        <ToggleSwitch value={value} onValueChange={onToggle} />
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );

  const MenuItem = ({ icon, label, onPress, iconColor, showChevron = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: `${iconColor}15` }]}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {showChevron && <Icon name="chevron-right" size={20} color={Colors.text.tertiary} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
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
          <Text style={styles.headerTitle}>Security & Privacy</Text>
          <Text style={styles.headerSubtitle}>Protect your data</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Lock */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Security</Text>
          <View style={styles.card}>
            <SecurityItem
              icon="lock"
              label="App Lock"
              description="Require PIN to open the app"
              value={security.appLockEnabled}
              onToggle={() => handleToggle('appLockEnabled')}
              iconColor="#EF4444"
            />
            <SecurityItem
              icon="fingerprint"
              label="Biometric Authentication"
              description="Use fingerprint or Face ID"
              value={security.biometricEnabled}
              onToggle={() => handleToggle('biometricEnabled')}
              iconColor="#8B5CF6"
            />
            <SecurityItem
              icon="shield-check"
              label="Require PIN on Launch"
              description="Ask for PIN every time app opens"
              value={security.requirePinOnLaunch}
              onToggle={() => handleToggle('requirePinOnLaunch')}
              iconColor="#F59E0B"
              showDivider={false}
            />
          </View>
        </View>

        {/* PIN Management */}
        {security.appLockEnabled && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PIN Management</Text>
            <View style={styles.card}>
              <MenuItem
                icon="key-plus"
                label="Set PIN Code"
                onPress={handleSetPIN}
                iconColor="#10B981"
              />
              <View style={styles.divider} />
              <MenuItem
                icon="key-change"
                label="Change PIN Code"
                onPress={handleChangePIN}
                iconColor="#3B82F6"
              />
            </View>
          </View>
        )}

        {/* Auto Lock */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auto Lock</Text>
          <View style={styles.card}>
            <View style={styles.autoLockContainer}>
              <Text style={styles.autoLockLabel}>Lock app after inactivity</Text>
              <View style={styles.autoLockOptions}>
                {['30sec', '1min', '5min', '15min'].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.autoLockChip,
                      security.autoLockTime === time && styles.autoLockChipActive,
                    ]}
                    onPress={() => setSecurity({ ...security, autoLockTime: time })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.autoLockChipText,
                        security.autoLockTime === time && styles.autoLockChipTextActive,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.card}>
            <SecurityItem
              icon="eye-off"
              label="Hide Balances"
              description="Blur amounts on app switcher"
              value={security.hideBalances}
              onToggle={() => handleToggle('hideBalances')}
              iconColor="#6B7280"
            />
            <SecurityItem
              icon="incognito"
              label="Hide Sensitive Info"
              description="Hide account numbers and details"
              value={security.hideSensitiveInfo}
              onToggle={() => handleToggle('hideSensitiveInfo')}
              iconColor="#94A3B8"
            />
            <SecurityItem
              icon="camera-off"
              label="Allow Screenshots"
              description="Enable taking screenshots in the app"
              value={security.allowScreenshots}
              onToggle={() => handleToggle('allowScreenshots')}
              iconColor="#3B82F6"
              showDivider={false}
            />
          </View>
        </View>

        {/* Data & Analytics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Analytics</Text>
          <View style={styles.card}>
            <SecurityItem
              icon="chart-line"
              label="Share Analytics"
              description="Help improve the app with usage data"
              value={security.shareAnalytics}
              onToggle={() => handleToggle('shareAnalytics')}
              iconColor="#10B981"
            />
            <SecurityItem
              icon="database-export"
              label="Share Usage Data"
              description="Anonymous usage statistics"
              value={security.shareUsageData}
              onToggle={() => handleToggle('shareUsageData')}
              iconColor="#06B6D4"
              showDivider={false}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
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
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  securityContent: {
    flex: 1,
  },
  securityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  securityDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 68,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  autoLockContainer: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  autoLockLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  autoLockOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  autoLockChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
  },
  autoLockChipActive: {
    backgroundColor: Colors.primary.subtle,
    borderColor: Colors.primary.main,
  },
  autoLockChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  autoLockChipTextActive: {
    color: Colors.primary.main,
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

export default SecurityPrivacyScreen;
