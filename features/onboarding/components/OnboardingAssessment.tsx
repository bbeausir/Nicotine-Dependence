import Slider from '@react-native-community/slider';
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
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AssessmentProgressRing } from '@/components/ui/AssessmentProgressRing';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { assessmentCopy, sectionTitles } from '@/features/onboarding/content/assessmentCopy';
import { useAssessmentDraft } from '@/features/onboarding/hooks/useAssessmentDraft';
import {
  defaultOnboardingAnswers,
  onboardingAnswersSchema,
  type OnboardingDraftValues,
  type OnboardingAnswers,
} from '@/features/onboarding/schema/onboardingAnswers';
import {
  getAssessmentSequence,
  getFirstIncompleteQuestionIndex,
  getSectionForField,
  validateCurrentField,
} from '@/features/onboarding/schema/stepConfig';
import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import { AnalyticsEvents } from '@/lib/analytics/events';
import { track } from '@/lib/analytics/track';
import { useAssessment } from '@/providers/AssessmentProvider';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';
import type { ZodError } from 'zod';

function applyZodErrors(setError: (name: FieldPath<OnboardingAnswers>, err: { message: string }) => void, zerr: ZodError) {
  for (const issue of zerr.issues) {
    const key = issue.path[0];
    if (typeof key === 'string') {
      setError(key as FieldPath<OnboardingAnswers>, { message: issue.message });
    }
  }
}

function setFieldErrorFromValidation(
  setError: (name: FieldPath<OnboardingAnswers>, err: { message: string }) => void,
  field: FieldPath<OnboardingAnswers>,
  message: string,
) {
  setError(field, { message });
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
  const { setSession } = useAssessment();
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
    if (values.pastAttempts === '0') {
      setValue('crashReason', undefined);
    }
  }, [values.pastAttempts, setValue]);

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
    if (!currentField) {
      return;
    }

    const fieldResult = validateCurrentField(currentField, draft);
    if (!fieldResult.success) {
      const msg = fieldResult.error.issues[0]?.message ?? 'Invalid';
      setFieldErrorFromValidation(setError, currentField, msg);
      return;
    }

    const currentSection = getSectionForField(currentField);
    const isLastQuestion = idx >= seq.length - 1;
    const nextField = !isLastQuestion ? seq[idx + 1] : undefined;
    const nextSection = nextField !== undefined ? getSectionForField(nextField) : undefined;
    const shouldTrackSectionComplete =
      isLastQuestion || (nextSection !== undefined && nextSection !== currentSection);
    if (shouldTrackSectionComplete) {
      track(AnalyticsEvents.onboardingSectionCompleted, { sectionIndex: currentSection });
    }

    if (!isLastQuestion) {
      setQuestionIndex(idx + 1);
      return;
    }

    const full = onboardingAnswersSchema.safeParse(getValues());
    if (!full.success) {
      applyZodErrors(setError, full.error);
      return;
    }

    const result = calculateScores(full.data);
    setSession(full.data, result);
    await clearDraft();
    track(AnalyticsEvents.onboardingCompleted);
    router.replace('/results');
  }, [clearDraft, clearErrors, getValues, questionIndex, router, setError, setSession]);

  const goBack = useCallback(() => {
    clearErrors();
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else {
      router.back();
    }
  }, [clearErrors, questionIndex, router]);

  const safeIdx = sequence.length === 0 ? 0 : Math.min(questionIndex, sequence.length - 1);
  const currentField = sequence[safeIdx];
  const sectionIndex = currentField !== undefined ? getSectionForField(currentField) : 0;
  const progress = sequence.length > 0 ? (safeIdx + 1) / sequence.length : 0;

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
              {
                color: t.color.accent,
                fontFamily: t.typeface.uiSemibold,
                textAlign: 'center',
              },
            ]}>
            {sectionTitles[sectionIndex]}
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
      {currentField === 'dailyUseEvents' ? (
        <SingleField
          control={control}
          name="dailyUseEvents"
          prompt={assessmentCopy.dailyUseEvents.prompt}
          options={assessmentCopy.dailyUseEvents.options}
          error={errors.dailyUseEvents?.message}
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
      {currentField === 'urgeEnvironments' ? (
        <MultiField
          control={control}
          name="urgeEnvironments"
          prompt={assessmentCopy.urgeEnvironments.prompt}
          options={assessmentCopy.urgeEnvironments.options}
          error={errors.urgeEnvironments?.message}
          t={t}
        />
      ) : null}
      {currentField === 'emotionalPrecursor' ? (
        <SingleField
          control={control}
          name="emotionalPrecursor"
          prompt={assessmentCopy.emotionalPrecursor.prompt}
          options={assessmentCopy.emotionalPrecursor.options}
          error={errors.emotionalPrecursor?.message}
          t={t}
        />
      ) : null}
      {currentField === 'highStakesReliance' ? (
        <SingleField
          control={control}
          name="highStakesReliance"
          prompt={assessmentCopy.highStakesReliance.prompt}
          options={assessmentCopy.highStakesReliance.options}
          error={errors.highStakesReliance?.message}
          t={t}
        />
      ) : null}
      {currentField === 'performanceBelief' ? (
        <SingleField
          control={control}
          name="performanceBelief"
          prompt={assessmentCopy.performanceBelief.prompt}
          options={assessmentCopy.performanceBelief.options}
          error={errors.performanceBelief?.message}
          t={t}
        />
      ) : null}
      {currentField === 'reductionConcern' ? (
        <SingleField
          control={control}
          name="reductionConcern"
          prompt={assessmentCopy.reductionConcern.prompt}
          options={assessmentCopy.reductionConcern.options}
          error={errors.reductionConcern?.message}
          t={t}
        />
      ) : null}
      {currentField === 'selfImageConflict' ? (
        <>
          <Text style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
            {assessmentCopy.selfImageConflict.prompt}
          </Text>
          <Text style={[styles.hint, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
            {assessmentCopy.selfImageConflict.sliderHint}
          </Text>
          <Controller
            control={control}
            name="selfImageConflict"
            render={({ field: { value, onChange } }) => (
              <View style={styles.sliderBlock}>
                <Text
                  style={{
                    color: t.color.textPrimary,
                    fontSize: 20,
                    fontFamily: t.typeface.uiSemibold,
                  }}>
                  {value ?? '-'}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={value ?? 5}
                  onSlidingComplete={onChange}
                  onValueChange={onChange}
                  minimumTrackTintColor={t.color.accent}
                  maximumTrackTintColor={t.color.border}
                  thumbTintColor={t.color.accent}
                />
              </View>
            )}
          />
          {errors.selfImageConflict?.message ? (
            <Text style={styles.err}>{errors.selfImageConflict.message}</Text>
          ) : null}
        </>
      ) : null}
      {currentField === 'pastAttempts' ? (
        <SingleField
          control={control}
          name="pastAttempts"
          prompt={assessmentCopy.pastAttempts.prompt}
          options={assessmentCopy.pastAttempts.options}
          error={errors.pastAttempts?.message}
          t={t}
        />
      ) : null}
      {currentField === 'crashReason' ? (
        <SingleField
          control={control}
          name="crashReason"
          prompt={assessmentCopy.crashReason.prompt}
          options={assessmentCopy.crashReason.options}
          error={errors.crashReason?.message}
          t={t}
        />
      ) : null}
      {currentField === 'sprintGoal' ? (
        <SingleField
          control={control}
          name="sprintGoal"
          prompt={assessmentCopy.sprintGoal.prompt}
          options={assessmentCopy.sprintGoal.options}
          error={errors.sprintGoal?.message}
          t={t}
        />
      ) : null}

      <PrimaryButton onPress={goNext}>
        {sequence.length > 0 && safeIdx >= sequence.length - 1 ? 'See results' : 'Continue'}
      </PrimaryButton>
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
  name: 'nicotineForms' | 'urgeEnvironments';
  prompt: string;
  options: readonly { id: string; label: string }[];
  error?: string;
  t: ReturnType<typeof getTokens>;
}) {
  return (
    <View style={styles.block}>
      <Text style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>{prompt}</Text>
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
  name: Exclude<keyof OnboardingAnswers, 'nicotineForms' | 'urgeEnvironments' | 'selfImageConflict'>;
  prompt: string;
  options: readonly { id: string; label: string }[];
  error?: string;
  t: ReturnType<typeof getTokens>;
}) {
  return (
    <View style={styles.block}>
      <Text style={[styles.prompt, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>{prompt}</Text>
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
  headerBack: {
    flexShrink: 0,
  },
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
  },
  block: { gap: 10, marginBottom: 8 },
  prompt: { fontSize: 36, lineHeight: 44, marginBottom: 8 },
  hint: { fontSize: 14, lineHeight: 20 },
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
  sliderBlock: { gap: 8, marginTop: 4 },
  slider: { width: '100%', height: 44 },
  err: { color: '#e85d5d', fontSize: 13 },
});
