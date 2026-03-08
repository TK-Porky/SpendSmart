/**
 * Spacing Design Tokens
 * 8-point grid system for consistent spacing throughout the app
 * @module constants/spacing
 */

export const Spacing = {
  /** 4px - Tight spacing (icons, small gaps) */
  xs: 4,
  /** 8px - Small gaps (between related elements) */
  sm: 8,
  /** 16px - Standard spacing (card padding, input padding) */
  md: 16,
  /** 24px - Section gaps (between cards, sections) */
  lg: 24,
  /** 32px - Large sections (screen padding top/bottom) */
  xl: 32,
  /** 48px - Major sections */
  xxl: 48,
};

/** Common padding presets */
export const Padding = {
  card: Spacing.md,
  screen: Spacing.md,
  section: Spacing.lg,
  input: Spacing.md,
};

/** Common margin presets */
export const Margin = {
  cardVertical: Spacing.sm,
  cardHorizontal: Spacing.md,
  sectionVertical: Spacing.lg,
};

export default Spacing;
