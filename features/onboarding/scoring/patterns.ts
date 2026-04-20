export const primaryPatternIds = [
  'stress_driver',
  'boredom_driver',
  'habit_driver',
] as const;

export type PrimaryPatternId = (typeof primaryPatternIds)[number];

export const primaryPatternLabels: Record<PrimaryPatternId, string> = {
  stress_driver: 'Stress Driver',
  boredom_driver: 'Boredom Driver',
  habit_driver: 'Habit Driver',
};
