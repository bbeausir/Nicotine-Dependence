import { describe, expect, it } from 'vitest';

import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import {
  getAssessmentSequence,
  getFirstIncompleteQuestionIndex,
  validateCurrentField,
} from '@/features/onboarding/schema/stepConfig';

describe('getAssessmentSequence', () => {
  it('skips pastRelapseReason when hasTriedToQuit is no', () => {
    const seq = getAssessmentSequence({ hasTriedToQuit: 'no' });
    expect(seq).not.toContain('pastRelapseReason');
    expect(seq[seq.length - 1]).toBe('nicotineForms');
  });

  it('includes pastRelapseReason after hasTriedToQuit when yes', () => {
    const seq = getAssessmentSequence({ hasTriedToQuit: 'yes' });
    const i = seq.indexOf('hasTriedToQuit');
    expect(seq[i + 1]).toBe('pastRelapseReason');
  });

  it('omits pastRelapseReason when hasTriedToQuit is unset', () => {
    const seq = getAssessmentSequence({});
    expect(seq).not.toContain('pastRelapseReason');
  });
});

describe('validateCurrentField', () => {
  it('requires pastRelapseReason when hasTriedToQuit is yes', () => {
    const r = validateCurrentField('pastRelapseReason', { hasTriedToQuit: 'yes' });
    expect(r.success).toBe(false);
  });

  it('skips pastRelapseReason validation when hasTriedToQuit is not yes', () => {
    const r = validateCurrentField('pastRelapseReason', { hasTriedToQuit: 'no' });
    expect(r.success).toBe(true);
  });
});

describe('getFirstIncompleteQuestionIndex', () => {
  it('returns the index of the first missing field in order', () => {
    const idx = getFirstIncompleteQuestionIndex({
      usageFrequency: '3_5_day',
    });
    expect(idx).toBe(1);
  });

  it('returns the last index when every field is valid', () => {
    const complete: OnboardingAnswers = {
      usageFrequency: '1_2_day',
      firstUseAfterWake: '1hr',
      hasTriedToQuit: 'no',
      firstUseAge: '17_24',
      focusDifficulty: 'rarely',
      emotionalCoping: 'rarely',
      boredomUse: 'occasionally',
      nicotineForms: ['pouch'],
    };
    const seq = getAssessmentSequence(complete);
    expect(getFirstIncompleteQuestionIndex(complete)).toBe(seq.length - 1);
  });
});
