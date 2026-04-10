/** PRD §10.3 — labels for assessment UI. */

export const sectionTitles = [
  'Utilization',
  'Environment & triggers',
  'Cognitive & identity',
  'Historical resilience',
  'Mission',
] as const;

export const assessmentCopy = {
  nicotineForms: {
    prompt: 'What form(s) of nicotine are you currently using?',
    options: [
      { id: 'pouch', label: 'Pouch' },
      { id: 'vape', label: 'Vape' },
      { id: 'dip', label: 'Dip' },
      { id: 'cigarette', label: 'Cigarette' },
      { id: 'other', label: 'Other' },
    ],
  },
  dailyUseEvents: {
    prompt: 'On an average day, how many nicotine-use events occur?',
    options: [
      { id: '1_2', label: '1–2' },
      { id: '3_4', label: '3–4' },
      { id: '5_7', label: '5–7' },
      { id: '8_10', label: '8–10' },
      { id: '11_15', label: '11–15' },
      { id: '16plus', label: '16+' },
    ],
  },
  firstUseAfterWake: {
    prompt: 'How long after waking do you reach for your first dose?',
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
  urgeEnvironments: {
    prompt: 'In which environments is the urge strongest?',
    options: [
      { id: 'work', label: 'Work / studying' },
      { id: 'commute', label: 'Commuting / driving' },
      { id: 'social', label: 'Social / drinking' },
      { id: 'post_meals', label: 'Post-meals' },
      { id: 'transitions', label: 'Transitions between tasks' },
      { id: 'habitual_all', label: 'Habitual use / all of the above' },
    ],
  },
  emotionalPrecursor: {
    prompt: 'Which internal state most frequently precedes an automatic reach?',
    options: [
      { id: 'stress', label: 'Stress / anxiety' },
      { id: 'boredom', label: 'Boredom / under-stimulation' },
      { id: 'lack_focus', label: 'Lack of focus' },
      { id: 'irritability', label: 'Irritability' },
    ],
  },
  highStakesReliance: {
    prompt: 'Does nicotine feel necessary to navigate high-stakes social or professional interactions?',
    options: [
      { id: 'no', label: 'No' },
      { id: 'sometimes', label: 'Sometimes' },
      { id: 'yes', label: 'Yes' },
    ],
  },
  performanceBelief: {
    prompt: 'Do you believe nicotine is a primary driver of your professional performance or focus?',
    options: [
      { id: 'no', label: 'No' },
      { id: 'somewhat', label: 'Somewhat' },
      { id: 'yes', label: 'Yes' },
    ],
  },
  reductionConcern: {
    prompt: 'What is your primary concern regarding reduced usage?',
    options: [
      { id: 'focus', label: 'Loss of focus' },
      { id: 'brain_fog', label: 'Brain fog' },
      { id: 'irritability_social', label: 'Irritability / social friction' },
      { id: 'weight', label: 'Weight gain' },
    ],
  },
  selfImageConflict: {
    prompt: 'How much does being a nicotine user conflict with your self-image as a high performer?',
    sliderHint: '1 = not at all · 10 = strongly',
  },
  pastAttempts: {
    prompt: 'How many times have you attempted to reduce or quit in the last 12 months?',
    options: [
      { id: '0', label: '0' },
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3plus', label: '3+' },
    ],
  },
  crashReason: {
    prompt: 'In past attempts, what was the primary cause of system crash?',
    options: [
      { id: 'stress_event', label: 'Extreme stress event' },
      { id: 'social', label: 'Social pressure' },
      { id: 'boredom', label: 'Boredom' },
      { id: 'cravings', label: 'Persistent cravings' },
    ],
  },
  sprintGoal: {
    prompt: 'What is your primary objective for this 14-day sprint?',
    options: [
      { id: 'abstinence', label: 'Total abstinence' },
      { id: 'half', label: '50% reduction' },
      { id: 'awareness', label: 'Pattern identification / awareness' },
    ],
  },
} as const;
