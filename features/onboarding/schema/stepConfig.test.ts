import { describe, expect, it } from 'vitest';

import type { OnboardingAnswers, OnboardingDraftValues } from '@/features/onboarding/schema/onboardingAnswers';
import {
  assessmentPrefixFields,
  getAssessmentSequence,
  getFirstIncompleteQuestionIndex,
  getFirstIncompleteStep,
  getSectionForField,
  validateCurrentField,
} from '@/features/onboarding/schema/stepConfig';

describe('getAssessmentSequence', () => {
  it('includes prefix through pastAttempts then sprintGoal when pastAttempts is 0', () => {
    const seq = getAssessmentSequence({ pastAttempts: '0' });
    expect(seq[seq.length - 1]).toBe('sprintGoal');
    expect(seq).not.toContain('crashReason');
    expect(seq).toEqual([...assessmentPrefixFields, 'sprintGoal']);
  });

  it('inserts crashReason before sprintGoal when pastAttempts is not 0', () => {
    const seq = getAssessmentSequence({ pastAttempts: '1' });
    const i = seq.indexOf('pastAttempts');
    expect(seq[i + 1]).toBe('crashReason');
    expect(seq[i + 2]).toBe('sprintGoal');
  });

  it('omits tail until pastAttempts is set', () => {
    const seq = getAssessmentSequence({});
    expect(seq).toEqual([...assessmentPrefixFields]);
    expect(seq).not.toContain('sprintGoal');
  });
});

describe('getSectionForField', () => {
  it('maps fields to section indices', () => {
    expect(getSectionForField('nicotineForms')).toBe(0);
    expect(getSectionForField('urgeEnvironments')).toBe(1);
    expect(getSectionForField('selfImageConflict')).toBe(2);
    expect(getSectionForField('pastAttempts')).toBe(3);
    expect(getSectionForField('crashReason')).toBe(3);
    expect(getSectionForField('sprintGoal')).toBe(4);
  });
});

describe('validateCurrentField', () => {
  it('requires crashReason when pastAttempts is not 0', () => {
    const r = validateCurrentField('crashReason', { pastAttempts: '1' });
    expect(r.success).toBe(false);
  });

  it('skips crashReason validation when pastAttempts is 0', () => {
    const r = validateCurrentField('crashReason', { pastAttempts: '0' });
    expect(r.success).toBe(true);
  });
});

describe('getFirstIncompleteQuestionIndex', () => {
  it('returns first missing field in order', () => {
    const idx = getFirstIncompleteQuestionIndex({
      nicotineForms: ['pouch'],
      dailyUseEvents: '3_4',
    });
    expect(idx).toBe(2);
  });

  it('returns last index when all fields in sequence are valid', () => {
    const complete: OnboardingAnswers = {
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
    const seq = getAssessmentSequence(complete);
    expect(getFirstIncompleteQuestionIndex(complete)).toBe(seq.length - 1);
  });
});

describe('getFirstIncompleteStep (sections)', () => {
  it('still reports first incomplete section for partial drafts', () => {
    const parsed: OnboardingDraftValues = {
      nicotineForms: ['vape'],
      dailyUseEvents: '5_7',
    };
    expect(getFirstIncompleteStep(parsed)).toBe(0);
  });
});
