/**
 * EditProfileScreen
 * Edit user profile information
 * @module screens/Settings/EditProfileScreen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { LoadingSpinner } from '../../components';
import { Colors, Spacing, Radius, Shadows } from '../../constants';

function EditProfileScreen({ navigation }) {
  const [user] = useState(auth().currentUser);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        bio: '', // Stored in Firestore if needed
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }

    setSaving(true);
    try {
      await user.updateProfile({
        displayName: formData.displayName.trim(),
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeEmail = () => {
    Alert.alert(
      'Change Email',
      'To change your email, you need to re-authenticate. This feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'A password reset link will be sent to your email.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Link',
          onPress: async () => {
            try {
              await auth().sendPasswordResetEmail(user.email);
              Alert.alert('Success', 'Password reset link sent to your email!');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const profileImage = user?.photoURL
    ? { uri: user.photoURL }
    : require('../../../assets/AppIcon.png');

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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <Text style={styles.headerSubtitle}>Update your information</Text>
        </View>

        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={profileImage} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => Alert.alert('Coming Soon', 'Avatar editing will be available soon.')}
              activeOpacity={0.8}
            >
              <Icon name="camera" size={18} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarHint}>Tap to change avatar</Text>
        </View>

        {/* Display Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Display Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.displayName}
              onChangeText={(text) => setFormData({ ...formData, displayName: text })}
              placeholder="Enter your name"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Email Address</Text>
          <TouchableOpacity style={styles.inputContainer} onPress={handleChangeEmail}>
            <Icon name="email" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
            <Text style={styles.inputText}>{formData.email}</Text>
            <Icon name="pencil" size={18} color={Colors.primary.main} />
          </TouchableOpacity>
          <Text style={styles.fieldHint}>Tap to change email</Text>
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Phone Number (Optional)</Text>
          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color={Colors.text.tertiary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              placeholder="+221 XX XXX XX XX"
              placeholderTextColor={Colors.text.tertiary}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bio (Optional)</Text>
          <View style={styles.notesContainer}>
            <TextInput
              style={styles.notesInput}
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              placeholder="Tell us about yourself..."
              placeholderTextColor={Colors.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Actions</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
              <View style={[styles.menuIconContainer, { backgroundColor: '#F59E0B15' }]}>
                <Icon name="lock-reset" size={22} color="#F59E0B" />
              </View>
              <Text style={styles.menuLabel}>Change Password</Text>
              <Icon name="chevron-right" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={saving ? ['#94A3B8', '#94A3B8'] : ['#0D9488', '#14B8A6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButtonGradient}
          >
            {saving ? (
              <LoadingSpinner size="small" color={Colors.text.inverse} />
            ) : (
              <>
                <Icon name="check" size={20} color={Colors.text.inverse} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    borderWidth: 4,
    borderColor: Colors.primary.main,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background.secondary,
  },
  avatarHint: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionLabel: {
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
  inputText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
  },
  fieldHint: {
    fontSize: 12,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  notesContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    ...Shadows.sm,
  },
  notesInput: {
    fontSize: 15,
    color: Colors.text.primary,
    minHeight: 100,
    padding: 0,
  },
  menuCard: {
    backgroundColor: Colors.background.card,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  menuIconContainer: {
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
  saveButton: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    height: 52,
    ...Shadows.md,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
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

export default EditProfileScreen;
