/**
 * Settings Screen
 * App settings and preferences
 * @module screens/Settings/SettingsScreen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { Colors, Spacing, Typography, Radius, Shadows } from '../../constants';
import { notificationService } from '../../services/NotificationService';
import { useToast } from '../../context/ToastContext';

const SettingsScreen = ({ navigation }) => {
  const { showToast } = useToast();
  const user = auth().currentUser;

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);

  // Load notification settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const reminderStatus = await notificationService.getDailyTransactionReminderStatus();
        setDailyReminderEnabled(reminderStatus.enabled);
        setNotificationsEnabled(reminderStatus.enabled || budgetAlertsEnabled);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Handle notification toggle
  const handleNotificationsToggle = async (value) => {
    setNotificationsEnabled(value);
    if (value) {
      const hasPermission = await notificationService.requestNotificationPermissions();
      if (!hasPermission) {
        setNotificationsEnabled(false);
        Alert.alert(
          'Permissions requises',
          'Veuillez activer les notifications dans les parametres de votre appareil.'
        );
      }
    }
  };

  // Handle daily reminder toggle
  const handleDailyReminderToggle = async (value) => {
    setDailyReminderEnabled(value);
    try {
      if (value) {
        await notificationService.scheduleDailyTransactionReminder(20, 0);
        showToast('Rappel quotidien active', 'success');
      } else {
        await notificationService.cancelAllTriggers();
        showToast('Rappel quotidien desactive', 'info');
      }
    } catch (error) {
      console.error('Error toggling daily reminder:', error);
      setDailyReminderEnabled(!value);
    }
  };

  // Settings sections configuration
  const settingsSections = [
    {
      title: 'Notifications',
      icon: 'bell-outline',
      items: [
        {
          id: 'notifications',
          label: 'Activer les notifications',
          type: 'switch',
          value: notificationsEnabled,
          onToggle: handleNotificationsToggle,
        },
        {
          id: 'budgetAlerts',
          label: 'Alertes de budget',
          description: 'Recevoir une alerte quand un budget est depasse',
          type: 'switch',
          value: budgetAlertsEnabled,
          onToggle: setBudgetAlertsEnabled,
          disabled: !notificationsEnabled,
        },
        {
          id: 'dailyReminder',
          label: 'Rappel quotidien',
          description: 'Rappel pour enregistrer vos transactions (20h00)',
          type: 'switch',
          value: dailyReminderEnabled,
          onToggle: handleDailyReminderToggle,
          disabled: !notificationsEnabled,
        },
      ],
    },
    {
      title: 'Preferences',
      icon: 'cog-outline',
      items: [
        {
          id: 'currency',
          label: 'Devise',
          value: 'XOF (Franc CFA)',
          type: 'link',
          onPress: () => showToast('Fonctionnalite bientot disponible', 'info'),
        },
        {
          id: 'dateFormat',
          label: 'Format de date',
          value: 'DD/MM/YYYY',
          type: 'link',
          onPress: () => showToast('Fonctionnalite bientot disponible', 'info'),
        },
        {
          id: 'firstDayOfWeek',
          label: 'Premier jour de la semaine',
          value: 'Lundi',
          type: 'link',
          onPress: () => showToast('Fonctionnalite bientot disponible', 'info'),
        },
      ],
    },
    {
      title: 'Securite',
      icon: 'shield-outline',
      items: [
        {
          id: 'changePassword',
          label: 'Changer le mot de passe',
          type: 'link',
          icon: 'lock-outline',
          onPress: () => {
            Alert.alert(
              'Reinitialiser le mot de passe',
              'Un email de reinitialisation sera envoye a ' + user?.email,
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Envoyer',
                  onPress: async () => {
                    try {
                      await auth().sendPasswordResetEmail(user.email);
                      showToast('Email envoye', 'success');
                    } catch (error) {
                      showToast('Erreur d\'envoi', 'error');
                    }
                  },
                },
              ]
            );
          },
        },
        {
          id: 'biometric',
          label: 'Authentification biometrique',
          description: 'Utiliser Face ID ou empreinte digitale',
          type: 'switch',
          value: false,
          onToggle: () => showToast('Fonctionnalite bientot disponible', 'info'),
        },
      ],
    },
    {
      title: 'Donnees',
      icon: 'database-outline',
      items: [
        {
          id: 'exportData',
          label: 'Exporter mes donnees',
          description: 'Telecharger vos transactions en CSV',
          type: 'link',
          icon: 'download-outline',
          onPress: () => showToast('Fonctionnalite bientot disponible', 'info'),
        },
        {
          id: 'clearCache',
          label: 'Vider le cache',
          type: 'link',
          icon: 'trash-can-outline',
          onPress: () => {
            Alert.alert(
              'Vider le cache',
              'Cela supprimera les donnees temporaires de l\'application.',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Confirmer',
                  onPress: () => showToast('Cache vide', 'success'),
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: 'A propos',
      icon: 'information-outline',
      items: [
        {
          id: 'version',
          label: 'Version',
          value: '1.0.0',
          type: 'info',
        },
        {
          id: 'privacy',
          label: 'Politique de confidentialite',
          type: 'link',
          icon: 'file-document-outline',
          onPress: () => showToast('Fonctionnalite bientot disponible', 'info'),
        },
        {
          id: 'terms',
          label: 'Conditions d\'utilisation',
          type: 'link',
          icon: 'file-document-outline',
          onPress: () => showToast('Fonctionnalite bientot disponible', 'info'),
        },
      ],
    },
  ];

  // Render setting item
  const renderSettingItem = (item) => {
    const isDisabled = item.disabled;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, isDisabled && styles.settingItemDisabled]}
        onPress={item.type === 'link' ? item.onPress : null}
        disabled={isDisabled || item.type !== 'link'}
        accessibilityRole={item.type === 'link' ? 'button' : 'none'}
        accessibilityLabel={item.label}
      >
        <View style={styles.settingItemLeft}>
          {item.icon && (
            <Icon
              name={item.icon}
              size={20}
              color={isDisabled ? Colors.neutral[300] : Colors.neutral[500]}
              style={styles.settingItemIcon}
            />
          )}
          <View style={styles.settingItemContent}>
            <Text style={[styles.settingItemLabel, isDisabled && styles.textDisabled]}>
              {item.label}
            </Text>
            {item.description && (
              <Text style={[styles.settingItemDescription, isDisabled && styles.textDisabled]}>
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.settingItemRight}>
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: Colors.neutral[200], true: Colors.primary.light }}
              thumbColor={item.value ? Colors.primary.main : Colors.neutral[0]}
              disabled={isDisabled}
            />
          )}
          {item.type === 'link' && (
            <>
              {item.value && (
                <Text style={styles.settingItemValue}>{item.value}</Text>
              )}
              <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
            </>
          )}
          {item.type === 'info' && (
            <Text style={styles.settingItemValue}>{item.value}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Parametres</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name={section.icon} size={18} color={Colors.primary.main} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>SpendSmart v1.0.0</Text>
          <Text style={styles.footerText}>Fait avec amour</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
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
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.caption,
    color: Colors.primary.main,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemIcon: {
    marginRight: Spacing.md,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemLabel: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  settingItemDescription: {
    ...Typography.small,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  settingItemValue: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  textDisabled: {
    color: Colors.neutral[300],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    ...Typography.small,
    color: Colors.text.tertiary,
  },
});

export default SettingsScreen;
