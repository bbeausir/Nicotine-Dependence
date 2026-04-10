import { describe, expect, it } from 'vitest';

import { onboardingAnswersSchema } from '@/features/onboarding/schema/onboardingAnswers';

const validAnswers = {
  nicotineForms: ['vape'] as const,
  dailyUseEvents: '5_7' as const,
  firstUseAfterWake: '30min' as const,
  urgeEnvironments: ['work', 'commute'] as const,
  emotionalPrecursor: 'stress' as const,
  highStakesReliance: 'sometimes' as const,
  performanceBelief: 'somewhat' as const,
  reductionConcern: 'focus' as const,
  selfImageConflict: 6,
  pastAttempts: '1' as const,
  crashReason: 'stress_event' as const,
  sprintGoal: 'half' as const,
};

describe('onboardingAnswersSchema', () => {
  it('accepts a valid response set', () => {
    const parsed = onboardingAnswersSchema.safeParse(validAnswers);
    expect(parsed.success).toBe(true);
  });

  it('requires crashReason when pastAttempts is not zero', () => {
    const parsed = onboardingAnswersSchema.safeParse({
      ...validAnswers,
      crashReason: undefined,
    });
    expect(parsed.success).toBe(false);
  });
});
