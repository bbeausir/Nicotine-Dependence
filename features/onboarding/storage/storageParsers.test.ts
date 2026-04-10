import { describe, expect, it } from 'vitest';

import { getFirstIncompleteStep } from '@/features/onboarding/schema/stepConfig';
import { parseDraftPayload } from '@/features/onboarding/hooks/useAssessmentDraft';
import { parseAssessmentSessionPayload } from '@/providers/AssessmentProvider';
import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';

const completeAnswers: OnboardingAnswers = {
  nicotineForms: ['pouch'],
  dailyUseEvents: '3_4' as const,
  firstUseAfterWake: '1hr' as const,
  urgeEnvironments: ['work', 'transitions'],
  emotionalPrecursor: 'lack_focus' as const,
  highStakesReliance: 'sometimes' as const,
  performanceBelief: 'somewhat' as const,
  reductionConcern: 'focus' as const,
  selfImageConflict: 4,
  pastAttempts: '0' as const,
  sprintGoal: 'awareness' as const,
};

describe('storage parser guards', () => {
  it('accepts valid draft payload and derives resume step', () => {
    const parsed = parseDraftPayload(
      JSON.stringify({
        nicotineForms: ['vape'],
        dailyUseEvents: '5_7',
      }),
    );
    expect(parsed).toEqual({
      nicotineForms: ['vape'],
      dailyUseEvents: '5_7',
    });
    expect(getFirstIncompleteStep(parsed ?? {})).toBe(0);
  });

  it('rejects malformed draft payload shape', () => {
    const parsed = parseDraftPayload(
      JSON.stringify({
        nicotineForms: 'vape',
      }),
    );
    expect(parsed).toBeNull();
  });

  it('accepts only valid saved assessment session payloads', () => {
    const valid = parseAssessmentSessionPayload(
      JSON.stringify({
        answers: completeAnswers,
        result: calculateScores(completeAnswers),
      }),
    );
    const invalid = parseAssessmentSessionPayload(
      JSON.stringify({
        answers: completeAnswers,
        result: { primaryPattern: 'not_real' },
      }),
    );
    expect(valid).not.toBeNull();
    expect(invalid).toBeNull();
  });
});
