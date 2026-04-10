import type { Theme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { getTokens, type ColorSchemeName } from '@/theme/tokens';

export function getNavigationTheme(scheme: ColorSchemeName | null | undefined): Theme {
  const t = getTokens(scheme);
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: t.color.accent,
      background: t.color.background,
      card: t.color.surface,
      text: t.color.textPrimary,
      border: t.color.border,
      notification: t.color.accent,
    },
  };
}
