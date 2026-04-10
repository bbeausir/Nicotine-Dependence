/**
 * Funnel event names — align with PRD §11.5.
 * TODO(DATA): Wire PostHog (or other) in track().
 */

export const AnalyticsEvents = {
  landingViewed: 'landing_viewed',
  takeAssessmentClicked: 'take_assessment_clicked',
  signInClicked: 'sign_in_clicked',
  onboardingStarted: 'onboarding_started',
  onboardingSectionCompleted: 'onboarding_section_completed',
  onboardingCompleted: 'onboarding_completed',
  resultsViewed: 'results_viewed',
  saveResultsClicked: 'save_results_clicked',
  accountCreatedAfterResults: 'account_created_after_results',
  signedIn: 'signed_in',
  returnedToDashboard: 'returned_to_dashboard',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
