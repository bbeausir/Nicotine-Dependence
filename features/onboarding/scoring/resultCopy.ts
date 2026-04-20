import type { PrimaryPatternId } from '@/features/onboarding/scoring/patterns';

export function getDriverSummary(pattern: PrimaryPatternId): string {
  const copy: Record<PrimaryPatternId, string> = {
    stress_driver:
      'Your use tends to follow emotional pressure. The loop is: stress rises → reach → brief relief. Noticing that loop is the first step in changing it.',
    boredom_driver:
      'A lot of your reach is tied to under-stimulation. Boredom becomes the cue, and nicotine becomes the filler — it feels automatic.',
    habit_driver:
      'Your use is less about one emotion and more about a routine the brain has memorized. That makes it very changeable once you see the pattern.',
  };
  return copy[pattern];
}

export function getFirstWinSummary(pattern: PrimaryPatternId): string {
  const copy: Record<PrimaryPatternId, string> = {
    stress_driver:
      'Start small: interrupt one stress-driven reach this week. You are gathering data, not grading yourself.',
    boredom_driver:
      'Pick one boredom window and swap the first reach for a short physical reset — stand up, water, a short walk.',
    habit_driver:
      'Identify one cue in your daily routine that triggers a reach, and change what follows it just once this week.',
  };
  return copy[pattern];
}

export function getWeekOneFocus(pattern: PrimaryPatternId): string {
  const copy: Record<PrimaryPatternId, string> = {
    stress_driver:
      'Notice reaches tied to pressure. Label one recurring stress window. Interrupt a single reactive use on purpose.',
    boredom_driver:
      'Catch boredom early. Swap the first reach in one dull window for movement or a quick distraction.',
    habit_driver:
      'Write your cue → reach → reward loop down once. Change one cue this week — keep everything else stable.',
  };
  return copy[pattern];
}
