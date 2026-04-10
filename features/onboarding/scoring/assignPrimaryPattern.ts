import type { OnboardingAnswers } from '@/features/onboarding/schema/onboardingAnswers';
import {
  type PrimaryPatternId,
  primaryPatternIds,
} from '@/features/onboarding/scoring/patterns';

/**
 * Rules-based pattern assignment (PRD §10.4). Higher score wins; ties use `tieBreakOrder`.
 */
const tieBreakOrder: PrimaryPatternId[] = [
  'stress_regulator',
  'focus_protector',
  'social_armor',
  'transition_soother',
  'under_stimulation',
  'habitual_user',
];

export function scorePatternCandidates(answers: OnboardingAnswers): Record<PrimaryPatternId, number> {
  const s = Object.fromEntries(primaryPatternIds.map((id) => [id, 0])) as Record<
    PrimaryPatternId,
    number
  >;

  const env = new Set(answers.urgeEnvironments);
  const fastFirst = ['5min', '15min', '30min'].includes(answers.firstUseAfterWake);

  // Stress regulator
  if (answers.emotionalPrecursor === 'stress') s.stress_regulator += 38;
  if (env.has('work')) s.stress_regulator += 18;
  if (fastFirst) s.stress_regulator += 12;
  if (answers.highStakesReliance === 'yes') s.stress_regulator += 10;

  // Focus protector
  if (answers.emotionalPrecursor === 'lack_focus') s.focus_protector += 36;
  if (env.has('work')) s.focus_protector += 14;
  if (answers.performanceBelief === 'yes') s.focus_protector += 22;
  if (answers.performanceBelief === 'somewhat') s.focus_protector += 8;

  // Transition soother
  if (env.has('transitions') || env.has('commute')) s.transition_soother += 24;
  if (env.has('habitual_all')) s.transition_soother += 18;
  if (answers.emotionalPrecursor === 'irritability') s.transition_soother += 10;

  // Social armor
  if (env.has('social')) s.social_armor += 26;
  if (answers.highStakesReliance !== 'no') s.social_armor += 22;
  if (answers.emotionalPrecursor === 'stress' && answers.highStakesReliance === 'yes') {
    s.social_armor += 8;
  }

  // Under-stimulation
  if (answers.emotionalPrecursor === 'boredom') s.under_stimulation += 42;
  if (answers.urgeEnvironments.length >= 3) s.under_stimulation += 6;

  // Habitual (diffuse / routine-heavy)
  s.habitual_user += 12;
  if (env.has('habitual_all')) s.habitual_user += 28;
  if (answers.urgeEnvironments.length >= 5) s.habitual_user += 10;

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
  return 'habitual_user';
}
