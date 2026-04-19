import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FormError } from '@/components/ui/FormError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { friendlyAuthError } from '@/features/auth/errorMessages';
import { getUpdatePasswordValidationError } from '@/features/auth/validation';
import { useAuth } from '@/providers/AuthProvider';
import { getTokens } from '@/theme/tokens';

export default function UpdatePasswordScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    const validationError = getUpdatePasswordValidationError(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError(friendlyAuthError(result.error));
      return;
    }

    router.replace('/home');
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Set a new password
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Choose a password of at least 8 characters.
        </Text>

        <TextInput
          autoCapitalize="none"
          autoComplete="new-password"
          editable={!loading}
          onChangeText={(v) => {
            setPassword(v);
            if (error) setError(null);
          }}
          placeholder="New password"
          placeholderTextColor={t.color.textMuted}
          secureTextEntry
          style={[
            styles.input,
            {
              borderColor: error ? t.color.danger : t.color.border,
              color: t.color.textPrimary,
              fontFamily: t.typeface.ui,
            },
          ]}
          value={password}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="new-password"
          editable={!loading}
          onChangeText={(v) => {
            setConfirmPassword(v);
            if (error) setError(null);
          }}
          onSubmitEditing={() => {
            void handleSubmit();
          }}
          placeholder="Confirm new password"
          placeholderTextColor={t.color.textMuted}
          secureTextEntry
          style={[
            styles.input,
            {
              borderColor: error ? t.color.danger : t.color.border,
              color: t.color.textPrimary,
              fontFamily: t.typeface.ui,
            },
          ]}
          value={confirmPassword}
        />

        <FormError message={error} />

        <PrimaryButton disabled={loading} loading={loading} onPress={() => void handleSubmit()}>
          Update password
        </PrimaryButton>
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
  title: { fontSize: 28 },
  body: { fontSize: 15, lineHeight: 22 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
});
