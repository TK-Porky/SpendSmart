/**
 * SpendSmart Color Palette
 * Minimalist design system with Modern Teal as primary brand color
 * @module constants/colors
 */

const Colors = {
  // Primary Brand - Modern Teal
  primary: {
    main: '#0D9488',      // Teal-600 - Primary actions, buttons
    dark: '#0F766E',      // Teal-700 - Pressed states, emphasis
    light: '#14B8A6',     // Teal-500 - Hover states
    subtle: '#CCFBF1',    // Teal-100 - Light backgrounds, tags
  },

  // Semantic Colors (flat format for direct use)
  success: '#22C55E',     // Green-500 - Income, success states
  error: '#EF4444',       // Red-500 - Expenses, errors
  warning: '#F59E0B',     // Amber-500 - Warnings, alerts
  info: '#3B82F6',        // Blue-500 - Info states

  // Neutral Scale (replaces all hardcoded grays)
  neutral: {
    0: '#FFFFFF',         // Pure white
    50: '#F9FAFB',        // Background secondary
    100: '#F3F4F6',       // Input backgrounds
    200: '#E5E7EB',       // Borders, dividers
    300: '#D1D5DB',       // Disabled elements
    400: '#9CA3AF',       // Placeholder text
    500: '#6B7280',       // Secondary text
    600: '#4B5563',       // Body text
    700: '#374151',       // Primary text
    800: '#1F2937',       // Headings
    900: '#111827',       // Emphasis
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    card: '#FFFFFF',
    input: '#F3F4F6',
  },

  // Text Colors (mapped from neutral for convenience)
  text: {
    primary: '#374151',     // neutral.700
    secondary: '#6B7280',   // neutral.500
    tertiary: '#9CA3AF',    // neutral.400
    inverse: '#FFFFFF',     // neutral.0
    disabled: '#D1D5DB',    // neutral.300
  },

  // Border Colors
  border: {
    light: '#E5E7EB',       // neutral.200
    main: '#D1D5DB',        // neutral.300
    focus: '#0D9488',       // primary.main
  },

  // Transaction Type Colors
  transaction: {
    income: '#22C55E',      // success
    expense: '#EF4444',     // error
    transfer: '#0D9488',    // primary.main
  },

  // Chart Colors
  chart: {
    palette: [
      '#0D9488',  // Teal (primary)
      '#3B82F6',  // Blue
      '#22C55E',  // Green
      '#F59E0B',  // Amber
      '#EF4444',  // Red
      '#8B5CF6',  // Violet
      '#EC4899',  // Pink
      '#06B6D4',  // Cyan
    ],
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  transparent: 'transparent',

  // Shadow Color
  shadow: '#000000',
};

export default Colors;
