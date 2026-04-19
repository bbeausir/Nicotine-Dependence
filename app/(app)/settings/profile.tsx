import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { FormError } from '@/components/ui/FormError';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { useProfile } from '@/features/profile/useProfile';
import { parseDailyCost, parseDateInput } from '@/features/profile/profileFormHelpers';
import { getTokens } from '@/theme/tokens';

export default function ProfileSettingsScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const router = useRouter();
  const { profile, isLoading, error, save } = useProfile();

  const [quitDateInput, setQuitDateInput] = useState('');
  const [dailyCostInput, setDailyCostInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setQuitDateInput(profile.quit_date ?? '');
      setDailyCostInput(profile.daily_cost !== null ? String(profile.daily_cost) : '');
    }
  }, [profile]);

  const handleSave = () => {
    void (async () => {
      setSubmitError(null);
      const dateParse = parseDateInput(quitDateInput);
      if (dateParse.error) {
        setSubmitError(dateParse.error);
        return;
      }
      const costParse = parseDailyCost(dailyCostInput);
      if (costParse.error) {
        setSubmitError(costParse.error);
        return;
      }

      setIsSubmitting(true);
      const { error: saveError } = await save({
        quit_date: dateParse.value,
        daily_cost: costParse.value,
      });
      setIsSubmitting(false);
      if (saveError) {
        setSubmitError(saveError);
        return;
      }
      router.back();
    })();
  };

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Edit profile
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Set your quit date when you’re ready, and tell us your daily nicotine spend so we can
          show how much you’ve saved.
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={t.color.textMuted} />
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: t.color.textSecondary, fontFamily: t.typeface.uiMedium }]}>
              Quit date
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numbers-and-punctuation"
              onChangeText={(v) => { setQuitDateInput(v); setSubmitError(null); }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={t.color.textMuted}
              style={[
                styles.input,
                {
                  borderColor: submitError ? t.color.danger : t.color.border,
                  color: t.color.textPrimary,
                  fontFamily: t.typeface.ui,
                },
              ]}
              value={quitDateInput}
            />
            <Text style={[styles.hint, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
              Leave blank if you haven’t picked one yet. Future dates show a countdown.
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: t.color.textSecondary, fontFamily: t.typeface.uiMedium }]}>
              Daily spend ($)
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="decimal-pad"
              onChangeText={(v) => { setDailyCostInput(v); setSubmitError(null); }}
              placeholder="e.g. 12.50"
              placeholderTextColor={t.color.textMuted}
              style={[
                styles.input,
                {
                  borderColor: submitError ? t.color.danger : t.color.border,
                  color: t.color.textPrimary,
                  fontFamily: t.typeface.ui,
                },
              ]}
              value={dailyCostInput}
            />
          </View>

          <FormError message={submitError ?? error} />

          <PrimaryButton onPress={handleSave} loading={isSubmitting} disabled={isSubmitting}>
            Save
          </PrimaryButton>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  textBlock: { gap: 12 },
  title: { fontSize: 28, lineHeight: 34 },
  body: { fontSize: 16, lineHeight: 24 },
  loadingRow: { paddingVertical: 24, alignItems: 'center' },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 20,
    gap: 16,
  },
  field: { gap: 6 },
  label: { fontSize: 13 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  hint: { fontSize: 12, lineHeight: 16 },
});
