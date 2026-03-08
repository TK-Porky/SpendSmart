/**
 * Budget Service
 * Handles all budget-related operations with Firestore
 * @module services/BudgetService
 */
import firestore from '@react-native-firebase/firestore';
import Budget from '../models/Budget';

/**
 * Service class for managing user budgets
 * Provides CRUD operations and real-time listeners for budgets
 */
class BudgetService {
  /** @private Firestore users collection reference */
  _usersCollection = firestore().collection('users');

  /**
   * Gets the budgets subcollection for a specific user
   * @private
   * @param {string} uid - User ID
   * @returns {FirebaseFirestoreTypes.CollectionReference} Budgets collection reference
   */
  _getBudgetsCollection(uid) {
    return this._usersCollection.doc(uid).collection('budgets');
  }

  /**
   * Adds a new budget for a user
   * @param {string} uid - User ID
   * @param {Budget} budget - Budget instance to add
   * @returns {Promise<Budget>} The created budget with ID
   * @throws {Error} If budget is invalid or creation fails
   */
  async addBudget(uid, budget) {
    try {
      if (!(budget instanceof Budget) || budget.uid !== uid) {
        throw new Error('Invalid budget object or UID mismatch.');
      }
      const docRef = await this._getBudgetsCollection(uid).add(
        budget.toFirestore(),
      );
      budget.id = docRef.id;
      console.log(`Budget ${budget.id} added for user ${uid}.`);
      return budget;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  }

  /**
   * Retrieves all budgets for a user, ordered by start date (newest first)
   * @param {string} uid - User ID
   * @returns {Promise<Budget[]>} Array of Budget instances
   * @throws {Error} If fetching fails
   */
  async getBudgets(uid) {
    try {
      const snapshot = await this._getBudgetsCollection(uid)
        .orderBy('startDate', 'desc')
        .get();
      const budgets = snapshot.docs.map(doc =>
        Budget.fromFirestore(doc.data(), doc.id),
      );
      console.log(`Fetched ${budgets.length} budgets for user ${uid}.`);
      return budgets;
    } catch (error) {
      console.error('Error getting budgets:', error);
      throw error;
    }
  }

  /**
   * Updates an existing budget with new data
   * @param {string} uid - User ID
   * @param {string} budgetId - Budget ID to update
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   * @throws {Error} If update fails
   */
  async updateBudget(uid, budgetId, updates) {
    try {
      await this._getBudgetsCollection(uid)
        .doc(budgetId)
        .update({
          ...updates,
          lastUpdated: firestore.Timestamp.fromDate(new Date()),
        });
      console.log(`Budget ${budgetId} updated for user ${uid}.`);
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  /**
   * Deletes a budget
   * @param {string} uid - User ID
   * @param {string} budgetId - Budget ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If deletion fails
   */
  async deleteBudget(uid, budgetId) {
    try {
      await this._getBudgetsCollection(uid).doc(budgetId).delete();
      console.log(`Budget ${budgetId} deleted for user ${uid}.`);
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  /**
   * Listens to real-time changes on user's budgets
   * @param {string} uid - User ID
   * @param {function(Budget[]): void} callback - Callback receiving updated budgets array
   * @returns {function(): void} Unsubscribe function to stop listening
   */
  listenToBudgets(uid, callback) {
    const unsubscribe = this._getBudgetsCollection(uid)
      .orderBy('startDate', 'desc')
      .onSnapshot(
        snapshot => {
          const budgets = snapshot.docs.map(doc =>
            Budget.fromFirestore(doc.data(), doc.id),
          );
          callback(budgets);
        },
        error => {
          console.error('Error listening to budgets:', error);
          callback([]);
        },
      );
    return unsubscribe;
  }
}

export const budgetService = new BudgetService();
