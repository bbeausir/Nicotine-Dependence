import { Redirect, Stack } from 'expo-router';

import { getAppRedirect } from '@/app/(app)/routeGuard';
import { useAuth } from '@/providers/AuthProvider';
import { useAssessment } from '@/providers/AssessmentProvider';

/**
 * Authenticated product shell. TODO(DATA): refine redirects (e.g. deep links, onboarding incomplete).
 */
export default function AppGroupLayout() {
  const { user, isReady } = useAuth();
  const { result, isReady: isAssessmentReady } = useAssessment();
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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings/profile" options={{ title: 'Edit Profile' }} />
      <Stack.Screen name="settings/notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="settings/privacy" options={{ title: 'Privacy & Data' }} />
    </Stack>
  );
}
