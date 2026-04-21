import { Redirect, Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getAppRedirect } from '@/app/(app)/routeGuard';
import { useAuth } from '@/providers/AuthProvider';
import { useAssessment } from '@/providers/AssessmentProvider';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

/**
 * Authenticated product shell. TODO(DATA): refine redirects (e.g. deep links, onboarding incomplete).
 */
export default function AppGroupLayout() {
  const { user, isReady } = useAuth();
  const { result, isReady: isAssessmentReady } = useAssessment();
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const redirect = getAppRedirect({
    authReady: isReady,
    assessmentReady: isAssessmentReady,
    hasUser: Boolean(user),
    hasResult: Boolean(result),
  });

  if (!isReady || !isAssessmentReady) {
    return null;
  }

  if (redirect) {
    return <Redirect href={redirect} />;
  }

  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerLeft: ({ tintColor }) => (
          <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
            <Ionicons name="chevron-back" size={24} color={tintColor} />
          </Pressable>
        ),
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings/profile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="settings/notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="settings/privacy" options={{ title: 'Privacy & Data' }} />
    </Stack>
  );
}
