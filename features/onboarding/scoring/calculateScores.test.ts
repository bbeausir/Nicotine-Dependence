import { describe, expect, it } from 'vitest';

import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';

const fixtureAnswers: OnboardingAnswers = {
  nicotineForms: ['vape'],
  dailyUseEvents: '8_10' as const,
  firstUseAfterWake: '15min' as const,
  urgeEnvironments: ['work', 'social'],
  emotionalPrecursor: 'stress' as const,
  highStakesReliance: 'yes' as const,
  performanceBelief: 'yes' as const,
  reductionConcern: 'brain_fog' as const,
  selfImageConflict: 8,
  pastAttempts: '2' as const,
  crashReason: 'cravings' as const,
  sprintGoal: 'awareness' as const,
};

describe('calculateScores', () => {
  it('is deterministic for the same answer set', () => {
    const first = calculateScores(fixtureAnswers);
    const second = calculateScores(fixtureAnswers);
    expect(second).toEqual(first);
  });

  it('returns bounded numeric scores', () => {
    const result = calculateScores(fixtureAnswers);
    expect(result.dependenceScore).toBeGreaterThanOrEqual(0);
    expect(result.dependenceScore).toBeLessThanOrEqual(100);
    expect(result.cravingReactivityScore).toBeGreaterThanOrEqual(0);
    expect(result.cravingReactivityScore).toBeLessThanOrEqual(100);
    expect(result.regulationConfidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.regulationConfidenceScore).toBeLessThanOrEqual(100);
  });
});
