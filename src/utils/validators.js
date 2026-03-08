/**
 * Input validation utilities for SpendSmart
 * @module utils/validators
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates a password (minimum 6 characters)
 * @param {string} password - The password to validate
 * @param {number} [minLength=6] - Minimum password length
 * @returns {{valid: boolean, message: string}} Validation result
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password) {
    return { valid: false, message: 'Le mot de passe est requis' };
  }

  if (password.length < minLength) {
    return {
      valid: false,
      message: `Le mot de passe doit contenir au moins ${minLength} caractères`
    };
  }

  return { valid: true, message: '' };
};

/**
 * Validates a transaction amount
 * @param {number|string} amount - The amount to validate
 * @returns {{valid: boolean, message: string}} Validation result
 */
export const validateAmount = (amount) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (amount === null || amount === undefined || amount === '') {
    return { valid: false, message: 'Le montant est requis' };
  }

  if (isNaN(numAmount)) {
    return { valid: false, message: 'Le montant doit être un nombre valide' };
  }

  if (numAmount <= 0) {
    return { valid: false, message: 'Le montant doit être supérieur à 0' };
  }

  return { valid: true, message: '' };
};

/**
 * Validates a required field
 * @param {*} value - The value to validate
 * @param {string} [fieldName='Ce champ'] - Field name for error message
 * @returns {{valid: boolean, message: string}} Validation result
 */
export const validateRequired = (value, fieldName = 'Ce champ') => {
  const isValid = value !== null &&
                  value !== undefined &&
                  value !== '' &&
                  (typeof value !== 'string' || value.trim() !== '');

  return {
    valid: isValid,
    message: isValid ? '' : `${fieldName} est requis`,
  };
};

/**
 * Validates a budget
 * @param {object} budget - The budget object to validate
 * @returns {{valid: boolean, errors: object}} Validation result with field-specific errors
 */
export const validateBudget = (budget) => {
  const errors = {};

  const nameValidation = validateRequired(budget?.name, 'Le nom du budget');
  if (!nameValidation.valid) {
    errors.name = nameValidation.message;
  }

  const amountValidation = validateAmount(budget?.amount);
  if (!amountValidation.valid) {
    errors.amount = amountValidation.message;
  }

  if (!budget?.categoryIds || budget.categoryIds.length === 0) {
    errors.categoryIds = 'Sélectionnez au moins une catégorie';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates a transaction
 * @param {object} transaction - The transaction object to validate
 * @returns {{valid: boolean, errors: object}} Validation result with field-specific errors
 */
export const validateTransaction = (transaction) => {
  const errors = {};

  const amountValidation = validateAmount(transaction?.amount);
  if (!amountValidation.valid) {
    errors.amount = amountValidation.message;
  }

  if (!transaction?.type || !['income', 'expense', 'transfer'].includes(transaction.type)) {
    errors.type = 'Type de transaction invalide';
  }

  if (!transaction?.accountId) {
    errors.accountId = 'Sélectionnez un compte';
  }

  if (transaction?.type === 'transfer' && !transaction?.destinationAccountId) {
    errors.destinationAccountId = 'Sélectionnez un compte de destination';
  }

  if (transaction?.type !== 'transfer' && !transaction?.categoryId) {
    errors.categoryId = 'Sélectionnez une catégorie';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates an account
 * @param {object} account - The account object to validate
 * @returns {{valid: boolean, errors: object}} Validation result with field-specific errors
 */
export const validateAccount = (account) => {
  const errors = {};

  const nameValidation = validateRequired(account?.name, 'Le nom du compte');
  if (!nameValidation.valid) {
    errors.name = nameValidation.message;
  }

  if (!account?.type) {
    errors.type = 'Sélectionnez un type de compte';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - The input to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 1000); // Limit length
};

export default {
  isValidEmail,
  validatePassword,
  validateAmount,
  validateRequired,
  validateBudget,
  validateTransaction,
  validateAccount,
  sanitizeInput,
};
