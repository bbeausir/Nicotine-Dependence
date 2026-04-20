import type { PrimaryPatternId } from '@/features/onboarding/scoring/patterns';

export type BandLabel = 'Low' | 'Medium' | 'High';

export type AssessmentResult = {
  scoringVersion: string;
  answersVersion: string;
  dependenceScore: number;
  dependenceBand: BandLabel;
  primaryPattern: PrimaryPatternId;
  driverSummary: string;
  firstWinSummary: string;
  weekOneFocus: string;
};
