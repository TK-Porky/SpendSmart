/**
 * SpendSmart Color Palette
 * Centralized color definitions for consistent theming
 * @module constants/colors
 */

const Colors = {
  // Primary Brand Colors
  primary: {
    main: '#6A1B9A',      // Purple - primary actions
    dark: '#4A148C',      // Dark purple - headers, emphasis
    light: '#9C4DCC',     // Light purple - hover states
  },

  // Secondary/Accent Colors
  secondary: {
    main: '#FF4081',      // Pink - accents, FAB
    dark: '#E00040',      // Dark pink - pressed states
    light: '#FF80AB',     // Light pink - highlights
  },

  // Gradient Colors
  gradients: {
    primary: ['#4730CA', '#231864'],      // Balance card gradient
    secondary: ['#6A1B9A', '#4A148C'],    // Alternative gradient
    blue: ['#42A5F5', '#1976D2'],         // Info gradient
    success: ['#66BB6A', '#388E3C'],      // Success gradient
  },

  // Semantic Colors
  success: {
    main: '#66BB6A',      // Green - income, success
    dark: '#388E3C',      // Dark green
    light: '#A5D6A7',     // Light green
  },

  error: {
    main: '#EF5350',      // Red - expenses, errors
    dark: '#D32F2F',      // Dark red
    light: '#EF9A9A',     // Light red
  },

  warning: {
    main: '#FFA726',      // Orange - warnings
    dark: '#F57C00',      // Dark orange
    light: '#FFCC80',     // Light orange
  },

  info: {
    main: '#42A5F5',      // Blue - info
    dark: '#1976D2',      // Dark blue
    light: '#90CAF9',     // Light blue
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',       // Main background
    secondary: '#F8F8F8',     // Secondary background
    tertiary: '#F0F0F0',      // Tertiary background
    card: '#FFFFFF',          // Card background
    cardAlt: '#F9F9F9',       // Alternative card background
    input: '#F5F5F5',         // Input field background
  },

  // Text Colors
  text: {
    primary: '#212121',       // Primary text
    secondary: '#757575',     // Secondary text
    tertiary: '#9E9E9E',      // Tertiary/muted text
    inverse: '#FFFFFF',       // Text on dark backgrounds
    disabled: '#BDBDBD',      // Disabled text
    link: '#1976D2',          // Link text
  },

  // Border Colors
  border: {
    light: '#E0E0E0',         // Light borders
    main: '#BDBDBD',          // Main borders
    dark: '#9E9E9E',          // Dark borders
    focus: '#6A1B9A',         // Focus state borders
  },

  // Shadow Color
  shadow: '#000000',

  // Icon Colors
  icon: {
    default: '#555555',       // Default icon color
    light: '#FFFFFF',         // Icons on dark backgrounds
    muted: '#9E9E9E',         // Muted icons
  },

  // Transaction Type Colors
  transaction: {
    income: '#66BB6A',        // Income green
    expense: '#EF5350',       // Expense red
    transfer: '#42A5F5',      // Transfer blue
  },

  // Status Colors
  status: {
    active: '#66BB6A',
    inactive: '#9E9E9E',
    pending: '#FFA726',
  },

  // Chart Colors
  chart: {
    palette: [
      '#6A1B9A',
      '#42A5F5',
      '#66BB6A',
      '#FF4081',
      '#FFA726',
      '#26C6DA',
      '#AB47BC',
      '#7E57C2',
    ],
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Transparent
  transparent: 'transparent',
};

export default Colors;
