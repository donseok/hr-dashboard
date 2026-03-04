import type { Config } from 'tailwindcss';
import { colors } from '@hr-dashboard/design-tokens';
import { typography } from '@hr-dashboard/design-tokens';
import { spacing } from '@hr-dashboard/design-tokens';
import { shadows } from '@hr-dashboard/design-tokens';
import { breakpoints } from '@hr-dashboard/design-tokens';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        signal: colors.signal,
        neutral: colors.neutral,
      },
      fontFamily: {
        sans: [typography.fontFamily.sans, typography.fontFamily.en, 'sans-serif'],
        mono: [typography.fontFamily.mono, 'monospace'],
        en: [typography.fontFamily.en, 'sans-serif'],
      },
      fontSize: {
        xs: [`${typography.fontSize.xs}px`, { lineHeight: `${typography.lineHeight.normal}` }],
        sm: [`${typography.fontSize.sm}px`, { lineHeight: `${typography.lineHeight.normal}` }],
        base: [`${typography.fontSize.base}px`, { lineHeight: `${typography.lineHeight.normal}` }],
        lg: [`${typography.fontSize.lg}px`, { lineHeight: `${typography.lineHeight.normal}` }],
        xl: [`${typography.fontSize.xl}px`, { lineHeight: `${typography.lineHeight.tight}` }],
        '2xl': [`${typography.fontSize['2xl']}px`, { lineHeight: `${typography.lineHeight.tight}` }],
        '3xl': [`${typography.fontSize['3xl']}px`, { lineHeight: `${typography.lineHeight.tight}` }],
        '4xl': [`${typography.fontSize['4xl']}px`, { lineHeight: `${typography.lineHeight.tight}` }],
      },
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([key, value]) => [key, `${value}px`])
      ),
      boxShadow: shadows,
      screens: {
        mobile: `${breakpoints.mobile}px`,
        tablet: `${breakpoints.tablet}px`,
        desktop: `${breakpoints.desktop}px`,
        wide: `${breakpoints.wide}px`,
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
