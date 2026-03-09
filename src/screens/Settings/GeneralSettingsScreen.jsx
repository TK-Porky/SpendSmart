/**
 * GeneralSettingsScreen
 * General app settings and preferences
 * @module screens/Settings/GeneralSettingsScreen
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

const DATE_FORMATS = [
  { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '09/03/2026' },
  { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '03/09/2026' },
  { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2026-03-09' },
];

const TIME_FORMATS = [
  { id: '12h', label: '12-hour', example: '02:30 PM' },
  { id: '24h', label: '24-hour', example: '14:30' },
];

function GeneralSettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    showDecimals: true,
    compactNumbers: false,
    weekStartsOn: 'monday',
    autoBackup: true,
  });

  const handleSave = () => {
    // TODO: Save to AsyncStorage or user preferences
    Alert.alert('Success', 'Settings saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const ToggleSwitch = ({ value, onValueChange }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleActive]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
  );

  const SettingItem = ({ icon, label, children, iconColor, showDivider = true }) => (
    <>
      <View style={styles.settingItem}>
        <View style={[styles.settingIcon, { backgroundColor: `${iconColor}15` }]}>
          <Icon name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingLabel}>{label}</Text>
          {children}
        </View>
      </View>
      {showDivider && <View style={styles.divider} />}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
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
          <Text style={styles.headerTitle}>General Settings</Text>
          <Text style={styles.headerSubtitle}>App preferences</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.card}>
            <SettingItem icon="calendar" label="Date Format" iconColor="#3B82F6">
              <View style={styles.optionsRow}>
                {DATE_FORMATS.map((format) => (
                  <TouchableOpacity
                    key={format.id}
                    style={[
                      styles.optionChip,
                      settings.dateFormat === format.id && styles.optionChipActive,
                    ]}
                    onPress={() => setSettings({ ...settings, dateFormat: format.id })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        settings.dateFormat === format.id && styles.optionChipTextActive,
                      ]}
                    >
                      {format.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.exampleText}>
                Example: {DATE_FORMATS.find((f) => f.id === settings.dateFormat)?.example}
              </Text>
            </SettingItem>

            <SettingItem icon="clock" label="Time Format" iconColor="#10B981" showDivider={false}>
              <View style={styles.optionsRow}>
                {TIME_FORMATS.map((format) => (
                  <TouchableOpacity
                    key={format.id}
                    style={[
                      styles.optionChip,
                      settings.timeFormat === format.id && styles.optionChipActive,
                    ]}
                    onPress={() => setSettings({ ...settings, timeFormat: format.id })}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        settings.timeFormat === format.id && styles.optionChipTextActive,
                      ]}
                    >
                      {format.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.exampleText}>
                Example: {TIME_FORMATS.find((f) => f.id === settings.timeFormat)?.example}
              </Text>
            </SettingItem>
          </View>
        </View>

        {/* Number Format */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number Format</Text>
          <View style={styles.card}>
            <SettingItem icon="decimal" label="Show Decimals" iconColor="#F59E0B">
              <ToggleSwitch
                value={settings.showDecimals}
                onValueChange={(value) => setSettings({ ...settings, showDecimals: value })}
              />
            </SettingItem>

            <SettingItem
              icon="format-list-numbered"
              label="Compact Large Numbers"
              iconColor="#EC4899"
              showDivider={false}
            >
              <ToggleSwitch
                value={settings.compactNumbers}
                onValueChange={(value) => setSettings({ ...settings, compactNumbers: value })}
              />
            </SettingItem>
          </View>
          <Text style={styles.sectionHint}>
            {settings.compactNumbers ? '1.5M instead of 1,500,000' : '1,500,000 instead of 1.5M'}
          </Text>
        </View>

        {/* Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendar</Text>
          <View style={styles.card}>
            <SettingItem
              icon="calendar-start"
              label="Week Starts On"
              iconColor="#8B5CF6"
              showDivider={false}
            >
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    settings.weekStartsOn === 'sunday' && styles.optionChipActive,
                  ]}
                  onPress={() => setSettings({ ...settings, weekStartsOn: 'sunday' })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      settings.weekStartsOn === 'sunday' && styles.optionChipTextActive,
                    ]}
                  >
                    Sunday
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionChip,
                    settings.weekStartsOn === 'monday' && styles.optionChipActive,
                  ]}
                  onPress={() => setSettings({ ...settings, weekStartsOn: 'monday' })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      settings.weekStartsOn === 'monday' && styles.optionChipTextActive,
                    ]}
                  >
                    Monday
                  </Text>
                </TouchableOpacity>
              </View>
            </SettingItem>
          </View>
        </View>

        {/* Backup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup & Sync</Text>
          <View style={styles.card}>
            <SettingItem
              icon="cloud-upload"
              label="Auto Backup"
              iconColor="#06B6D4"
              showDivider={false}
            >
              <ToggleSwitch
                value={settings.autoBackup}
                onValueChange={(value) => setSettings({ ...settings, autoBackup: value })}
              />
            </SettingItem>
          </View>
          <Text style={styles.sectionHint}>
            Automatically backup your data to the cloud
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 68,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
  },
  optionChipActive: {
    backgroundColor: Colors.primary.subtle,
    borderColor: Colors.primary.main,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  optionChipTextActive: {
    color: Colors.primary.main,
  },
  exampleText: {
    fontSize: 12,
    color: Colors.text.tertiary,
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

export default GeneralSettingsScreen;
