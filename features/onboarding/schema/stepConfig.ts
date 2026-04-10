import { z } from 'zod';

import {
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
