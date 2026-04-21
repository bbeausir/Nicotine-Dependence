import { describe, expect, it } from 'vitest';

import { getAppRedirect } from '@/app/(app)/routeGuard';

describe('getAppRedirect', () => {
  const cases = [
    { authReady: false, hasUser: false, expected: null },
    { authReady: false, hasUser: true, expected: null },
    { authReady: true, hasUser: false, expected: '/sign-in' },
    { authReady: true, hasUser: true, expected: null },
  ] as const;

  it.each(cases)(
    'returns $expected for authReady=$authReady hasUser=$hasUser',
    ({ authReady, hasUser, expected }) => {
      expect(getAppRedirect({ authReady, hasUser })).toBe(expected);
    },
  );

  it('does not redirect an authenticated user to /onboarding when assessment is missing', () => {
    // Onboarding is a pre-auth marketing flow, not a post-auth gate.
    expect(getAppRedirect({ authReady: true, hasUser: true })).toBeNull();
  });
});
