/**
 * SpendSmart Application Configuration
 * @module constants/config
 */

const Config = {
  // App Information
  app: {
    name: 'SpendSmart',
    version: '0.0.1',
    bundleId: 'com.spendsmart.app',
  },

  // Default Settings
  defaults: {
    currency: 'XOF',
    locale: 'fr-FR',
    dateFormat: 'dd/MM/yyyy',
    firstDayOfWeek: 1, // Monday
    notificationHour: 20,
    notificationMinute: 0,
    summaryPeriod: 'monthly', // 'daily' | 'weekly' | 'monthly'
  },

  // Supported Currencies
  currencies: [
    { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'FCFA' },
    { code: 'XAF', name: 'Franc CFA (BEAC)', symbol: 'FCFA' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH' },
    { code: 'TND', name: 'Dinar Tunisien', symbol: 'DT' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  ],

  // Account Types
  accountTypes: [
    { id: 'checking', name: 'Compte Courant', icon: 'bank' },
    { id: 'savings', name: 'Compte Épargne', icon: 'piggy-bank' },
    { id: 'cash', name: 'Espèces', icon: 'cash' },
    { id: 'credit_card', name: 'Carte de Crédit', icon: 'credit-card' },
    { id: 'investment', name: 'Investissement', icon: 'chart-line' },
    { id: 'mobile_money', name: 'Mobile Money', icon: 'cellphone' },
    { id: 'other', name: 'Autre', icon: 'wallet' },
  ],

  // Budget Frequencies
  budgetFrequencies: [
    { id: 'weekly', name: 'Hebdomadaire' },
    { id: 'monthly', name: 'Mensuel' },
    { id: 'yearly', name: 'Annuel' },
    { id: 'custom', name: 'Personnalisé' },
  ],

  // Transaction Types
  transactionTypes: [
    { id: 'income', name: 'Revenu', icon: 'arrow-down-circle' },
    { id: 'expense', name: 'Dépense', icon: 'arrow-up-circle' },
    { id: 'transfer', name: 'Transfert', icon: 'swap-horizontal' },
  ],

  // Pagination
  pagination: {
    transactionsPerPage: 20,
    defaultLimit: 10,
  },

  // Validation Rules
  validation: {
    minPasswordLength: 6,
    maxTransactionAmount: 999999999,
    maxDescriptionLength: 500,
    maxNameLength: 100,
  },

  // Budget Alert Thresholds
  budgetAlerts: {
    warningThreshold: 0.8,  // 80%
    criticalThreshold: 1.0, // 100%
  },

  // Animation Durations (ms)
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // API/Firebase settings (placeholders for environment config)
  firebase: {
    // These should be loaded from environment variables in production
    collectionNames: {
      users: 'users',
      transactions: 'transactions',
      accounts: 'accounts',
      budgets: 'budgets',
      categories: 'categories',
    },
  },
};

export default Config;
