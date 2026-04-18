type GuardInput = {
  authReady: boolean;
  assessmentReady: boolean;
  hasUser: boolean;
  hasResult: boolean;
};

// UX convenience redirect only — not a security boundary. Enforce eligibility server-side via RLS.
export function getAppRedirect(input: GuardInput): '/sign-in' | '/onboarding' | null {
  if (!input.authReady || !input.assessmentReady) {
    return null;
  }

  if (!input.hasUser) {
    return '/sign-in';
  }

  if (!input.hasResult) {
    return '/onboarding';
  }

  return null;
}
