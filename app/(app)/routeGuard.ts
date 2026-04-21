type GuardInput = {
  authReady: boolean;
  hasUser: boolean;
};

// UX convenience redirect only — not a security boundary. Enforce eligibility server-side via RLS.
export function getAppRedirect(input: GuardInput): '/sign-in' | null {
  if (!input.authReady) {
    return null;
  }

  if (!input.hasUser) {
    return '/sign-in';
  }

  return null;
}
