export const assessmentCopy = {
  usageFrequency: {
    prompt: 'How often are you typically using nicotine?',
    options: [
      { id: 'lt_weekly', label: 'Less than once a week' },
      { id: 'weekly_not_daily', label: 'Weekly, but not daily' },
      { id: '1_2_day', label: 'One or two times per day' },
      { id: '3_5_day', label: 'Three to five times per day' },
      { id: '6plus_day', label: 'Six or more times per day' },
    ],
  },
  firstUseAfterWake: {
    prompt: 'How soon after waking do you first use nicotine?',
    options: [
      { id: '5min', label: 'Within 5 minutes' },
      { id: '15min', label: 'Within 15 minutes' },
      { id: '30min', label: 'Within 30 minutes' },
      { id: '1hr', label: 'Within 1 hour' },
      { id: '1_2hr', label: '1–2 hours' },
      { id: 'beyond2hr', label: 'Beyond 2 hours' },
      { id: 'rarely', label: 'Rarely' },
    ],
  },
  hasTriedToQuit: {
    prompt: 'Have you tried to quit in the past?',
    options: [
      { id: 'no', label: 'No' },
      { id: 'yes', label: 'Yes' },
    ],
  },
  pastRelapseReason: {
    prompt: 'In past attempts, what has usually pulled you back?',
    options: [
      { id: 'stress_event', label: 'Extreme stress event' },
      { id: 'social', label: 'Social pressure' },
      { id: 'boredom', label: 'Boredom' },
      { id: 'cravings', label: 'Persistent cravings' },
      { id: 'other', label: 'Something else' },
    ],
  },
  firstUseAge: {
    prompt: 'Around what age did you first use nicotine?',
    options: [
      { id: 'le_12', label: '12 or younger' },
      { id: '13_16', label: '13 to 16' },
      { id: '17_24', label: '17 to 24' },
      { id: '25plus', label: '25 or older' },
    ],
  },
  focusDifficulty: {
    prompt: 'Do you find it difficult to perform or focus without nicotine?',
    options: [
      { id: 'rarely', label: 'Rarely or never' },
      { id: 'occasionally', label: 'Occasionally' },
      { id: 'frequently', label: 'Frequently' },
    ],
  },
  emotionalCoping: {
    prompt: 'Do you use nicotine as a way to cope with emotional discomfort or stress?',
    options: [
      { id: 'rarely', label: 'Rarely or never' },
      { id: 'occasionally', label: 'Occasionally' },
      { id: 'frequently', label: 'Frequently' },
    ],
  },
  boredomUse: {
    prompt: 'Do you use nicotine out of boredom?',
    options: [
      { id: 'rarely', label: 'Rarely or never' },
      { id: 'occasionally', label: 'Occasionally' },
      { id: 'frequently', label: 'Frequently' },
    ],
  },
  nicotineForms: {
    prompt: 'What form(s) of nicotine are you currently using?',
    options: [
      { id: 'pouch', label: 'Pouches' },
      { id: 'vape', label: 'Vape' },
      { id: 'dip', label: 'Dip' },
      { id: 'cigarette', label: 'Cigarettes' },
      { id: 'cigar', label: 'Cigars' },
      { id: 'other', label: 'Something else' },
    ],
  },
} as const;
