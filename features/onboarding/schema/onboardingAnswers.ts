import { z } from 'zod';

import { primaryPatternIds } from '@/features/onboarding/scoring/patterns';

export const ANSWERS_VERSION = '1.0';

export const usageFrequencyIds = [
  'lt_weekly',
  'weekly_not_daily',
  '1_2_day',
  '3_5_day',
  '6plus_day',
] as const;

export const firstUseAfterWakeIds = [
  '5min',
  '15min',
  '30min',
  '1hr',
  '1_2hr',
  'beyond2hr',
  'rarely',
] as const;

export const hasTriedToQuitIds = ['no', 'yes'] as const;

export const pastRelapseReasonIds = [
  'stress_event',
  'social',
  'boredom',
  'cravings',
  'other',
] as const;

export const firstUseAgeIds = ['le_12', '13_16', '17_24', '25plus'] as const;

export const frequencyTernaryIds = ['rarely', 'occasionally', 'frequently'] as const;

export const nicotineFormIds = [
  'pouch',
  'vape',
  'dip',
  'cigarette',
  'cigar',
  'other',
] as const;

export const onboardingAnswersObjectSchema = z.object({
  usageFrequency: z.enum(usageFrequencyIds, { error: 'Select one' }),
  firstUseAfterWake: z.enum(firstUseAfterWakeIds, { error: 'Select one' }),
  hasTriedToQuit: z.enum(hasTriedToQuitIds, { error: 'Select one' }),
  pastRelapseReason: z.enum(pastRelapseReasonIds).optional(),
  firstUseAge: z.enum(firstUseAgeIds, { error: 'Select one' }),
  focusDifficulty: z.enum(frequencyTernaryIds, { error: 'Select one' }),
  emotionalCoping: z.enum(frequencyTernaryIds, { error: 'Select one' }),
  boredomUse: z.enum(frequencyTernaryIds, { error: 'Select one' }),
  nicotineForms: z.array(z.enum(nicotineFormIds)).min(1, 'Select at least one'),
});

export const onboardingAnswersSchema = onboardingAnswersObjectSchema.superRefine(
  (data, ctx) => {
    if (data.hasTriedToQuit === 'yes' && data.pastRelapseReason === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select one',
        path: ['pastRelapseReason'],
      });
    }
  },
);

export type OnboardingAnswers = z.infer<typeof onboardingAnswersSchema>;
export type OnboardingDraftValues = Partial<OnboardingAnswers>;
export const onboardingDraftSchema = onboardingAnswersObjectSchema.partial();

export const assessmentResultSchema = z.object({
  scoringVersion: z.string(),
  answersVersion: z.string(),
  dependenceScore: z.number(),
  dependenceBand: z.enum(['Low', 'Medium', 'High']),
  primaryPattern: z.enum(primaryPatternIds),
  driverSummary: z.string(),
  firstWinSummary: z.string(),
  weekOneFocus: z.string(),
});

export const assessmentSessionSchema = z.object({
  answers: onboardingAnswersSchema,
  result: assessmentResultSchema,
});

export const defaultOnboardingAnswers = (): OnboardingDraftValues => ({
  nicotineForms: [],
});
