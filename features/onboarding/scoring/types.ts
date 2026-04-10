import type { PrimaryPatternId } from '@/features/onboarding/scoring/patterns';

export type BandLabel = 'Low' | 'Medium' | 'High';

export type AssessmentResult = {
  scoringVersion: string;
  dependenceScore: number;
  cravingReactivityScore: number;
  cravingReactivityLabel: BandLabel;
  regulationConfidenceScore: number;
  regulationConfidenceLabel: BandLabel;
  primaryPattern: PrimaryPatternId;
  driverSummary: string;
  firstWinSummary: string;
  weekOneFocus: string;
};
