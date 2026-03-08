/**
 * Account Service
 * Handles all account-related operations with Firestore
 * @module services/AccountService
 */
import firestore from '@react-native-firebase/firestore';
import Account from '../models/Account';

/**
 * Service class for managing user accounts (bank accounts, wallets, etc.)
 * Provides CRUD operations and real-time listeners for accounts
 */
class AccountService {
  /** @private Firestore users collection reference */
  _usersCollection = firestore().collection('users');

  /**
   * Gets the accounts subcollection for a specific user
   * @private
   * @param {string} uid - User ID
   * @returns {FirebaseFirestoreTypes.CollectionReference} Accounts collection reference
   */
  _getAccountsCollection(uid) {
    return this._usersCollection.doc(uid).collection('accounts');
  }

  /**
   * Adds a new account for a user
   * @param {string} uid - User ID
   * @param {Account} account - Account instance to add
   * @returns {Promise<Account>} The created account with ID
   * @throws {Error} If account is invalid or creation fails
   */
  async addAccount(uid, account) {
    try {
      if (!(account instanceof Account) || account.uid !== uid) {
        throw new Error('Invalid account object or UID mismatch.');
      }
      const docRef = await this._getAccountsCollection(uid).add(
        account.toFirestore(),
      );
      account.id = docRef.id;
      console.log(`Account ${account.id} added for user ${uid}.`);
      return account;
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  }

  /**
   * Retrieves all accounts for a user, ordered by creation date
   * @param {string} uid - User ID
   * @returns {Promise<Account[]>} Array of Account instances
   * @throws {Error} If fetching fails
   */
  async getAccounts(uid) {
    try {
      const snapshot = await this._getAccountsCollection(uid)
        .orderBy('createdAt', 'asc')
        .get();
      const accounts = snapshot.docs.map(doc =>
        Account.fromFirestore(doc.data(), doc.id),
      );
      console.log(`Fetched ${accounts.length} accounts for user ${uid}.`);
      return accounts;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }

  /**
   * Retrieves a specific account by ID
   * @param {string} uid - User ID
   * @param {string} accountId - Account ID
   * @returns {Promise<Account|null>} Account instance or null if not found
   * @throws {Error} If fetching fails
   */
  async getAccount(uid, accountId) {
    try {
      const doc = await this._getAccountsCollection(uid).doc(accountId).get();
      if (doc.exists) {
        return Account.fromFirestore(doc.data(), doc.id);
      }
      console.log(`Account ${accountId} not found for user ${uid}.`);
      return null;
    } catch (error) {
      console.error('Error getting account:', error);
      throw error;
    }
  }

  /**
   * Updates an existing account with new data
   * @param {string} uid - User ID
   * @param {string} accountId - Account ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   * @throws {Error} If update fails
   */
  async updateAccount(uid, accountId, updates) {
    try {
      await this._getAccountsCollection(uid)
        .doc(accountId)
        .update({
          ...updates,
          lastUpdated: firestore.Timestamp.fromDate(new Date()),
        });
      console.log(`Account ${accountId} updated for user ${uid}.`);
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  /**
   * Updates the current balance of an account by a given amount
   * @warning Prefer using TransactionService which handles balance updates atomically
   * @param {string} uid - User ID
   * @param {string} accountId - Account ID
   * @param {number} amountChange - Amount to add (positive) or subtract (negative)
   * @returns {Promise<void>}
   * @throws {Error} If update fails
   */
  async updateAccountBalance(uid, accountId, amountChange) {
    try {
      const accountRef = this._getAccountsCollection(uid).doc(accountId);
      await accountRef.update({
        currentBalance: firestore.FieldValue.increment(amountChange),
        lastUpdated: firestore.Timestamp.fromDate(new Date()),
      });
      console.log(
        `Account ${accountId} balance updated by ${amountChange} for user ${uid}.`,
      );
    } catch (error) {
      console.error('Error updating account balance:', error);
      throw error;
    }
  }

  /**
   * Deletes an account
   * @param {string} uid - User ID
   * @param {string} accountId - Account ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If deletion fails
   */
  async deleteAccount(uid, accountId) {
    try {
      await this._getAccountsCollection(uid).doc(accountId).delete();
      console.log(`Account ${accountId} deleted for user ${uid}.`);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  /**
   * Listens to real-time changes on user's accounts
   * @param {string} uid - User ID
   * @param {function(Account[]): void} callback - Callback receiving updated accounts array
   * @returns {function(): void} Unsubscribe function to stop listening
   */
  listenToAccounts(uid, callback) {
    const unsubscribe = this._getAccountsCollection(uid)
      .orderBy('name', 'asc')
      .onSnapshot(
        snapshot => {
          const accounts = snapshot.docs.map(doc =>
            Account.fromFirestore(doc.data(), doc.id),
          );
          callback(accounts);
        },
        error => {
          console.error('Error listening to accounts:', error);
          callback([]);
        },
      );
    return unsubscribe;
  }
}

export const accountService = new AccountService();
