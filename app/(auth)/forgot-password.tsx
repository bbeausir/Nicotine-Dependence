import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FormError } from '@/components/ui/FormError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { friendlyAuthError } from '@/features/auth/errorMessages';
import { getForgotPasswordValidationError, normalizeEmail } from '@/features/auth/validation';
import { useAuth } from '@/providers/AuthProvider';
import { getTokens } from '@/theme/tokens';

export default function ForgotPasswordScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = normalizeEmail(email);

    setError(null);
    setSuccess(null);

    const validationError = getForgotPasswordValidationError(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const result = await resetPassword(normalizedEmail);
    setLoading(false);

    if (result.error) {
      setError(friendlyAuthError(result.error));
      return;
    }

    setSuccess('If an account exists for this email, a reset link has been sent.');
  };

  const clearForm = () => {
    if (loading) {
      return;
    }
    setEmail('');
    setError(null);
    setSuccess(null);
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Forgot password
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Enter the email tied to your account and we&apos;ll send you a reset link.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: t.color.textSecondary, fontFamily: t.typeface.uiSemibold }]}>
            Email
          </Text>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!loading}
            inputMode="email"
            keyboardType="email-address"
            onChangeText={(value) => {
              setEmail(value);
              if (error) {
                setError(null);
              }
              if (success) {
                setSuccess(null);
              }
            }}
            onSubmitEditing={() => {
              void handleSubmit();
            }}
            placeholder="you@example.com"
            placeholderTextColor={t.color.textMuted}
            style={[
              styles.input,
              {
                borderColor: error ? t.color.danger : t.color.border,
                color: t.color.textPrimary,
                fontFamily: t.typeface.ui,
              },
            ]}
            value={email}
          />
        </View>

        <FormError message={error} />

        {success ? (
          <Text style={[styles.message, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            {success}
          </Text>
        ) : null}

        <PrimaryButton onPress={() => void handleSubmit()} disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </PrimaryButton>

        <Pressable disabled={loading} onPress={clearForm}>
          <Text style={[styles.secondaryAction, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
            Clear
          </Text>
        </Pressable>
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
    gap: 14,
  },
  fieldGroup: {
    gap: 8,
  },
  title: { fontSize: 28 },
  body: { fontSize: 15, lineHeight: 22 },
  label: { fontSize: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryAction: {
    fontSize: 14,
    textAlign: 'center',
  },
});
