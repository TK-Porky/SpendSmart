/**
 * Currency formatting utilities for SpendSmart
 * @module utils/formatCurrency
 */

/**
 * Formats a number as currency string
 * @param {number} amount - The amount to format
 * @param {string} [currency='XOF'] - The currency code (ISO 4217)
 * @param {string} [locale='fr-FR'] - The locale for formatting
 * @returns {string} Formatted currency string
 * @example
 * formatCurrency(1500) // "1 500 XOF"
 * formatCurrency(1500, 'EUR') // "1 500,00 €"
 */
export const formatCurrency = (amount, currency = 'XOF', locale = 'fr-FR') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return formatCurrency(0, currency, locale);
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats amount with sign prefix based on transaction type
 * @param {number} amount - The amount to format
 * @param {'income'|'expense'|'transfer'} type - Transaction type
 * @param {string} [currency='XOF'] - The currency code
 * @returns {string} Formatted currency string with sign
 * @example
 * formatAmountWithSign(1500, 'income') // "+1 500 XOF"
 * formatAmountWithSign(1500, 'expense') // "-1 500 XOF"
 */
export const formatAmountWithSign = (amount, type, currency = 'XOF') => {
  const formattedAmount = formatCurrency(Math.abs(amount), currency);

  switch (type) {
    case 'income':
      return `+${formattedAmount}`;
    case 'expense':
      return `-${formattedAmount}`;
    case 'transfer':
      return formattedAmount;
    default:
      return formattedAmount;
  }
};

/**
 * Parses a currency string back to number
 * @param {string} currencyString - The formatted currency string
 * @returns {number} The numeric value
 */
export const parseCurrencyString = (currencyString) => {
  if (!currencyString) return 0;

  // Remove all non-numeric characters except decimal separators
  const cleaned = currencyString
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');

  return parseFloat(cleaned) || 0;
};

export default formatCurrency;
