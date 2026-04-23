import { Redirect, Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getAppRedirect } from '@/app/(app)/routeGuard';
import { useAuth } from '@/providers/AuthProvider';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

/**
 * Authenticated product shell. Assessment completion is not required —
 * onboarding is a pre-auth marketing flow, not a post-auth gate.
 */
export default function AppGroupLayout() {
  const { user, isReady } = useAuth();
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const redirect = getAppRedirect({
    authReady: isReady,
    hasUser: Boolean(user),
  });

  if (!isReady) {
    return null;
  }

  if (redirect) {
    return <Redirect href={redirect} />;
  }

  return (
    <Stack
      screenOptions={{
        headerLeft: ({ tintColor }) => (
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back" size={24} color={tintColor} />
          </Pressable>
        ),
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings/profile" options={{ headerShown: false }} />
      <Stack.Screen name="settings/notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="settings/privacy" options={{ title: 'Privacy & Data' }} />
      <Stack.Screen name="insights" options={{ title: 'Insights Library' }} />
      <Stack.Screen name="myths" options={{ title: 'Myth Dissolutions' }} />
      <Stack.Screen name="craving-wave" options={{ title: 'Craving Wave Timer' }} />
      <Stack.Screen name="grounding" options={{ title: '5-4-3-2-1 Grounding' }} />
      <Stack.Screen name="pattern-break" options={{ title: 'Pattern Break' }} />
      <Stack.Screen name="course-module" options={{ title: 'Module 2: The Illusion of Relief' }} />
    </Stack>
  );
}
