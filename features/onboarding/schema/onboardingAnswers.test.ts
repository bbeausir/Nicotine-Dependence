import { describe, expect, it } from 'vitest';

import { onboardingAnswersSchema } from '@/features/onboarding/schema/onboardingAnswers';

const validAnswers = {
  usageFrequency: '3_5_day' as const,
  firstUseAfterWake: '30min' as const,
  hasTriedToQuit: 'yes' as const,
  pastRelapseReason: 'stress_event' as const,
  firstUseAge: '17_24' as const,
  focusDifficulty: 'occasionally' as const,
  emotionalCoping: 'frequently' as const,
  boredomUse: 'rarely' as const,
  nicotineForms: ['vape'] as const,
};

describe('onboardingAnswersSchema', () => {
  it('accepts a valid response set', () => {
    const parsed = onboardingAnswersSchema.safeParse(validAnswers);
    expect(parsed.success).toBe(true);
  });

  it('requires pastRelapseReason when hasTriedToQuit is yes', () => {
    const parsed = onboardingAnswersSchema.safeParse({
      ...validAnswers,
      pastRelapseReason: undefined,
    });
    expect(parsed.success).toBe(false);
  });

  it('accepts omission of pastRelapseReason when hasTriedToQuit is no', () => {
    const parsed = onboardingAnswersSchema.safeParse({
      ...validAnswers,
      hasTriedToQuit: 'no' as const,
      pastRelapseReason: undefined,
    });
    expect(parsed.success).toBe(true);
  });

  it('requires at least one nicotine form', () => {
    const parsed = onboardingAnswersSchema.safeParse({
      ...validAnswers,
      nicotineForms: [],
    });
    expect(parsed.success).toBe(false);
  });
});
