/**
 * Date formatting utilities for SpendSmart
 * @module utils/formatDate
 */

/**
 * Formats a date with various format options
 * @param {Date|string|number|object} date - The date to format (Date object, ISO string, timestamp, or Firestore Timestamp)
 * @param {string} [format='relative'] - Format type: 'relative', 'short', 'full', 'datetime'
 * @param {string} [locale='fr-FR'] - The locale for formatting
 * @returns {string} Formatted date string
 * @example
 * formatDate(new Date()) // "Aujourd'hui"
 * formatDate(new Date(), 'short') // "8 mars"
 * formatDate(new Date(), 'full') // "8 mars 2026"
 * formatDate(new Date(), 'datetime') // "8 mars 2026, 14:30"
 */
export const formatDate = (date, format = 'relative', locale = 'fr-FR') => {
  if (!date) return '';

  // Handle Firestore Timestamp objects
  let transactionDate;
  if (date && typeof date.toDate === 'function') {
    transactionDate = date.toDate();
  } else {
    transactionDate = new Date(date);
  }

  // Validate date
  if (isNaN(transactionDate.getTime())) {
    return '';
  }

  // Handle different format types
  switch (format) {
    case 'short':
      return transactionDate.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
      });

    case 'full':
      return transactionDate.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

    case 'datetime':
      return transactionDate.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'relative':
    default:
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Reset time for comparison
      const dateOnly = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (dateOnly.getTime() === todayOnly.getTime()) {
        return "Aujourd'hui";
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Hier';
      } else {
        return transactionDate.toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
  }
};

/**
 * Formats a date as short format (e.g., "2 mars")
 * @param {Date|string|number|object} date - The date to format
 * @param {string} [locale='fr-FR'] - The locale for formatting
 * @returns {string} Short formatted date string
 */
export const formatDateShort = (date, locale = 'fr-FR') => {
  if (!date) return '';

  let dateObj;
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  } else {
    dateObj = new Date(date);
  }

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Formats a date with time
 * @param {Date|string|number|object} date - The date to format
 * @param {string} [locale='fr-FR'] - The locale for formatting
 * @returns {string} Date and time string
 */
export const formatDateTime = (date, locale = 'fr-FR') => {
  if (!date) return '';

  let dateObj;
  if (date && typeof date.toDate === 'function') {
    dateObj = date.toDate();
  } else {
    dateObj = new Date(date);
  }

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Gets the start and end dates for a given period
 * @param {'week'|'month'|'year'} period - The period type
 * @param {Date} [referenceDate=new Date()] - Reference date
 * @returns {{start: Date, end: Date}} Start and end dates
 */
export const getDateRange = (period, referenceDate = new Date()) => {
  const start = new Date(referenceDate);
  const end = new Date(referenceDate);

  switch (period) {
    case 'week':
      const dayOfWeek = start.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      start.setDate(start.getDate() - diffToMonday);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;

    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;

    default:
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

/**
 * Formats a month and year
 * @param {Date|string|number} date - The date
 * @param {string} [locale='fr-FR'] - The locale
 * @returns {string} Month and year string (e.g., "Mars 2026")
 */
export const formatMonthYear = (date, locale = 'fr-FR') => {
  if (!date) return '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
};

export default formatDate;
