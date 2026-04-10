/**
 * Design tokens — single source for spacing, type scale, colors, and typefaces.
 */

export type ColorSchemeName = 'light' | 'dark';

export type ThemeTokens = {
  color: {
    background: string;
    /** Subtle gradient top stop (screen vignette) */
    backgroundGradientTop: string;
    /** Soft gold haze for ambient blobs */
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
    background: '#0b0e14',
    backgroundGradientTop: '#121722',
    glowAccent: 'rgba(181, 147, 91, 0.09)',
    surface: '#121820',
    surfaceElevated: '#1a222c',
    textPrimary: '#ffffff',
    textSecondary: '#a8b0bd',
    textMuted: '#7a8494',
    accent: '#b5935b',
    accentMuted: '#7d6540',
    border: '#252d3a',
    danger: '#e85d5d',
  },
  typeface,
  space,
  radius,
  fontSize,
};

const light: ThemeTokens = {
  color: {
    background: '#f6f7f9',
    backgroundGradientTop: '#ffffff',
    glowAccent: 'rgba(37, 99, 235, 0.06)',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    textPrimary: '#12151a',
    textSecondary: '#4a5563',
    textMuted: '#7a8494',
    accent: '#2563eb',
    accentMuted: '#93b4ff',
    border: '#e2e6ec',
    danger: '#dc2626',
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
