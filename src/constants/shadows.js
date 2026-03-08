/**
 * Shadow/Elevation Design Tokens
 * Consistent elevation system for visual hierarchy
 * @module constants/shadows
 */

/**
 * Shadow presets for React Native
 * Includes both iOS shadow properties and Android elevation
 */
export const Shadows = {
  /** No shadow - flat elements */
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  /** Subtle shadow - cards, list items */
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  /** Medium shadow - elevated cards, dropdowns */
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },

  /** Large shadow - modals, overlays */
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default Shadows;
