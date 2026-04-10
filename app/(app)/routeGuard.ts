type GuardInput = {
  authReady: boolean;
  assessmentReady: boolean;
  hasUser: boolean;
  hasResult: boolean;
};

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
