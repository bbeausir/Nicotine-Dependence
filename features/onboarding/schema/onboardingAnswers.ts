import { z } from 'zod';
import { primaryPatternIds } from '@/features/onboarding/scoring/patterns';

/** PRD §10.3 — stable IDs for persistence + analytics. */

export const nicotineFormIds = ['pouch', 'vape', 'dip', 'cigarette', 'other'] as const;
export const dailyUseEventIds = ['1_2', '3_4', '5_7', '8_10', '11_15', '16plus'] as const;
export const firstUseAfterWakeIds = [
  '5min',
  '15min',
  '30min',
  '1hr',
  '1_2hr',
  'beyond2hr',
  'rarely',
] as const;
export const urgeEnvironmentIds = [
  'work',
  'commute',
  'social',
  'post_meals',
  'transitions',
  'habitual_all',
] as const;
export const emotionalPrecursorIds = ['stress', 'boredom', 'lack_focus', 'irritability'] as const;
export const ternaryIds = ['no', 'sometimes', 'yes'] as const;
export const performanceBeliefIds = ['no', 'somewhat', 'yes'] as const;
export const reductionConcernIds = ['focus', 'brain_fog', 'irritability_social', 'weight'] as const;
export const pastAttemptIds = ['0', '1', '2', '3plus'] as const;
export const crashReasonIds = ['stress_event', 'social', 'boredom', 'cravings'] as const;
export const sprintGoalIds = ['abstinence', 'half', 'awareness'] as const;

export const onboardingAnswersObjectSchema = z.object({
  nicotineForms: z.array(z.enum(nicotineFormIds)).min(1, 'Select at least one'),
  dailyUseEvents: z.enum(dailyUseEventIds, { error: 'Select one' }),
  firstUseAfterWake: z.enum(firstUseAfterWakeIds, { error: 'Select one' }),
  urgeEnvironments: z.array(z.enum(urgeEnvironmentIds)).min(1, 'Select at least one'),
  emotionalPrecursor: z.enum(emotionalPrecursorIds, { error: 'Select one' }),
  highStakesReliance: z.enum(ternaryIds, { error: 'Select one' }),
  performanceBelief: z.enum(performanceBeliefIds, { error: 'Select one' }),
  reductionConcern: z.enum(reductionConcernIds, { error: 'Select one' }),
  selfImageConflict: z
    .number({ error: 'Set the slider' })
    .int()
    .min(1)
    .max(10),
  pastAttempts: z.enum(pastAttemptIds, { error: 'Select one' }),
  crashReason: z.enum(crashReasonIds).optional(),
  sprintGoal: z.enum(sprintGoalIds, { error: 'Select one' }),
});

export const onboardingAnswersSchema = onboardingAnswersObjectSchema.superRefine((data, ctx) => {
    if (data.pastAttempts !== '0' && data.crashReason === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select one',
        path: ['crashReason'],
      });
    }
  });

export type OnboardingAnswers = z.infer<typeof onboardingAnswersSchema>;
export type OnboardingDraftValues = Partial<OnboardingAnswers>;
export const onboardingDraftSchema = onboardingAnswersObjectSchema.partial();

export const assessmentResultSchema = z.object({
  scoringVersion: z.string(),
  dependenceScore: z.number(),
  cravingReactivityScore: z.number(),
  cravingReactivityLabel: z.enum(['Low', 'Medium', 'High']),
  regulationConfidenceScore: z.number(),
  regulationConfidenceLabel: z.enum(['Low', 'Medium', 'High']),
  primaryPattern: z.enum(primaryPatternIds),
  driverSummary: z.string(),
  firstWinSummary: z.string(),
  weekOneFocus: z.string(),
});

export const assessmentSessionSchema = z.object({
  answers: onboardingAnswersSchema,
  result: assessmentResultSchema,
});

/**
 * Intentionally sparse defaults so no single-select or slider appears preselected.
 */
export const defaultOnboardingAnswers = (): OnboardingDraftValues => ({
  nicotineForms: [],
  urgeEnvironments: [],
});
