import { z, type ZodError } from 'zod';

import {
  onboardingAnswersObjectSchema,
  pastRelapseReasonIds,
  type OnboardingAnswers,
  type OnboardingDraftValues,
} from '@/features/onboarding/schema/onboardingAnswers';

/** Fixed order before the conditional pastRelapseReason. */
const baseFieldOrder = [
  'usageFrequency',
  'firstUseAfterWake',
  'hasTriedToQuit',
] as const satisfies readonly (keyof OnboardingAnswers)[];

const postConditionalFields = [
  'firstUseAge',
  'focusDifficulty',
  'emotionalCoping',
  'boredomUse',
  'nicotineForms',
] as const satisfies readonly (keyof OnboardingAnswers)[];

/**
 * Ordered assessment fields for the current draft. `pastRelapseReason` only
 * appears when `hasTriedToQuit === 'yes'`.
 */
export function getAssessmentSequence(values: OnboardingDraftValues): (keyof OnboardingAnswers)[] {
  const sequence: (keyof OnboardingAnswers)[] = [...baseFieldOrder];
  if (values.hasTriedToQuit === 'yes') {
    sequence.push('pastRelapseReason');
  }
  sequence.push(...postConditionalFields);
  return sequence;
}

export type FieldValidationResult = { success: true } | { success: false; error: ZodError };

export function validateCurrentField(
  field: keyof OnboardingAnswers,
  values: OnboardingDraftValues,
): FieldValidationResult {
  if (field === 'pastRelapseReason') {
    if (values.hasTriedToQuit !== 'yes') {
      return { success: true };
    }
    const parsed = z.enum(pastRelapseReasonIds).safeParse(values.pastRelapseReason);
    if (!parsed.success) {
      return { success: false, error: parsed.error };
    }
    return { success: true };
  }

  const fieldSchema = onboardingAnswersObjectSchema.shape[field];
  const parsed = fieldSchema.safeParse(values[field]);
  if (!parsed.success) {
    return { success: false, error: parsed.error };
  }
  return { success: true };
}

export function getFirstIncompleteQuestionIndex(values: OnboardingDraftValues): number {
  const sequence = getAssessmentSequence(values);
  for (let i = 0; i < sequence.length; i++) {
    const field = sequence[i]!;
    const result = validateCurrentField(field, values);
    if (!result.success) {
      return i;
    }
  }
  return Math.max(0, sequence.length - 1);
}
