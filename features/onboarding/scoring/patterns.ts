/**
 * Primary pattern taxonomy (PRD §10.4).
 * TODO(PRODUCT): Finalize mapping rules in patterns + calculateScores.
 */

export const primaryPatternIds = [
  'stress_regulator',
  'focus_protector',
  'transition_soother',
  'social_armor',
  'under_stimulation',
  'habitual_user',
] as const;

export type PrimaryPatternId = (typeof primaryPatternIds)[number];

export const primaryPatternLabels: Record<PrimaryPatternId, string> = {
  stress_regulator: 'Stress Regulator',
  focus_protector: 'Focus Protector',
  transition_soother: 'Transition Soother',
  social_armor: 'Social Armor User',
  under_stimulation: 'Under-stimulation User',
  habitual_user: 'Habitual User',
};
