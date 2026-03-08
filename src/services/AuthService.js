/**
 * Authentication Service
 * Handles user authentication with Firebase Auth
 * @module services/AuthService
 */
import auth from '@react-native-firebase/auth';
import { accountService } from './AccountService';
import { userService } from './UserService';
import User from '../models/User';
import Account from '../models/Account';

/**
 * Service class for user authentication
 * Provides sign up, sign in, sign out, and password reset functionality
 */
class AuthService {
  /**
   * Registers a new user with email and password
   * Creates user document in Firestore and a default cash account
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @param {string} [userData.username] - Optional display name
   * @returns {Promise<FirebaseAuthTypes.User>} The created Firebase user
   * @throws {Error} If registration fails
   */
  async signUp(userData) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(userData.email, userData.password);
      const firebaseUser = userCredential.user;

      // Crée un nouveau document utilisateur dans Firestore
      const newUser = new User(
        firebaseUser.uid,
        firebaseUser.email,
        userData.username || '',
        firebaseUser.photoURL || ''
      );
      
      await userService.createUser(newUser);

      // Crée un compte par défaut pour le nouvel utilisateur
      const defaultAccount = new Account(
        firebaseUser.uid,
        'Cash',               // Nom du compte par défaut
        'cash',               // Type de compte
        0,                    // Solde initial
        '',
        new Date(),
        new Date(),
        0,
        true                  // Est le compte par défaut
      );
      await accountService.addAccount(firebaseUser.uid, defaultAccount);
      console.log('Default account created for new user:', firebaseUser.uid);

      console.log('User signed up and Firestore document created:', firebaseUser.uid);
      return firebaseUser;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  }

  /**
   * Signs in an existing user with email and password
   * Updates last login timestamp in Firestore
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<FirebaseAuthTypes.User>} The signed-in Firebase user
   * @throws {Error} If sign in fails (invalid credentials, etc.)
   */
  async signIn(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;

      // Met à jour la date de dernière connexion dans Firestore
      await userService.updateUserInfo(firebaseUser.uid, {
        lastLoginAt: new Date(), // Date actuelle
      });

      console.log('User signed in and last login updated:', firebaseUser.uid);
      return firebaseUser;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  /**
   * Signs out the current user
   * @returns {Promise<void>}
   * @throws {Error} If sign out fails
   */
  async signOut() {
    try {
      await auth().signOut();
      console.log('User signed out successfully.');
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  /**
   * Sends a password reset email to the specified address
   * @param {string} email - Email address to send reset link to
   * @returns {Promise<void>}
   * @throws {Error} If sending email fails
   */
  async resetPassword(email) {
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }

  /**
   * Subscribes to authentication state changes
   * @param {function(FirebaseAuthTypes.User|null): void} callback - Called when auth state changes
   * @returns {function(): void} Unsubscribe function
   */
  onAuthStateChanged(callback) {
    return auth().onAuthStateChanged(callback);
  }

  /**
   * Gets the currently signed-in user
   * @returns {FirebaseAuthTypes.User|null} Current user or null if not signed in
   */
  getCurrentUser() {
    return auth().currentUser;
  }
}

export const authService = new AuthService();