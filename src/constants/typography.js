/**
 * Typography Design Tokens
 * Consistent text styles throughout the app
 * Supports dynamic font scaling for accessibility
 * @module constants/typography
 */

/**
 * Dynamic font scaling settings
 * allowFontScaling: enables system font scaling
 * maxFontSizeMultiplier: limits scaling to prevent layout breaks (1.5 = 150%)
 */
export const FontScaling = {
  allowFontScaling: true,
  maxFontSizeMultiplier: 1.5,
};

/** Font size scale */
export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
};

/** Font weight scale */
export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

/** Line height multipliers */
export const LineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Predefined text styles
 * Usage: StyleSheet.create({ title: Typography.h1 })
 */
export const Typography = {
  /** Large display text - 28px bold */
  h1: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xxxl * LineHeight.tight,
  },
  /** Screen titles - 24px bold */
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xxl * LineHeight.tight,
  },
  /** Section headers - 20px semibold */
  h3: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.xl * LineHeight.tight,
  },
  /** Card titles - 18px semibold */
  h4: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.lg * LineHeight.normal,
  },
  /** Body text - 16px regular */
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  /** Body bold - 16px semibold */
  bodyBold: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  /** Caption/secondary text - 14px regular */
  caption: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
  },
  /** Small/meta text - 12px regular */
  small: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.xs * LineHeight.normal,
  },
  /** Button text - 16px semibold */
  button: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  /** Small button text - 14px semibold */
  buttonSmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
};

export default Typography;
