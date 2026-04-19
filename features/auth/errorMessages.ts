const ERROR_MAP: Record<string, string> = {
  'invalid login credentials': 'Incorrect email or password.',
  'invalid credentials': 'Incorrect email or password.',
  'email not confirmed': 'Check your inbox — you need to verify your email before signing in.',
  'user already registered': 'An account with this email already exists. Try signing in.',
  'account exists': 'An account with this email already exists. Try signing in.',
  'reset failed': "Couldn't send the reset email. Try again in a moment.",
};

const FALLBACK = 'Something went wrong. Please try again.';

export function friendlyAuthError(raw: string | null): string | null {
  if (!raw) return null;
  const key = raw.toLowerCase().trim();
  return ERROR_MAP[key] ?? FALLBACK;
}
