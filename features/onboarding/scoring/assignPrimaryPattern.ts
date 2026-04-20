import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import {
  type PrimaryPatternId,
  primaryPatternIds,
} from '@/features/onboarding/scoring/patterns';

/**
 * Ties broken in fixed order. `habit_driver` is last so it only wins when
 * the other two signals are absent.
 */
const tieBreakOrder: PrimaryPatternId[] = [
  'stress_driver',
  'boredom_driver',
  'habit_driver',
];

const ternaryWeight = {
  rarely: 0,
  occasionally: 6,
  frequently: 14,
} as const;

export function scorePatternCandidates(
  answers: OnboardingAnswers,
): Record<PrimaryPatternId, number> {
  const s: Record<PrimaryPatternId, number> = {
    stress_driver: 0,
    boredom_driver: 0,
    habit_driver: 0,
  };

  s.stress_driver += ternaryWeight[answers.emotionalCoping];
  if (answers.hasTriedToQuit === 'yes' && answers.pastRelapseReason === 'stress_event') {
    s.stress_driver += 8;
  }
  if (['5min', '15min', '30min'].includes(answers.firstUseAfterWake)) {
    s.stress_driver += 4;
  }

  s.boredom_driver += ternaryWeight[answers.boredomUse];
  if (answers.hasTriedToQuit === 'yes' && answers.pastRelapseReason === 'boredom') {
    s.boredom_driver += 8;
  }

  // Habit baseline scales with raw usage and morning-first-use urgency —
  // wins when neither emotional nor boredom coping is a strong signal.
  s.habit_driver += 4;
  if (answers.usageFrequency === '3_5_day') s.habit_driver += 6;
  if (answers.usageFrequency === '6plus_day') s.habit_driver += 10;
  if (['5min', '15min'].includes(answers.firstUseAfterWake)) s.habit_driver += 4;
  if (answers.focusDifficulty === 'frequently') s.habit_driver += 3;

  return s;
}

export function pickPrimaryPattern(answers: OnboardingAnswers): PrimaryPatternId {
  const scores = scorePatternCandidates(answers);
  let max = -Infinity;
  for (const id of primaryPatternIds) {
    max = Math.max(max, scores[id]);
  }
  for (const id of tieBreakOrder) {
    if (scores[id] === max) return id;
  }
  return 'habit_driver';
}
