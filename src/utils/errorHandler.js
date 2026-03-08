/**
 * Centralized Error Handler for SpendSmart
 * Provides consistent error handling, logging, and user-friendly messages
 * @module utils/errorHandler
 */

import { Strings } from '../constants';

/**
 * Error types enumeration
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  VALIDATION: 'VALIDATION',
  FIRESTORE: 'FIRESTORE',
  PERMISSION: 'PERMISSION',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Maps Firebase error codes to error types
 */
const firebaseErrorMapping = {
  // Auth errors
  'auth/invalid-email': ErrorTypes.VALIDATION,
  'auth/user-disabled': ErrorTypes.AUTH,
  'auth/user-not-found': ErrorTypes.AUTH,
  'auth/wrong-password': ErrorTypes.AUTH,
  'auth/email-already-in-use': ErrorTypes.VALIDATION,
  'auth/weak-password': ErrorTypes.VALIDATION,
  'auth/network-request-failed': ErrorTypes.NETWORK,
  'auth/too-many-requests': ErrorTypes.AUTH,
  'auth/operation-not-allowed': ErrorTypes.PERMISSION,

  // Firestore errors
  'permission-denied': ErrorTypes.PERMISSION,
  'unavailable': ErrorTypes.NETWORK,
  'not-found': ErrorTypes.NOT_FOUND,
  'already-exists': ErrorTypes.VALIDATION,
  'resource-exhausted': ErrorTypes.NETWORK,
  'failed-precondition': ErrorTypes.VALIDATION,
  'aborted': ErrorTypes.NETWORK,
  'deadline-exceeded': ErrorTypes.NETWORK,
};

/**
 * User-friendly error messages
 */
const userMessages = {
  // Auth errors
  'auth/invalid-email': Strings.auth.invalidEmail,
  'auth/user-not-found': Strings.auth.signInError,
  'auth/wrong-password': Strings.auth.signInError,
  'auth/email-already-in-use': 'Cette adresse e-mail est déjà utilisée',
  'auth/weak-password': Strings.auth.passwordTooShort,
  'auth/network-request-failed': Strings.errors.network,
  'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.',

  // Firestore errors
  'permission-denied': Strings.errors.unauthorized,
  'unavailable': Strings.errors.network,
  'not-found': Strings.errors.notFound,

  // Default
  default: Strings.errors.generic,
};

/**
 * Parsed error object
 * @typedef {Object} ParsedError
 * @property {string} type - Error type from ErrorTypes
 * @property {string} code - Original error code
 * @property {string} message - User-friendly message
 * @property {string} technicalMessage - Technical/developer message
 * @property {boolean} isRetryable - Whether the operation can be retried
 */

/**
 * Parses an error and returns a standardized error object
 * @param {Error|any} error - The error to parse
 * @returns {ParsedError} Parsed error object
 */
export const parseError = (error) => {
  // Handle null/undefined
  if (!error) {
    return {
      type: ErrorTypes.UNKNOWN,
      code: 'unknown',
      message: userMessages.default,
      technicalMessage: 'Unknown error occurred',
      isRetryable: false,
    };
  }

  // Get error code
  const code = error.code || error.message || 'unknown';

  // Determine error type
  const type = firebaseErrorMapping[code] || ErrorTypes.UNKNOWN;

  // Get user-friendly message
  const message = userMessages[code] || userMessages.default;

  // Determine if retryable
  const isRetryable = [
    ErrorTypes.NETWORK,
    'auth/too-many-requests',
    'unavailable',
    'deadline-exceeded',
  ].includes(type) || [
    'auth/too-many-requests',
    'unavailable',
    'deadline-exceeded',
  ].includes(code);

  return {
    type,
    code,
    message,
    technicalMessage: error.message || String(error),
    isRetryable,
  };
};

/**
 * Logs an error with context for debugging
 * @param {string} context - Where the error occurred (e.g., 'TransactionService.add')
 * @param {Error|any} error - The error object
 * @param {Object} [metadata] - Additional context data
 */
export const logError = (context, error, metadata = {}) => {
  const parsedError = parseError(error);

  // In development, log detailed error
  if (__DEV__) {
    console.error(`[${context}] Error:`, {
      ...parsedError,
      metadata,
      originalError: error,
    });
  } else {
    // In production, log minimal info (would integrate with Crashlytics here)
    console.error(`[${context}] ${parsedError.code}: ${parsedError.technicalMessage}`);
  }

  // TODO: In production, send to Crashlytics
  // crashlytics().recordError(error, context);
};

/**
 * Handles an error and returns user-friendly message
 * @param {string} context - Where the error occurred
 * @param {Error|any} error - The error object
 * @param {Object} [options] - Options
 * @param {Object} [options.metadata] - Additional context data
 * @param {boolean} [options.silent=false] - Don't log to console
 * @returns {ParsedError} Parsed error for UI display
 */
export const handleError = (context, error, options = {}) => {
  const { metadata = {}, silent = false } = options;

  if (!silent) {
    logError(context, error, metadata);
  }

  return parseError(error);
};

/**
 * Creates an error handler for async operations with automatic error handling
 * @param {string} context - Operation context for error logging
 * @returns {function} Async wrapper function
 *
 * @example
 * const safeOperation = withErrorHandler('TransactionService.add');
 * const result = await safeOperation(async () => {
 *   return await addTransaction(data);
 * });
 */
export const withErrorHandler = (context) => {
  return async (asyncFn, options = {}) => {
    try {
      return await asyncFn();
    } catch (error) {
      const parsedError = handleError(context, error, options);
      throw parsedError;
    }
  };
};

/**
 * Checks if error is a network error
 * @param {Error|ParsedError} error - Error to check
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  if (error?.type) {
    return error.type === ErrorTypes.NETWORK;
  }
  return parseError(error).type === ErrorTypes.NETWORK;
};

/**
 * Checks if error is an authentication error
 * @param {Error|ParsedError} error - Error to check
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  if (error?.type) {
    return error.type === ErrorTypes.AUTH;
  }
  return parseError(error).type === ErrorTypes.AUTH;
};

/**
 * Gets appropriate action text for an error
 * @param {ParsedError} parsedError - Parsed error object
 * @returns {string} Action button text
 */
export const getErrorAction = (parsedError) => {
  if (parsedError.isRetryable) {
    return Strings.common.retry;
  }
  if (parsedError.type === ErrorTypes.AUTH) {
    return Strings.auth.signIn;
  }
  return Strings.common.ok;
};

export default {
  ErrorTypes,
  parseError,
  logError,
  handleError,
  withErrorHandler,
  isNetworkError,
  isAuthError,
  getErrorAction,
};
