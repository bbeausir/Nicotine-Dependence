import { useTheme } from '@/providers/ThemeProvider';
import type { ColorSchemeName } from '@/theme/tokens';

export function useColorScheme(): ColorSchemeName {
  return useTheme().colorScheme;
}
