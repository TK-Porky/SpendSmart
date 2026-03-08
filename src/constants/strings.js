/**
 * SpendSmart UI Strings
 * Centralized strings for easy localization (i18n preparation)
 * @module constants/strings
 */

const Strings = {
  // App
  app: {
    name: 'SpendSmart',
    tagline: 'Gérez vos finances intelligemment',
  },

  // Common
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    confirm: 'Confirmer',
    back: 'Retour',
    next: 'Suivant',
    done: 'Terminé',
    close: 'Fermer',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    retry: 'Réessayer',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    seeAll: 'Voir tout',
    noData: 'Aucune donnée',
  },

  // Authentication
  auth: {
    signIn: 'Se connecter',
    signUp: "S'inscrire",
    signOut: 'Se déconnecter',
    email: 'Adresse e-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser le mot de passe',
    noAccount: "Vous n'avez pas de compte ?",
    hasAccount: 'Vous avez déjà un compte ?',
    signInTitle: 'Bienvenue !',
    signUpTitle: 'Créer un compte',
    emailRequired: "L'email est requis",
    passwordRequired: 'Le mot de passe est requis',
    invalidEmail: 'Adresse e-mail invalide',
    passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    signInError: 'Erreur de connexion. Vérifiez vos identifiants.',
    signUpError: "Erreur lors de l'inscription.",
  },

  // Navigation
  nav: {
    home: 'Accueil',
    transactions: 'Transactions',
    budgets: 'Budgets',
    statistics: 'Statistiques',
    profile: 'Profil',
    settings: 'Paramètres',
  },

  // Home Screen
  home: {
    title: 'Tableau de bord',
    currentBalance: 'Solde Courant',
    income: 'Revenus',
    expenses: 'Dépenses',
    recentTransactions: 'Transactions récentes',
    noTransactions: 'Aucune transaction récente',
    addFirstTransaction: 'Ajoutez votre première transaction',
  },

  // Transactions
  transactions: {
    title: 'Transactions',
    addTransaction: 'Nouvelle transaction',
    editTransaction: 'Modifier la transaction',
    deleteTransaction: 'Supprimer la transaction',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette transaction ?',
    type: 'Type',
    amount: 'Montant',
    category: 'Catégorie',
    account: 'Compte',
    date: 'Date',
    description: 'Description',
    note: 'Note',
    income: 'Revenu',
    expense: 'Dépense',
    transfer: 'Transfert',
    fromAccount: 'Compte source',
    toAccount: 'Compte destination',
    noTransactions: 'Aucune transaction',
    addFirst: 'Commencez à suivre vos finances',
  },

  // Budgets
  budgets: {
    title: 'Budgets',
    addBudget: 'Nouveau budget',
    editBudget: 'Modifier le budget',
    deleteBudget: 'Supprimer le budget',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce budget ?',
    name: 'Nom du budget',
    amount: 'Montant',
    spent: 'Dépensé',
    remaining: 'Restant',
    frequency: 'Fréquence',
    categories: 'Catégories',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    noBudgets: 'Aucun budget',
    addFirst: 'Créez votre premier budget',
    exceeded: 'Budget dépassé',
    warning: 'Attention au budget',
    onTrack: 'Budget respecté',
  },

  // Statistics
  statistics: {
    title: 'Statistiques',
    overview: 'Vue d\'ensemble',
    byCategory: 'Par catégorie',
    trends: 'Tendances',
    period: 'Période',
    week: 'Semaine',
    month: 'Mois',
    year: 'Année',
    custom: 'Personnalisé',
    totalIncome: 'Total revenus',
    totalExpenses: 'Total dépenses',
    balance: 'Solde',
    noData: 'Pas assez de données pour afficher les statistiques',
  },

  // Profile
  profile: {
    title: 'Profil',
    displayName: 'Nom d\'affichage',
    email: 'E-mail',
    currency: 'Devise',
    notifications: 'Notifications',
    notificationTime: 'Heure de notification',
    enableReminders: 'Activer les rappels',
    budgetAlerts: 'Alertes de budget',
    darkMode: 'Mode sombre',
    language: 'Langue',
    about: 'À propos',
    version: 'Version',
    logout: 'Déconnexion',
    logoutConfirm: 'Êtes-vous sûr de vouloir vous déconnecter ?',
  },

  // Accounts
  accounts: {
    title: 'Comptes',
    addAccount: 'Nouveau compte',
    editAccount: 'Modifier le compte',
    deleteAccount: 'Supprimer le compte',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce compte ?',
    name: 'Nom du compte',
    type: 'Type de compte',
    balance: 'Solde',
    defaultAccount: 'Compte par défaut',
    noAccounts: 'Aucun compte',
    addFirst: 'Ajoutez votre premier compte',
  },

  // Categories
  categories: {
    title: 'Catégories',
    addCategory: 'Nouvelle catégorie',
    editCategory: 'Modifier la catégorie',
    deleteCategory: 'Supprimer la catégorie',
    name: 'Nom de la catégorie',
    type: 'Type',
    icon: 'Icône',
    color: 'Couleur',
    income: 'Revenu',
    expense: 'Dépense',
  },

  // Dates
  dates: {
    today: "Aujourd'hui",
    yesterday: 'Hier',
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois',
    thisYear: 'Cette année',
    selectDate: 'Sélectionner une date',
    startDate: 'Date de début',
    endDate: 'Date de fin',
  },

  // Errors
  errors: {
    generic: 'Une erreur est survenue',
    network: 'Erreur de connexion. Vérifiez votre connexion internet.',
    notFound: 'Élément non trouvé',
    unauthorized: 'Non autorisé',
    validation: 'Veuillez vérifier les champs',
    required: 'Ce champ est requis',
    invalidAmount: 'Montant invalide',
    tryAgain: 'Veuillez réessayer',
  },

  // Success Messages
  success: {
    saved: 'Enregistré avec succès',
    deleted: 'Supprimé avec succès',
    updated: 'Mis à jour avec succès',
    created: 'Créé avec succès',
  },

  // Empty States
  empty: {
    transactions: 'Aucune transaction à afficher',
    budgets: 'Aucun budget créé',
    accounts: 'Aucun compte ajouté',
    statistics: 'Pas de données disponibles',
  },

  // Notifications
  notifications: {
    dailyReminder: "N'oubliez pas d'enregistrer vos transactions !",
    budgetWarning: 'Attention : Vous avez atteint 80% de votre budget',
    budgetExceeded: 'Budget dépassé !',
  },
};

export default Strings;
