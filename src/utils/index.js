/**
 * Utility functions barrel export
 * @module utils
 */

export {
  formatCurrency,
  formatAmountWithSign,
  parseCurrencyString
} from './formatCurrency';

export {
  formatDate,
  formatDateShort,
  formatDateTime,
  formatMonthYear,
  getDateRange
} from './formatDate';

export {
  isValidEmail,
  validatePassword,
  validateAmount,
  validateRequired,
  validateBudget,
  validateTransaction,
  validateAccount,
  sanitizeInput,
} from './validators';

export {
  ErrorTypes,
  parseError,
  logError,
  handleError,
  withErrorHandler,
  isNetworkError,
  isAuthError,
  getErrorAction,
} from './errorHandler';

export {
  rateLimiter,
  withRateLimit,
} from './rateLimiter';

export {
  triggerHaptic,
  hapticPress,
  hapticSuccess,
  hapticError,
  hapticSelection,
  withHaptic,
} from './haptics';
