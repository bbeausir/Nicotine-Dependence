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
import { getSignUpValidationError, normalizeEmail } from '@/features/auth/validation';

type SignUpPhase = 'form' | 'check_email';

export default function SignUpScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const { signUp, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<SignUpPhase>('form');

  const trimmedEmail = normalizeEmail(email);
  const canSubmit = !isSubmitting;

  if (phase === 'check_email') {
    return (
      <Screen scroll contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
          <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
            Next step
          </Text>
          <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            When email confirmation is required, check your inbox and spam for a link before you can sign in.
            If it is not required for your account, you can try signing in below.
          </Text>
          <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            Use the same email and password you entered here once you have access.
          </Text>
          <Link href="/sign-in" style={styles.link}>
            <Text style={{ color: t.color.accent, fontFamily: t.typeface.uiSemibold }}>Back to sign in</Text>
          </Link>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Create account
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Create your account to save your progress.
        </Text>

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
          autoComplete="new-password"
          onChangeText={setPassword}
          placeholder="Password (8+ characters for this form)"
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
        <TextInput
          autoCapitalize="none"
          autoComplete="new-password"
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
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
          value={confirmPassword}
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
              const validationError = getSignUpValidationError(email, password, confirmPassword);
              if (validationError) {
                setSubmitError(validationError);
                return;
              }

              setIsSubmitting(true);
              const result = await signUp(trimmedEmail, password);
              setIsSubmitting(false);
              if (result.status === 'error') {
                setSubmitError(result.error);
                return;
              }
              if (result.status === 'awaiting_confirmation') {
                track(AnalyticsEvents.accountCreatedAfterResults);
                setPhase('check_email');
                return;
              }

              track(AnalyticsEvents.accountCreatedAfterResults);
              track(AnalyticsEvents.signedIn);
              router.replace('/home');
            })();
          }}>
          Create account
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
