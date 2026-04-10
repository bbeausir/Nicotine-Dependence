import type { PrimaryPatternId } from '@/features/onboarding/scoring/patterns';

/**
 * Narrative templates keyed by pattern — swap for CMS/config later.
 * TODO(PRODUCT): Author full library per PRD tone; avoid clinical / cheesy phrasing.
 */

export function getDriverSummary(pattern: PrimaryPatternId): string {
  const copy: Record<PrimaryPatternId, string> = {
    stress_regulator:
      'Your use may be wired to stress and activation more than nicotine itself. The loop is: pressure → reach → brief relief.',
    focus_protector:
      'Nicotine may be acting like a focus insurance policy—especially when attention feels fragile.',
    transition_soother:
      'Transitions and context switches may be the hidden trigger—small gaps get filled automatically.',
    social_armor:
      'High-stakes social or professional moments may feel “safer” with nicotine in the picture.',
    under_stimulation:
      'Boredom and under-stimulation can make automatic use the default background behavior.',
    habitual_user:
      'Use may be less about one story and more about a diffuse routine—still changeable once you see the pattern.',
  };
  return copy[pattern];
}

export function getFirstWinSummary(pattern: PrimaryPatternId): string {
  const copy: Record<PrimaryPatternId, string> = {
    stress_regulator:
      'Start by interrupting one automatic reach during your highest-pressure window—not the whole day.',
    focus_protector:
      'Try one low-stakes focus block without nicotine once—collect data, not a verdict.',
    transition_soother:
      'Pick one transition you repeat daily and add a 60-second pause before the reach.',
    social_armor:
      'Choose one social context to practice presence without “armor”—small exposure, not a hero moment.',
    under_stimulation:
      'Name one boredom window and replace the first reach with a tiny physical reset (stand, water, walk).',
    habitual_user:
      'Shrink the story to one habit chain: cue → reach → reward—and break one link this week.',
  };
  return copy[pattern];
}

export function getWeekOneFocus(pattern: PrimaryPatternId): string {
  const copy: Record<PrimaryPatternId, string> = {
    stress_regulator:
      'Notice each automatic reach. Label your #1 pressure window. Interrupt one reactive use on purpose this week.',
    focus_protector:
      'Pick one focus block as an experiment. Track quality for 25 minutes—curiosity, not judgment.',
    transition_soother:
      'Map three daily transitions. Add a 60-second pause before the first reach in one of them.',
    social_armor:
      'Choose one lower-stakes social slot to stay present without reaching—prove you can tolerate the edge.',
    under_stimulation:
      'Catch boredom early. Swap the first reach in one dull window for movement or water.',
    habitual_user:
      'Write your cue → reach → reward loop once. Change one cue this week—keep the rest stable.',
  };
  return copy[pattern];
}
