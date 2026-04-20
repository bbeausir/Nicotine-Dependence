export const SCORING_VERSION = '1.0.0';

/** Display buckets for the 0–100 dependence score. */
export const scoreBands = {
  low: { min: 0, max: 33, label: 'Low' as const },
  medium: { min: 34, max: 66, label: 'Medium' as const },
  high: { min: 67, max: 100, label: 'High' as const },
};
