/**
 * Weighting and bucket config for rules-based scoring.
 * Tune numbers here — keep deterministic and documented.
 */

export const SCORING_VERSION = '0.2.0-rules';

/** Display buckets for 0–100 internal scores (PRD §10.4). */
export const scoreBands = {
  low: { min: 0, max: 33, label: 'Low' as const },
  medium: { min: 34, max: 66, label: 'Medium' as const },
  high: { min: 67, max: 100, label: 'High' as const },
};
