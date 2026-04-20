import { describe, expect, it } from 'vitest';

import { parseDraftPayload } from '@/features/onboarding/hooks/useAssessmentDraft';
import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import {
  getAssessmentSequence,
  getFirstIncompleteQuestionIndex,
} from '@/features/onboarding/schema/stepConfig';
import { calculateScores } from '@/features/onboarding/scoring/calculateScores';
import { parseAssessmentSessionPayload } from '@/providers/AssessmentProvider';

const completeAnswers: OnboardingAnswers = {
  usageFrequency: '1_2_day',
  firstUseAfterWake: '1hr',
  hasTriedToQuit: 'no',
  firstUseAge: '17_24',
  focusDifficulty: 'rarely',
  emotionalCoping: 'rarely',
  boredomUse: 'occasionally',
  nicotineForms: ['pouch'],
};

describe('storage parser guards', () => {
  it('accepts a valid draft payload and derives resume index', () => {
    const parsed = parseDraftPayload(
      JSON.stringify({ usageFrequency: '3_5_day' }),
    );
    expect(parsed).toEqual({ usageFrequency: '3_5_day' });
    expect(getFirstIncompleteQuestionIndex(parsed ?? {})).toBe(1);
  });

  it('rejects a malformed draft payload shape', () => {
    const parsed = parseDraftPayload(
      JSON.stringify({ usageFrequency: 'not_a_valid_id' }),
    );
    expect(parsed).toBeNull();
  });

  it('accepts a valid completed session payload', () => {
    const result = calculateScores(completeAnswers);
    const valid = parseAssessmentSessionPayload(
      JSON.stringify({ answers: completeAnswers, result }),
    );
    expect(valid).not.toBeNull();
  });

  it('accepts an answers-only payload (pre-Almost There)', () => {
    const valid = parseAssessmentSessionPayload(
      JSON.stringify({ answers: completeAnswers }),
    );
    expect(valid).not.toBeNull();
    expect(valid?.result).toBeUndefined();
  });

  it('rejects a session payload with an unknown primary pattern', () => {
    const invalid = parseAssessmentSessionPayload(
      JSON.stringify({
        answers: completeAnswers,
        result: { primaryPattern: 'not_real' },
      }),
    );
    expect(invalid).toBeNull();
  });

  it('sequence skips pastRelapseReason when hasTriedToQuit is no', () => {
    const seq = getAssessmentSequence({ hasTriedToQuit: 'no' });
    expect(seq).not.toContain('pastRelapseReason');
  });

  it('sequence includes pastRelapseReason when hasTriedToQuit is yes', () => {
    const seq = getAssessmentSequence({ hasTriedToQuit: 'yes' });
    expect(seq).toContain('pastRelapseReason');
  });
});
