/**
 * Profile Screen
 * User profile management and settings
 * Minimalist flat design with Modern Teal accent
 * @module screens/Main/ProfileScreen
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { LoadingSpinner } from '../../components';
import { Colors, Spacing, Radius, Shadows, Typography } from '../../constants';

function ProfileScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return subscriber;
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Se déconnecter",
          onPress: async () => {
            try {
              await auth().signOut();
              console.log("Utilisateur déconnecté !");
            } catch (error) {
              console.error("Erreur lors de la déconnexion:", error);
              Alert.alert("Erreur de déconnexion", "Impossible de se déconnecter. Veuillez réessayer.");
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
  };

  if (loading) {
    return (
      <LoadingSpinner message="Chargement du profil..." fullScreen />
    );
  }

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucun utilisateur connecté.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const profileImage = user.photoURL
    ? { uri: user.photoURL }
    : require('../../../assets/AppIcon.png');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Mon Profil</Text>
      </View>

      <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <View style={styles.profileInfoCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={profileImage}
              style={styles.avatar}
              onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera-outline" size={18} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.displayName || 'Utilisateur'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <TouchableOpacity style={styles.editProfileButton} onPress={() => navigateTo('EditProfile')}>
            <Text style={styles.editProfileButtonText}>Modifier le profil</Text>
            <Icon name="chevron-right" size={20} color={Colors.primary.main} />
          </TouchableOpacity>
        </View>

        {/* Account Settings Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Paramètres de compte</Text>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('NotificationsSettings')}>
            <View style={[styles.optionIconContainer, { backgroundColor: `${Colors.primary.main}15` }]}>
              <Icon name="bell-outline" size={22} color={Colors.primary.main} />
            </View>
            <Text style={styles.optionText}>Notifications</Text>
            <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('CurrencySettings')}>
            <View style={[styles.optionIconContainer, { backgroundColor: `${Colors.success}15` }]}>
              <Icon name="currency-usd" size={22} color={Colors.success} />
            </View>
            <Text style={styles.optionText}>Devise</Text>
            <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionItem, styles.optionItemLast]} onPress={() => navigateTo('ThemeSettings')}>
            <View style={[styles.optionIconContainer, { backgroundColor: `${Colors.warning}15` }]}>
              <Icon name="palette-outline" size={22} color={Colors.warning} />
            </View>
            <Text style={styles.optionText}>Thème</Text>
            <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('ChangePassword')}>
            <View style={[styles.optionIconContainer, { backgroundColor: `${Colors.error}15` }]}>
              <Icon name="lock-outline" size={22} color={Colors.error} />
            </View>
            <Text style={styles.optionText}>Changer le mot de passe</Text>
            <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionItem, styles.optionItemLast]} onPress={() => navigateTo('TwoFactorAuth')}>
            <View style={[styles.optionIconContainer, { backgroundColor: `${Colors.primary.main}15` }]}>
              <Icon name="shield-lock-outline" size={22} color={Colors.primary.main} />
            </View>
            <Text style={styles.optionText}>Authentification à deux facteurs</Text>
            <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* Help & Support Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Aide & Support</Text>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('FAQ')}>
            <View style={[styles.optionIconContainer, { backgroundColor: `${Colors.primary.light}15` }]}>
              <Icon name="help-circle-outline" size={22} color={Colors.primary.light} />
            </View>
            <Text style={styles.optionText}>FAQ</Text>
            <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionItem, styles.optionItemLast]} onPress={() => navigateTo('ContactSupport')}>
            <View style={[styles.optionIconContainer, { backgroundColor: `${Colors.primary.main}15` }]}>
              <Icon name="lifebuoy" size={22} color={Colors.primary.main} />
            </View>
            <Text style={styles.optionText}>Contacter le support</Text>
            <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={22} color={Colors.text.inverse} style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  emptyText: {
    ...Typography.body,
    marginTop: Spacing.sm,
    color: Colors.text.secondary,
  },
  loginButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary.main,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.sm,
  },
  loginButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  header: {
    backgroundColor: Colors.background.primary,
    paddingTop: Spacing.xl + Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  pageTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
  },
  scrollViewContent: {
    flex: 1,
  },
  profileInfoCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: Colors.primary.main,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary.main,
    borderRadius: Radius.full,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.background.card,
  },
  userName: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.subtle,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
    justifyContent: 'space-between',
    width: '100%',
  },
  editProfileButtonText: {
    ...Typography.bodyBold,
    color: Colors.primary.main,
  },
  sectionCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionText: {
    ...Typography.body,
    flex: 1,
    color: Colors.text.primary,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    ...Shadows.sm,
  },
  logoutIcon: {
    marginRight: Spacing.sm,
  },
  logoutButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
});

export default ProfileScreen;
