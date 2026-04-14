import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { useAuth } from '@/providers/AuthProvider';
import { getTokens } from '@/theme/tokens';
import { getSignInValidationError, normalizeEmail } from '@/features/auth/validation';

export default function SignInScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const { signIn, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedEmail = normalizeEmail(email);
  const canSubmit = !isSubmitting;

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>Sign in</Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>Welcome back.</Text>

        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={t.color.textMuted}
          style={[
            styles.input,
            {
              borderColor: t.color.border,
              color: t.color.textPrimary,
              fontFamily: t.typeface.ui,
            },
          ]}
          value={email}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={t.color.textMuted}
          secureTextEntry
          style={[
            styles.input,
            {
              borderColor: t.color.border,
              color: t.color.textPrimary,
              fontFamily: t.typeface.ui,
            },
          ]}
          value={password}
        />

        {submitError ? (
          <Text style={[styles.error, { color: '#ef4444', fontFamily: t.typeface.ui }]}>{submitError}</Text>
        ) : null}
        {authError ? (
          <Text style={[styles.error, { color: '#ef4444', fontFamily: t.typeface.ui }]}>{authError}</Text>
        ) : null}

        <PrimaryButton
          disabled={!canSubmit}
          loading={isSubmitting}
          onPress={() => {
            void (async () => {
              setSubmitError(null);
              const validationError = getSignInValidationError(email, password);
              if (validationError) {
                setSubmitError(validationError);
                return;
              }
              setIsSubmitting(true);
              const result = await signIn(trimmedEmail, password);
              setIsSubmitting(false);
              if (result.error) {
                setSubmitError(result.error);
                return;
              }

              track(AnalyticsEvents.signedIn);
              router.replace('/home');
            })();
          }}>
          Sign in
        </PrimaryButton>

        <Link href="/sign-up" style={styles.link}>
          <Text style={{ color: t.color.accent, fontFamily: t.typeface.uiSemibold }}>Create account</Text>
        </Link>
        <Link href="/forgot-password" style={styles.link}>
          <Text style={{ color: t.color.textMuted, fontFamily: t.typeface.ui }}>Forgot password</Text>
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
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  error: { fontSize: 13, lineHeight: 18 },
  link: { marginTop: 8 },
});
