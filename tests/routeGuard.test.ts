import { describe, expect, it } from 'vitest';

import { getAppRedirect } from '@/app/(app)/routeGuard';

describe('getAppRedirect', () => {
  it('holds redirects until hydration is ready', () => {
    const redirect = getAppRedirect({
      authReady: true,
      assessmentReady: false,
      hasUser: true,
      hasResult: false,
    });
    expect(redirect).toBeNull();
  });

  it('redirects signed-out users to sign in', () => {
    const redirect = getAppRedirect({
      authReady: true,
      assessmentReady: true,
      hasUser: false,
      hasResult: false,
    });
    expect(redirect).toBe('/sign-in');
  });

  it('redirects authed users without result to onboarding', () => {
    const redirect = getAppRedirect({
      authReady: true,
      assessmentReady: true,
      hasUser: true,
      hasResult: false,
    });
    expect(redirect).toBe('/onboarding');
  });
});
