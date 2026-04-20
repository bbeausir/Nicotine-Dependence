import { describe, expect, it } from 'vitest';

import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import {
  ANSWERS_VERSION,
  type OnboardingAnswers,
} from '@/features/onboarding/schema/onboardingAnswers';
import { SCORING_VERSION } from '@/features/onboarding/scoring/config';

const baseAnswers: OnboardingAnswers = {
  usageFrequency: '3_5_day',
  firstUseAfterWake: '15min',
  hasTriedToQuit: 'yes',
  pastRelapseReason: 'cravings',
  firstUseAge: '17_24',
  focusDifficulty: 'occasionally',
  emotionalCoping: 'occasionally',
  boredomUse: 'rarely',
  nicotineForms: ['vape'],
};

describe('calculateScores', () => {
  it('is deterministic for the same answer set', () => {
    const first = calculateScores(baseAnswers);
    const second = calculateScores(baseAnswers);
    expect(second).toEqual(first);
  });

  it('stamps version fields', () => {
    const result = calculateScores(baseAnswers);
    expect(result.scoringVersion).toBe(SCORING_VERSION);
    expect(result.answersVersion).toBe(ANSWERS_VERSION);
  });

  it('bounds the dependence score to 0–100 and matches the band', () => {
    const result = calculateScores(baseAnswers);
    expect(result.dependenceScore).toBeGreaterThanOrEqual(0);
    expect(result.dependenceScore).toBeLessThanOrEqual(100);
    expect(['Low', 'Medium', 'High']).toContain(result.dependenceBand);
  });

  it('dependence monotonically increases with usage frequency', () => {
    const low = calculateScores({ ...baseAnswers, usageFrequency: 'lt_weekly' });
    const mid = calculateScores({ ...baseAnswers, usageFrequency: '1_2_day' });
    const high = calculateScores({ ...baseAnswers, usageFrequency: '6plus_day' });
    expect(low.dependenceScore).toBeLessThan(mid.dependenceScore);
    expect(mid.dependenceScore).toBeLessThan(high.dependenceScore);
  });

  it('multiple nicotine forms bumps the dependence score slightly', () => {
    const one = calculateScores({ ...baseAnswers, nicotineForms: ['vape'] });
    const two = calculateScores({ ...baseAnswers, nicotineForms: ['vape', 'pouch'] });
    expect(two.dependenceScore).toBeGreaterThan(one.dependenceScore);
  });

  it('picks stress_driver when emotional coping is frequent', () => {
    const result = calculateScores({
      ...baseAnswers,
      emotionalCoping: 'frequently',
      boredomUse: 'rarely',
    });
    expect(result.primaryPattern).toBe('stress_driver');
  });

  it('picks boredom_driver when boredom use is frequent and emotion is low', () => {
    const result = calculateScores({
      ...baseAnswers,
      emotionalCoping: 'rarely',
      boredomUse: 'frequently',
    });
    expect(result.primaryPattern).toBe('boredom_driver');
  });

  it('falls back to habit_driver when neither driver dominates', () => {
    const result = calculateScores({
      ...baseAnswers,
      usageFrequency: '6plus_day',
      firstUseAfterWake: '5min',
      focusDifficulty: 'frequently',
      emotionalCoping: 'rarely',
      boredomUse: 'rarely',
    });
    expect(result.primaryPattern).toBe('habit_driver');
  });
});
