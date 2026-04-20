import {
  ANSWERS_VERSION,
  type OnboardingAnswers,
} from '@/features/onboarding/schema/onboardingAnswers';
import { pickPrimaryPattern } from '@/features/onboarding/scoring/assignPrimaryPattern';
import { SCORING_VERSION, scoreBands } from '@/features/onboarding/scoring/config';
import {
  getDriverSummary,
  getFirstWinSummary,
  getWeekOneFocus,
} from '@/features/onboarding/scoring/resultCopy';
import type { AssessmentResult, BandLabel } from '@/features/onboarding/scoring/types';

function bandForScore(value: number): BandLabel {
  const clamped = Math.max(0, Math.min(100, value));
  if (clamped <= scoreBands.low.max) return scoreBands.low.label;
  if (clamped <= scoreBands.medium.max) return scoreBands.medium.label;
  return scoreBands.high.label;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.round(Math.max(min, Math.min(max, n)));
}

/** 0–100 — raw usage is the dominant dependence signal. */
function usageFrequencySignal(answers: OnboardingAnswers): number {
  const m: Record<OnboardingAnswers['usageFrequency'], number> = {
    lt_weekly: 6,
    weekly_not_daily: 20,
    '1_2_day': 40,
    '3_5_day': 64,
    '6plus_day': 88,
  };
  return m[answers.usageFrequency];
}

/** 0–100 — faster to first use → higher physical dependence. */
function firstUseSignal(answers: OnboardingAnswers): number {
  const m: Record<OnboardingAnswers['firstUseAfterWake'], number> = {
    '5min': 96,
    '15min': 84,
    '30min': 72,
    '1hr': 58,
    '1_2hr': 40,
    beyond2hr: 24,
    rarely: 10,
  };
  return m[answers.firstUseAfterWake];
}

/** 0–100 — focus dependence proxy. */
function focusDifficultySignal(answers: OnboardingAnswers): number {
  const m: Record<OnboardingAnswers['focusDifficulty'], number> = {
    rarely: 10,
    occasionally: 50,
    frequently: 80,
  };
  return m[answers.focusDifficulty];
}

export function calculateDependenceScore(answers: OnboardingAnswers): number {
  const w = { usage: 0.42, first: 0.34, focus: 0.18 };
  let raw =
    w.usage * usageFrequencySignal(answers) +
    w.first * firstUseSignal(answers) +
    w.focus * focusDifficultySignal(answers);

  // Small bump when user reports multiple delivery forms.
  if (answers.nicotineForms.length > 1) raw += 4;

  // Prior failed attempts due to cravings nudge the dependence signal up.
  if (answers.hasTriedToQuit === 'yes' && answers.pastRelapseReason === 'cravings') {
    raw += 6;
  }

  return clamp(raw);
}

export function calculateScores(answers: OnboardingAnswers): AssessmentResult {
  const primaryPattern = pickPrimaryPattern(answers);
  const dependenceScore = calculateDependenceScore(answers);

  return {
    scoringVersion: SCORING_VERSION,
    answersVersion: ANSWERS_VERSION,
    dependenceScore,
    dependenceBand: bandForScore(dependenceScore),
    primaryPattern,
    driverSummary: getDriverSummary(primaryPattern),
    firstWinSummary: getFirstWinSummary(primaryPattern),
    weekOneFocus: getWeekOneFocus(primaryPattern),
  };
}
