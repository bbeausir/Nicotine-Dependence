import { Link, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { useAuth } from '@/providers/AuthProvider';
import { getTokens } from '@/theme/tokens';

/**
 * TODO(DATA): Supabase signUp + email verification as needed.
 */
export default function SignUpScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const { __devSetUser } = useAuth();

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Create account
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          TODO(DATA): Sign-up fields. After results, saving should attach onboarding + assessment to
          this user.
        </Text>

        <PrimaryButton
          onPress={() => {
            track(AnalyticsEvents.accountCreatedAfterResults);
            __devSetUser({ id: 'dev-user', email: 'you@example.com' });
            router.replace('/home');
          }}>
          Dev: create account
        </PrimaryButton>

        <Link href="/sign-in" style={styles.link}>
          <Text style={{ color: t.color.accent, fontFamily: t.typeface.uiSemibold }}>
            Already have an account? Sign in
          </Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    gap: 16,
  },
  title: { fontSize: 28 },
  body: { fontSize: 15, lineHeight: 22 },
  link: { marginTop: 8 },
});
