import { z, type ZodError } from 'zod';

import {
  crashReasonIds,
  onboardingAnswersObjectSchema,
  type OnboardingAnswers,
  type OnboardingDraftValues,
} from '@/features/onboarding/schema/onboardingAnswers';

const step0Fields = ['nicotineForms', 'dailyUseEvents', 'firstUseAfterWake'] as const;
const step1Fields = ['urgeEnvironments', 'emotionalPrecursor', 'highStakesReliance'] as const;
const step2Fields = ['performanceBelief', 'reductionConcern', 'selfImageConflict'] as const;
const step3Fields = ['pastAttempts', 'crashReason'] as const;
const step4Fields = ['sprintGoal'] as const;

const step0Schema = onboardingAnswersObjectSchema.pick({
  nicotineForms: true,
  dailyUseEvents: true,
  firstUseAfterWake: true,
});

const step1Schema = onboardingAnswersObjectSchema.pick({
  urgeEnvironments: true,
  emotionalPrecursor: true,
  highStakesReliance: true,
});

const step2Schema = onboardingAnswersObjectSchema.pick({
  performanceBelief: true,
  reductionConcern: true,
  selfImageConflict: true,
});

const step3Schema = onboardingAnswersSchemaWithCrashReasonGuard();

function onboardingAnswersSchemaWithCrashReasonGuard() {
  return onboardingAnswersObjectSchema
    .pick({
  pastAttempts: true,
  crashReason: true,
    })
    .superRefine((data, ctx) => {
      if (data.pastAttempts !== '0' && data.crashReason === undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Select one',
          path: ['crashReason'],
        });
      }
    });
}

const step4Schema = onboardingAnswersObjectSchema.pick({
  sprintGoal: true,
});

type StepDef = {
  fields: readonly (keyof OnboardingAnswers)[];
  schema: z.ZodTypeAny;
};

export const onboardingStepConfig: readonly StepDef[] = [
  { fields: step0Fields, schema: step0Schema },
  { fields: step1Fields, schema: step1Schema },
  { fields: step2Fields, schema: step2Schema },
  { fields: step3Fields, schema: step3Schema },
  { fields: step4Fields, schema: step4Schema },
] as const;

export function pickStepValues(step: number, values: OnboardingDraftValues): Record<string, unknown> {
  const fields = onboardingStepConfig[step]?.fields ?? [];
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field] = values[field];
    return acc;
  }, {});
}

export function getFirstIncompleteStep(values: OnboardingDraftValues): number {
  const stepIndex = onboardingStepConfig.findIndex(
    (def, index) => !def.schema.safeParse(pickStepValues(index, values)).success,
  );
  return stepIndex === -1 ? onboardingStepConfig.length - 1 : stepIndex;
}

/** Fixed order through `pastAttempts` (indices 0–9). */
export const assessmentPrefixFields = [
  'nicotineForms',
  'dailyUseEvents',
  'firstUseAfterWake',
  'urgeEnvironments',
  'emotionalPrecursor',
  'highStakesReliance',
  'performanceBelief',
  'reductionConcern',
  'selfImageConflict',
  'pastAttempts',
] as const satisfies readonly (keyof OnboardingAnswers)[];

const FIELD_TO_SECTION: Record<keyof OnboardingAnswers, number> = {
  nicotineForms: 0,
  dailyUseEvents: 0,
  firstUseAfterWake: 0,
  urgeEnvironments: 1,
  emotionalPrecursor: 1,
  highStakesReliance: 1,
  performanceBelief: 2,
  reductionConcern: 2,
  selfImageConflict: 2,
  pastAttempts: 3,
  crashReason: 3,
  sprintGoal: 4,
};

export function getSectionForField(field: keyof OnboardingAnswers): number {
  return FIELD_TO_SECTION[field];
}

/**
 * Ordered assessment fields for the current draft. `sprintGoal` appears only after
 * `pastAttempts` is set; `crashReason` only when `pastAttempts` is not `'0'`.
 */
export function getAssessmentSequence(values: OnboardingDraftValues): (keyof OnboardingAnswers)[] {
  const out: (keyof OnboardingAnswers)[] = [...assessmentPrefixFields];
  if (values.pastAttempts !== undefined) {
    if (values.pastAttempts !== '0') {
      out.push('crashReason');
    }
    out.push('sprintGoal');
  }
  return out;
}

export type FieldValidationResult = { success: true } | { success: false; error: ZodError };

export function validateCurrentField(
  field: keyof OnboardingAnswers,
  values: OnboardingDraftValues,
): FieldValidationResult {
  if (field === 'crashReason') {
    if (values.pastAttempts === undefined || values.pastAttempts === '0') {
      return { success: true };
    }
    const parsed = z.enum(crashReasonIds).safeParse(values.crashReason);
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
