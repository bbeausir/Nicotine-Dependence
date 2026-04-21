import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AssessmentProvider } from '@/providers/AssessmentProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { getNavigationTheme } from '@/theme/navigationTheme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(welcome)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AssessmentProvider>
              <NavigationWrapper />
            </AssessmentProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  const { SQLiteProvider } = require('expo-sqlite');

  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="nicotine.db">
        <ThemeProvider>
          <AuthProvider>
            <AssessmentProvider>
              <NavigationWrapper />
            </AssessmentProvider>
          </AuthProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}

function NavigationWrapper() {
  const colorScheme = useColorScheme();

  return (
    <NavigationThemeProvider value={getNavigationTheme(colorScheme)}>
      <Stack>
        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="results" options={{ title: 'Your results' }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}
