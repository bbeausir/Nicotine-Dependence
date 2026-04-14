import { describe, expect, it } from 'vitest';

import { getAppRedirect } from '@/app/(app)/routeGuard';

describe('getAppRedirect', () => {
  const cases = [
    { authReady: false, assessmentReady: false, hasUser: false, hasResult: false, expected: null },
    { authReady: false, assessmentReady: false, hasUser: false, hasResult: true, expected: null },
    { authReady: false, assessmentReady: false, hasUser: true, hasResult: false, expected: null },
    { authReady: false, assessmentReady: false, hasUser: true, hasResult: true, expected: null },
    { authReady: false, assessmentReady: true, hasUser: false, hasResult: false, expected: null },
    { authReady: false, assessmentReady: true, hasUser: false, hasResult: true, expected: null },
    { authReady: false, assessmentReady: true, hasUser: true, hasResult: false, expected: null },
    { authReady: false, assessmentReady: true, hasUser: true, hasResult: true, expected: null },
    { authReady: true, assessmentReady: false, hasUser: false, hasResult: false, expected: null },
    { authReady: true, assessmentReady: false, hasUser: false, hasResult: true, expected: null },
    { authReady: true, assessmentReady: false, hasUser: true, hasResult: false, expected: null },
    { authReady: true, assessmentReady: false, hasUser: true, hasResult: true, expected: null },
    { authReady: true, assessmentReady: true, hasUser: false, hasResult: false, expected: '/sign-in' },
    { authReady: true, assessmentReady: true, hasUser: false, hasResult: true, expected: '/sign-in' },
    { authReady: true, assessmentReady: true, hasUser: true, hasResult: false, expected: '/onboarding' },
    { authReady: true, assessmentReady: true, hasUser: true, hasResult: true, expected: null },
  ] as const;

  it.each(cases)(
    'returns $expected for authReady=$authReady assessmentReady=$assessmentReady hasUser=$hasUser hasResult=$hasResult',
    ({ authReady, assessmentReady, hasUser, hasResult, expected }) => {
      expect(
        getAppRedirect({
          authReady,
          assessmentReady,
          hasUser,
          hasResult,
        }),
      ).toBe(expected);
    },
  );
});
