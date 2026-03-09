/**
 * AppearanceScreen
 * Theme and appearance customization
 * @module screens/Settings/AppearanceScreen
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

const THEMES = [
  { id: 'light', label: 'Light', icon: 'white-balance-sunny', color: '#F59E0B' },
  { id: 'dark', label: 'Dark', icon: 'weather-night', color: '#6366F1' },
  { id: 'auto', label: 'Auto', icon: 'theme-light-dark', color: '#8B5CF6' },
];

const ACCENT_COLORS = [
  { id: 'teal', name: 'Teal', color: '#14B8A6' },
  { id: 'blue', name: 'Blue', color: '#3B82F6' },
  { id: 'purple', name: 'Purple', color: '#8B5CF6' },
  { id: 'pink', name: 'Pink', color: '#EC4899' },
  { id: 'green', name: 'Green', color: '#10B981' },
  { id: 'orange', name: 'Orange', color: '#F59E0B' },
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'indigo', name: 'Indigo', color: '#6366F1' },
];

const FONT_SIZES = [
  { id: 'small', label: 'Small', value: 14 },
  { id: 'medium', label: 'Medium', value: 16 },
  { id: 'large', label: 'Large', value: 18 },
  { id: 'xlarge', label: 'Extra Large', value: 20 },
];

function AppearanceScreen({ navigation }) {
  const [appearance, setAppearance] = useState({
    theme: 'light',
    accentColor: 'teal',
    fontSize: 'medium',
    useSystemFont: false,
    reducedMotion: false,
    highContrast: false,
  });

  const handleSave = () => {
    // TODO: Save to AsyncStorage and apply theme
    Alert.alert('Success', 'Appearance settings saved!', [
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#06B6D4', '#0891B2']}
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
          <Text style={styles.headerTitle}>Appearance</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.themesGrid}>
            {THEMES.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  appearance.theme === theme.id && styles.themeCardSelected,
                ]}
                onPress={() => setAppearance({ ...appearance, theme: theme.id })}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.themeIcon,
                    { backgroundColor: `${theme.color}15` },
                    appearance.theme === theme.id && { backgroundColor: theme.color },
                  ]}
                >
                  <Icon
                    name={theme.icon}
                    size={28}
                    color={appearance.theme === theme.id ? Colors.text.inverse : theme.color}
                  />
                </View>
                <Text
                  style={[
                    styles.themeLabel,
                    appearance.theme === theme.id && styles.themeLabelSelected,
                  ]}
                >
                  {theme.label}
                </Text>
                {appearance.theme === theme.id && (
                  <View style={styles.themeCheck}>
                    <Icon name="check-circle" size={20} color={Colors.primary.main} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Accent Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accent Color</Text>
          <View style={styles.card}>
            <View style={styles.colorsGrid}>
              {ACCENT_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorItem,
                    appearance.accentColor === color.id && styles.colorItemSelected,
                  ]}
                  onPress={() => setAppearance({ ...appearance, accentColor: color.id })}
                  activeOpacity={0.7}
                >
                  <View style={[styles.colorCircle, { backgroundColor: color.color }]}>
                    {appearance.accentColor === color.id && (
                      <Icon name="check" size={20} color={Colors.text.inverse} />
                    )}
                  </View>
                  <Text style={styles.colorName}>{color.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Font Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font Size</Text>
          <View style={styles.card}>
            <View style={styles.fontSizeContainer}>
              {FONT_SIZES.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.fontSizeChip,
                    appearance.fontSize === size.id && styles.fontSizeChipActive,
                  ]}
                  onPress={() => setAppearance({ ...appearance, fontSize: size.id })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.fontSizeChipText,
                      { fontSize: size.value - 2 },
                      appearance.fontSize === size.id && styles.fontSizeChipTextActive,
                    ]}
                  >
                    {size.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.previewText}>Preview: The quick brown fox jumps over the lazy dog</Text>
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <View style={styles.card}>
            <View style={styles.accessibilityItem}>
              <View style={styles.accessibilityContent}>
                <Text style={styles.accessibilityLabel}>Use System Font</Text>
                <Text style={styles.accessibilityHint}>Use device's default font</Text>
              </View>
              <ToggleSwitch
                value={appearance.useSystemFont}
                onValueChange={(value) => setAppearance({ ...appearance, useSystemFont: value })}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.accessibilityItem}>
              <View style={styles.accessibilityContent}>
                <Text style={styles.accessibilityLabel}>Reduced Motion</Text>
                <Text style={styles.accessibilityHint}>Minimize animations</Text>
              </View>
              <ToggleSwitch
                value={appearance.reducedMotion}
                onValueChange={(value) => setAppearance({ ...appearance, reducedMotion: value })}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.accessibilityItem}>
              <View style={styles.accessibilityContent}>
                <Text style={styles.accessibilityLabel}>High Contrast</Text>
                <Text style={styles.accessibilityHint}>Increase color contrast</Text>
              </View>
              <ToggleSwitch
                value={appearance.highContrast}
                onValueChange={(value) => setAppearance({ ...appearance, highContrast: value })}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.9}>
          <LinearGradient
            colors={['#06B6D4', '#0891B2']}
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
  themesGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  themeCard: {
    flex: 1,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    ...Shadows.sm,
  },
  themeCardSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.subtle,
  },
  themeIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  themeLabelSelected: {
    color: Colors.primary.main,
  },
  themeCheck: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorItem: {
    alignItems: 'center',
    width: '22%',
  },
  colorItemSelected: {
    // Selected state
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.sm,
  },
  colorName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  fontSizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  fontSizeChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    alignItems: 'center',
  },
  fontSizeChipActive: {
    backgroundColor: Colors.primary.subtle,
    borderColor: Colors.primary.main,
  },
  fontSizeChipText: {
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  fontSizeChipTextActive: {
    color: Colors.primary.main,
  },
  previewText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  accessibilityContent: {
    flex: 1,
  },
  accessibilityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  accessibilityHint: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.sm,
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

export default AppearanceScreen;
