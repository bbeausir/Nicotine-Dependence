import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import type { ColorSchemeName } from '@/theme/tokens';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

const STORAGE_KEY = '@theme_preference';

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: 'dark',
  themePreference: 'system',
  setThemePreference: async () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? 'dark';
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemePreferenceState(stored);
      }
    });
  }, []);

  async function setThemePreference(preference: ThemePreference) {
    setThemePreferenceState(preference);
    await AsyncStorage.setItem(STORAGE_KEY, preference);
  }

  const colorScheme: ColorSchemeName =
    themePreference === 'system' ? systemScheme : themePreference;

  return (
    <ThemeContext.Provider value={{ colorScheme, themePreference, setThemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
