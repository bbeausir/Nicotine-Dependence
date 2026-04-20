import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  useForm,
  useWatch,
  type Control,
  type DeepPartial,
  type FieldPath,
} from 'react-hook-form';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AssessmentProgressRing } from '@/components/ui/AssessmentProgressRing';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { assessmentCopy } from '@/features/onboarding/content/assessmentCopy';
import { useAssessmentDraft } from '@/features/onboarding/hooks/useAssessmentDraft';
import {
  defaultOnboardingAnswers,
  onboardingAnswersSchema,
  type OnboardingAnswers,
  type OnboardingDraftValues,
} from '@/features/onboarding/schema/onboardingAnswers';
import {
  getAssessmentSequence,
  getFirstIncompleteQuestionIndex,
  validateCurrentField,
} from '@/features/onboarding/schema/stepConfig';
import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { useAssessment } from '@/providers/AssessmentProvider';
import { getTokens } from '@/theme/tokens';
import type { ZodError } from 'zod';

function applyZodErrors(
  setError: (name: FieldPath<OnboardingAnswers>, err: { message: string }) => void,
  zerr: ZodError,
) {
  for (const issue of zerr.issues) {
    const key = issue.path[0];
    if (typeof key === 'string') {
      setError(key as FieldPath<OnboardingAnswers>, { message: issue.message });
    }
  }
}

function OptionRadio({ selected, accent }: { selected: boolean; accent: string }) {
  return (
    <View style={[styles.radioOuter, { borderColor: accent }]}>
      {selected ? <View style={[styles.radioInner, { backgroundColor: accent }]} /> : null}
    </View>
  );
}

export function OnboardingAssessment() {
  const t = getTokens(useColorScheme());
  const router = useRouter();
  const { setPendingAnswers } = useAssessment();
  const [questionIndex, setQuestionIndex] = useState(0);

  const {
    control,
    setValue,
    setError,
    clearErrors,
    getValues,
    reset,
    formState: { errors },
  } = useForm<OnboardingAnswers>({
    defaultValues: defaultOnboardingAnswers() as DeepPartial<OnboardingAnswers>,
  });

  const values = useWatch({ control }) as OnboardingDraftValues;

  const { clearDraft } = useAssessmentDraft(values, reset, (draft) => {
    setQuestionIndex(getFirstIncompleteQuestionIndex(draft));
  });

  const sequence = getAssessmentSequence(values);

  useEffect(() => {
    track(AnalyticsEvents.onboardingStarted);
  }, []);

  useEffect(() => {
    if (values.hasTriedToQuit !== 'yes') {
      setValue('pastRelapseReason', undefined);
    }
  }, [values.hasTriedToQuit, setValue]);

  useEffect(() => {
    setQuestionIndex((qi) => {
      if (sequence.length === 0) return 0;
      return qi >= sequence.length ? sequence.length - 1 : qi;
    });
  }, [sequence.length]);

  const goNext = useCallback(async () => {
    clearErrors();
    const draft = getValues() as OnboardingDraftValues;
    const seq = getAssessmentSequence(draft);
    const idx = Math.min(questionIndex, Math.max(0, seq.length - 1));
    const currentField = seq[idx];
    if (!currentField) return;

    const fieldResult = validateCurrentField(currentField, draft);
    if (!fieldResult.success) {
      const msg = fieldResult.error.issues[0]?.message ?? 'Invalid';
      setError(currentField, { message: msg });
      return;
    }

    const isLastQuestion = idx >= seq.length - 1;
    if (!isLastQuestion) {
      setQuestionIndex(idx + 1);
      return;
    }

    const full = onboardingAnswersSchema.safeParse(getValues());
    if (!full.success) {
      applyZodErrors(setError, full.error);
      return;
    }

    setPendingAnswers(full.data);
    await clearDraft();
    track(AnalyticsEvents.onboardingCompleted);
    router.push('/onboarding/almost-there');
  }, [clearDraft, clearErrors, getValues, questionIndex, router, setError, setPendingAnswers]);

  const goBack = useCallback(() => {
    clearErrors();
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else {
      router.back();
    }
  }, [clearErrors, questionIndex, router]);

  const onSkip = useCallback(() => {
    Alert.alert(
      'Are you sure?',
      'We use this to make your custom quit plan more accurate.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            track(AnalyticsEvents.onboardingSkipped);
            void clearDraft();
            router.replace('/sign-up');
          },
        },
      ],
    );
  }, [clearDraft, router]);

  const safeIdx = sequence.length === 0 ? 0 : Math.min(questionIndex, sequence.length - 1);
  const currentField = sequence[safeIdx];
  const progress = sequence.length > 0 ? (safeIdx + 1) / sequence.length : 0;

  const isLast = sequence.length > 0 && safeIdx >= sequence.length - 1;

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.headerBack}>
          <Text
            style={{
              color: t.color.textMuted,
              fontSize: 14,
              fontFamily: t.typeface.uiMedium,
            }}>
            ← {questionIndex === 0 ? 'Exit' : 'Back'}
          </Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.sectionLabel,
              { color: t.color.accent, fontFamily: t.typeface.uiSemibold },
            ]}>
            Assessment
          </Text>
        </View>
        <View style={styles.headerRing}>
          <AssessmentProgressRing
            progress={progress}
            trackColor={t.color.border}
            textColor={t.color.textPrimary}
            fontFamily={t.typeface.uiSemibold}
            size={44}
            strokeWidth={3}
          />
        </View>
      </View>

      {currentField === 'usageFrequency' ? (
        <SingleField
          control={control}
          name="usageFrequency"
          prompt={assessmentCopy.usageFrequency.prompt}
          options={assessmentCopy.usageFrequency.options}
          error={errors.usageFrequency?.message}
          t={t}
        />
      ) : null}
      {currentField === 'firstUseAfterWake' ? (
        <SingleField
          control={control}
          name="firstUseAfterWake"
          prompt={assessmentCopy.firstUseAfterWake.prompt}
          options={assessmentCopy.firstUseAfterWake.options}
          error={errors.firstUseAfterWake?.message}
          t={t}
        />
      ) : null}
      {currentField === 'hasTriedToQuit' ? (
        <SingleField
          control={control}
          name="hasTriedToQuit"
          prompt={assessmentCopy.hasTriedToQuit.prompt}
          options={assessmentCopy.hasTriedToQuit.options}
          error={errors.hasTriedToQuit?.message}
          t={t}
        />
      ) : null}
      {currentField === 'pastRelapseReason' ? (
        <SingleField
          control={control}
          name="pastRelapseReason"
          prompt={assessmentCopy.pastRelapseReason.prompt}
          options={assessmentCopy.pastRelapseReason.options}
          error={errors.pastRelapseReason?.message}
          t={t}
        />
      ) : null}
      {currentField === 'firstUseAge' ? (
        <SingleField
          control={control}
          name="firstUseAge"
          prompt={assessmentCopy.firstUseAge.prompt}
          options={assessmentCopy.firstUseAge.options}
          error={errors.firstUseAge?.message}
          t={t}
        />
      ) : null}
      {currentField === 'focusDifficulty' ? (
        <SingleField
          control={control}
          name="focusDifficulty"
          prompt={assessmentCopy.focusDifficulty.prompt}
          options={assessmentCopy.focusDifficulty.options}
          error={errors.focusDifficulty?.message}
          t={t}
        />
      ) : null}
      {currentField === 'emotionalCoping' ? (
        <SingleField
          control={control}
          name="emotionalCoping"
          prompt={assessmentCopy.emotionalCoping.prompt}
          options={assessmentCopy.emotionalCoping.options}
          error={errors.emotionalCoping?.message}
          t={t}
        />
      ) : null}
      {currentField === 'boredomUse' ? (
        <SingleField
          control={control}
          name="boredomUse"
          prompt={assessmentCopy.boredomUse.prompt}
          options={assessmentCopy.boredomUse.options}
          error={errors.boredomUse?.message}
          t={t}
        />
      ) : null}
      {currentField === 'nicotineForms' ? (
        <MultiField
          control={control}
          name="nicotineForms"
          prompt={assessmentCopy.nicotineForms.prompt}
          options={assessmentCopy.nicotineForms.options}
          error={errors.nicotineForms?.message}
          t={t}
        />
      ) : null}

      <PrimaryButton onPress={goNext}>{isLast ? 'Finish' : 'Continue'}</PrimaryButton>

      <Pressable onPress={onSkip} hitSlop={8} style={styles.skipWrap}>
        <Text style={[styles.skipText, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
          Skip test
        </Text>
      </Pressable>
    </Screen>
  );
}

function MultiField({
  control,
  name,
  prompt,
  options,
  error,
  t,
}: {
  control: Control<OnboardingAnswers>;
  name: 'nicotineForms';
  prompt: string;
  options: readonly { id: string; label: string }[];
  error?: string;
  t: ReturnType<typeof getTokens>;
}) {
  return (
    <View style={styles.block}>
      <Text
        style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        {prompt}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => {
          const selected = (value ?? []) as string[];
          const toggle = (id: string) => {
            if (selected.includes(id)) {
              onChange(selected.filter((x) => x !== id));
            } else {
              onChange([...selected, id]);
            }
          };
          return (
            <View style={styles.options}>
              {options.map((opt) => {
                const on = selected.includes(opt.id);
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => toggle(opt.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    style={[
                      styles.option,
                      {
                        borderColor: on ? t.color.accent : t.color.border,
                        backgroundColor: on ? t.color.surfaceElevated : t.color.surface,
                      },
                    ]}>
                    <OptionRadio selected={on} accent={t.color.accent} />
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: t.color.textPrimary, fontFamily: t.typeface.ui },
                      ]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          );
        }}
      />
      {error ? <Text style={styles.err}>{error}</Text> : null}
    </View>
  );
}

function SingleField({
  control,
  name,
  prompt,
  options,
  error,
  t,
}: {
  control: Control<OnboardingAnswers>;
  name: Exclude<keyof OnboardingAnswers, 'nicotineForms'>;
  prompt: string;
  options: readonly { id: string; label: string }[];
  error?: string;
  t: ReturnType<typeof getTokens>;
}) {
  return (
    <View style={styles.block}>
      <Text
        style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        {prompt}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <View style={styles.options}>
            {options.map((opt) => {
              const selected = value === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => onChange(opt.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  style={[
                    styles.option,
                    {
                      borderColor: selected ? t.color.accent : t.color.border,
                      backgroundColor: selected ? t.color.surfaceElevated : t.color.surface,
                    },
                  ]}>
                  <OptionRadio selected={selected} accent={t.color.accent} />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: t.color.textPrimary, fontFamily: t.typeface.ui },
                    ]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />
      {error ? <Text style={styles.err}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 16,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 4,
  },
  headerBack: { flexShrink: 0 },
  headerCenter: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  headerRing: {
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  block: { gap: 10, marginBottom: 8 },
  prompt: { fontSize: 32, lineHeight: 40, marginBottom: 8 },
  options: { gap: 12 },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionLabel: {
    flexShrink: 1,
    fontSize: 16,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  skipWrap: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  err: { color: '#e85d5d', fontSize: 13 },
});
