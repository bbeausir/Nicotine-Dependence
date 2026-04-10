import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import { pickPrimaryPattern } from '@/features/onboarding/scoring/assignPrimaryPattern';
import { SCORING_VERSION, scoreBands } from '@/features/onboarding/scoring/config';
import type { AssessmentResult } from '@/features/onboarding/scoring/types';
import {
  getDriverSummary,
  getFirstWinSummary,
  getWeekOneFocus,
} from '@/features/onboarding/scoring/resultCopy';

function bandForScore(value: number): AssessmentResult['cravingReactivityLabel'] {
  const clamped = Math.max(0, Math.min(100, value));
  if (clamped <= scoreBands.low.max) return scoreBands.low.label;
  if (clamped <= scoreBands.medium.max) return scoreBands.medium.label;
  return scoreBands.high.label;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.round(Math.max(min, Math.min(max, n)));
}

/** 0–100: higher = more daily dependence signal */
function dailyUseSignal(answers: OnboardingAnswers): number {
  const m: Record<OnboardingAnswers['dailyUseEvents'], number> = {
    '1_2': 18,
    '3_4': 32,
    '5_7': 46,
    '8_10': 60,
    '11_15': 74,
    '16plus': 88,
  };
  return m[answers.dailyUseEvents];
}

/** 0–100: higher = faster to first use */
function firstUseSignal(answers: OnboardingAnswers): number {
  const m: Record<OnboardingAnswers['firstUseAfterWake'], number> = {
    '5min': 96,
    '15min': 84,
    '30min': 72,
    '1hr': 58,
    '1_2hr': 40,
    'beyond2hr': 24,
    rarely: 10,
  };
  return m[answers.firstUseAfterWake];
}

function triggerIntensity(answers: OnboardingAnswers): number {
  const env = answers.urgeEnvironments;
  let base = Math.min(24 + env.length * 10, 52);
  if (env.includes('habitual_all')) base = Math.max(base, 68);
  return base;
}

function highStakesSignal(answers: OnboardingAnswers): number {
  const m: Record<OnboardingAnswers['highStakesReliance'], number> = {
    no: 12,
    sometimes: 48,
    yes: 82,
  };
  return m[answers.highStakesReliance];
}

function pastAttemptsSignal(answers: OnboardingAnswers): number {
  const m: Record<OnboardingAnswers['pastAttempts'], number> = {
    '0': 8,
    '1': 32,
    '2': 52,
    '3plus': 72,
  };
  return m[answers.pastAttempts];
}

function dependenceScore(answers: OnboardingAnswers): number {
  const w = {
    daily: 0.24,
    first: 0.24,
    triggers: 0.22,
    stakes: 0.18,
    attempts: 0.12,
  };
  const raw =
    w.daily * dailyUseSignal(answers) +
    w.first * firstUseSignal(answers) +
    w.triggers * triggerIntensity(answers) +
    w.stakes * highStakesSignal(answers) +
    w.attempts * pastAttemptsSignal(answers);
  return clamp(raw);
}

function cravingReactivityScore(answers: OnboardingAnswers): number {
  let raw = 22;
  raw += 0.35 * triggerIntensity(answers);

  const emo = answers.emotionalPrecursor;
  if (emo === 'stress') raw += 14;
  if (emo === 'boredom') raw += 12;
  if (emo === 'lack_focus') raw += 10;
  if (emo === 'irritability') raw += 10;

  const perf = answers.performanceBelief;
  if (perf === 'yes') raw += 18;
  if (perf === 'somewhat') raw += 8;

  raw += 0.22 * highStakesSignal(answers);

  if (answers.pastAttempts !== '0' && answers.crashReason === 'cravings') {
    raw += 16;
  }
  if (answers.pastAttempts !== '0' && answers.crashReason === 'stress_event') {
    raw += 10;
  }

  return clamp(raw);
}

function regulationConfidenceScore(answers: OnboardingAnswers): number {
  let raw = 88;

  raw -= answers.selfImageConflict * 3.2;

  const pa = answers.pastAttempts;
  if (pa === '1') raw -= 8;
  if (pa === '2') raw -= 16;
  if (pa === '3plus') raw -= 26;

  if (answers.emotionalPrecursor === 'stress') raw -= 10;
  if (answers.reductionConcern === 'brain_fog') raw -= 8;
  if (answers.reductionConcern === 'irritability_social') raw -= 6;

  if (answers.performanceBelief === 'no') raw += 10;
  if (answers.performanceBelief === 'somewhat') raw += 4;

  if (['beyond2hr', 'rarely'].includes(answers.firstUseAfterWake)) raw += 8;
  if (answers.firstUseAfterWake === '1_2hr') raw += 4;

  if (answers.sprintGoal === 'awareness') raw += 8;
  if (answers.sprintGoal === 'half') raw += 4;

  if (answers.highStakesReliance === 'yes') raw -= 6;

  return clamp(raw);
}

/**
 * Rules-based scoring — deterministic and testable (PRD §10.4).
 */
export function calculateScores(answers: OnboardingAnswers): AssessmentResult {
  const primaryPattern = pickPrimaryPattern(answers);

  const dependence = dependenceScore(answers);
  const craving = cravingReactivityScore(answers);
  const regulation = regulationConfidenceScore(answers);

  return {
    scoringVersion: SCORING_VERSION,
    dependenceScore: dependence,
    cravingReactivityScore: craving,
    cravingReactivityLabel: bandForScore(craving),
    regulationConfidenceScore: regulation,
    regulationConfidenceLabel: bandForScore(regulation),
    primaryPattern,
    driverSummary: getDriverSummary(primaryPattern),
    firstWinSummary: getFirstWinSummary(primaryPattern),
    weekOneFocus: getWeekOneFocus(primaryPattern),
  };
}
