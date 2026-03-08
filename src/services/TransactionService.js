/**
 * Transaction Service
 * Handles all transaction-related operations with Firestore
 * @module services/TransactionService
 */
import firestore from '@react-native-firebase/firestore';
import Transaction from '../models/Transaction';

/**
 * Service class for managing user transactions
 * Provides CRUD operations and real-time listeners for transactions
 */
class TransactionService {
  /** @private Firestore users collection reference */
  _usersCollection = firestore().collection('users');

  /**
   * Gets the transactions subcollection for a specific user
   * @private
   * @param {string} uid - User ID
   * @returns {FirebaseFirestoreTypes.CollectionReference} Transactions collection reference
   */
  _getTransactionsCollection(uid) {
    return this._usersCollection.doc(uid).collection('transactions');
  }

  /**
   * Adds a new transaction and updates related account balances atomically
   * @param {string} uid - User ID
   * @param {Transaction} transaction - Transaction instance to add
   * @returns {Promise<Transaction>} The created transaction with ID
   * @throws {Error} If transaction is invalid or accounts don't exist
   */
  async addTransaction(uid, transaction) {
    if (!(transaction instanceof Transaction) || transaction.uid !== uid) {
      throw new Error('Invalid transaction object or UID mismatch.');
    }

    // Créer une référence avec un ID généré
    const transactionRef = this._getTransactionsCollection(uid).doc();

    // Lance une transaction Firestore pour garantir l'atomicité
    await firestore().runTransaction(async transactionFirestore => {
      // 1. Mettre à jour le solde du compte source/destination
      const accountRef = this._usersCollection
        .doc(uid)
        .collection('accounts')
        .doc(transaction.accountId);
      const accountDoc = await transactionFirestore.get(accountRef);

      if (!accountDoc.exists) {
        throw new Error(
          `Account with ID ${transaction.accountId} does not exist.`,
        );
      }

      // Directement l'amount de la transaction
      let amountChangeForAccount = transaction.amount;

      // 2. Mettre à jour le solde du compte d'origine
      transactionFirestore.update(accountRef, {
        currentBalance: firestore.FieldValue.increment(amountChangeForAccount),
        lastUpdated: firestore.Timestamp.fromDate(new Date()),
      });

      // 3. Pour les transferts, mettre à jour le compte de destination
      if (transaction.type === 'transfer') {
        const transferToAccountRef = this._usersCollection
          .doc(uid)
          .collection('accounts')
          .doc(transaction.transferToAccountId);
        const transferToAccountDoc = await transactionFirestore.get(
          transferToAccountRef,
        );

        if (!transferToAccountDoc.exists) {
          throw new Error(
            `Target account with ID ${transaction.transferToAccountId} does not exist for transfer.`,
          );
        }
        // Pour le compte de destination, le montant est l'inverse de l'original (positif)
        transactionFirestore.update(transferToAccountRef, {
          currentBalance: firestore.FieldValue.increment(
            Math.abs(transaction.amount),
          ),
          lastUpdated: firestore.Timestamp.fromDate(new Date()),
        });
      }

      // 4. Mettre à jour le résumé global (BalanceSummary) de l'utilisateur
      const userDocRef = this._usersCollection.doc(uid);
      const userDoc = await transactionFirestore.get(userDocRef);

      if (!userDoc.exists) {
        throw new Error(
          `User document with ID ${uid} does not exist for balance update.`,
        );
      }

      const balanceUpdates = {
        currentBalance: firestore.FieldValue.increment(transaction.amount),
      };

      if (transaction.type === 'income') {
        balanceUpdates.totalIncome = firestore.FieldValue.increment(
          transaction.amount,
        );
      } else if (transaction.type === 'expense') {
        // Les dépenses sont déjà négatives dans le modèle, donc on incrémente avec un négatif
        balanceUpdates.totalExpenses = firestore.FieldValue.increment(
          transaction.amount,
        );
      }

      transactionFirestore.update(userDocRef, balanceUpdates);

      // 5. Ajouter la transaction elle-même
      transactionFirestore.set(transactionRef, transaction.toFirestore());
      transaction.id = transactionRef.id; // Définir l'ID pour l'objet retourné
    });

    console.log(
      `Transaction ${transaction.id} processed and balances updated for user ${uid}.`,
    );
    return transaction;
  }

  /**
   * Retrieves all transactions for a user, ordered by date (newest first)
   * @param {string} uid - User ID
   * @returns {Promise<Transaction[]>} Array of Transaction instances
   * @throws {Error} If fetching fails
   */
  async getTransactions(uid) {
    try {
      const snapshot = await this._getTransactionsCollection(uid)
        .orderBy('date', 'desc')
        .get();
      const transactions = snapshot.docs.map(doc =>
        Transaction.fromFirestore(doc.data(), doc.id),
      );
      console.log(
        `Fetched ${transactions.length} transactions for user ${uid}.`,
      );
      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  /**
   * Deletes a transaction and reverts its impact on account balances atomically
   * @param {string} uid - User ID
   * @param {string} transactionId - ID of the transaction to delete
   * @returns {Promise<void>}
   * @throws {Error} If transaction not found or deletion fails
   */
  async deleteTransaction(uid, transactionId) {
    const transactionRef =
      this._getTransactionsCollection(uid).doc(transactionId);

    await firestore().runTransaction(async transactionFirestore => {
      const transactionDoc = await transactionFirestore.get(transactionRef);
      if (!transactionDoc.exists) {
        throw new Error('Transaction not found.');
      }
      const transactionData = Transaction.fromFirestore(
        transactionDoc.data(),
        transactionDoc.id,
      );

      // 1. Annuler l'impact sur le compte d'origine
      const accountRef = this._usersCollection
        .doc(uid)
        .collection('accounts')
        .doc(transactionData.accountId);
      // Le montant à "inverser" est l'opposé de l'amount de la transaction
      transactionFirestore.update(accountRef, {
        currentBalance: firestore.FieldValue.increment(-transactionData.amount),
        lastUpdated: firestore.Timestamp.fromDate(new Date()),
      });

      // 2. Annuler l'impact sur le compte de destination si c'était un transfert
      if (transactionData.type === 'transfer') {
        const transferToAccountRef = this._usersCollection
          .doc(uid)
          .collection('accounts')
          .doc(transactionData.transferToAccountId);
        // Pour le compte de destination, on soustrait le montant qu'on avait ajouté (Math.abs(amount))
        transactionFirestore.update(transferToAccountRef, {
          currentBalance: firestore.FieldValue.increment(
            -Math.abs(transactionData.amount),
          ),
          lastUpdated: firestore.Timestamp.fromDate(new Date()),
        });
      }

      // 3. Annuler l'impact sur le résumé global (BalanceSummary)
      const userDocRef = this._usersCollection.doc(uid);
      const balanceRevertUpdates = {
        currentBalance: firestore.FieldValue.increment(-transactionData.amount),
      };

      if (transactionData.type === 'income') {
        balanceRevertUpdates.totalIncome = firestore.FieldValue.increment(
          -transactionData.amount,
        );
      } else if (transactionData.type === 'expense') {
        balanceRevertUpdates.totalExpenses = firestore.FieldValue.increment(
          -transactionData.amount,
        );
      }
      // Les transferts n'affectent pas totalIncome/totalExpenses au niveau global, donc pas de réversion ici

      transactionFirestore.update(userDocRef, balanceRevertUpdates);

      // 4. Supprimer la transaction
      transactionFirestore.delete(transactionRef);
    });

    console.log(
      `Transaction ${transactionId} deleted and balances reverted for user ${uid}.`,
    );
  }

  /**
   * Listens to real-time changes on user's transactions
   * @param {string} uid - User ID
   * @param {function(Transaction[]): void} callback - Callback receiving updated transactions array
   * @returns {function(): void} Unsubscribe function to stop listening
   */
  listenToTransactions(uid, callback) {
    const unsubscribe = this._getTransactionsCollection(uid)
      .orderBy('date', 'desc')
      .onSnapshot(
        snapshot => {
          const transactions = snapshot.docs.map(doc =>
            Transaction.fromFirestore(doc.data(), doc.id),
          );
          callback(transactions);
        },
        error => {
          console.error('Error listening to transactions:', error);
          callback([]);
        },
      );
    return unsubscribe;
  }
}

export const transactionService = new TransactionService();
