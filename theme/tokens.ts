/**
 * Design tokens — single source for spacing, type scale, colors, and typefaces.
 */

export type ColorSchemeName = 'light' | 'dark';

export type ThemeTokens = {
  color: {
    background: string;
    /** Subtle gradient top stop (screen vignette) */
    backgroundGradientTop: string;
    /** Ambient glow for blob decorations */
    glowAccent: string;
    surface: string;
    surfaceElevated: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentMuted: string;
    border: string;
    danger: string;
    /** Per-section accent colors for the Resources hub */
    sectionAccent: {
      understand: string;
      shift: string;
      deepen: string;
    };
  };
  typeface: {
    display: string;
    ui: string;
    uiMedium: string;
    uiSemibold: string;
  };
  space: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
};

const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

const radius = { sm: 8, md: 12, lg: 16 } as const;

const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

/** Loaded in `app/_layout.tsx` via `@expo-google-fonts/*` */
const typeface = {
  display: 'PlayfairDisplay_600SemiBold',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemibold: 'Inter_600SemiBold',
} as const;

const dark: ThemeTokens = {
  color: {
    background: '#0a0c14',
    backgroundGradientTop: '#10141f',
    glowAccent: 'rgba(108, 99, 255, 0.08)',
    surface: '#111520',
    surfaceElevated: '#181d2e',
    textPrimary: '#ffffff',
    textSecondary: '#a8b0bd',
    textMuted: '#7a8494',
    accent: '#9c8fff',
    accentMuted: '#5c5490',
    border: '#222840',
    danger: '#e85d5d',
    sectionAccent: {
      understand: '#a78bfa',
      shift: '#2dd4bf',
      deepen: '#60a5fa',
    },
  },
  typeface,
  space,
  radius,
  fontSize,
};

const light: ThemeTokens = {
  color: {
    background: '#f4f5f8',
    backgroundGradientTop: '#ffffff',
    glowAccent: 'rgba(108, 99, 255, 0.05)',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    textPrimary: '#12151a',
    textSecondary: '#4a5563',
    textMuted: '#7a8494',
    accent: '#6c63ff',
    accentMuted: '#c5c0ff',
    border: '#e2e6ec',
    danger: '#dc2626',
    sectionAccent: {
      understand: '#7c3aed',
      shift: '#0d9488',
      deepen: '#2563eb',
    },
  },
  typeface,
  space,
  radius,
  fontSize,
};

const byScheme: Record<ColorSchemeName, ThemeTokens> = {
  dark,
  light,
};

export function getTokens(scheme: ColorSchemeName | null | undefined): ThemeTokens {
  return byScheme[scheme ?? 'dark'] ?? dark;
}
