export const TRIGGER_OPTIONS = [
  'stressed',
  'working',
  'bored',
  'driving',
  'after meals',
  'with coffee',
  'drinking',
  'social situations',
  'late at night',
  'other',
] as const;

export const BENEFIT_OPTIONS = [
  'calms me down',
  'helps me focus',
  'gives me a break',
  'helps with boredom',
  'feels like a reward',
  'helps me feel normal',
  'gives me energy',
  'makes social moments easier',
] as const;

export const OUTCOME_OPTIONS = [
  "I'm back where I started",
  "I'm already thinking about the next one",
  'the shift wears off quickly',
  'I feel briefly different, then normal again',
  'I barely notice the effect lasted',
  'I feel dependent on the routine',
  'I use more automatically than I want to',
] as const;

export const MAX_TRIGGERS = 3;
export const TOTAL_INTERACTIVE_STEPS = 3;
