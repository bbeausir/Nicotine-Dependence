import { describe, expect, it } from 'vitest';

import { computeQuitStats } from '@/features/home/useQuitStats';

function at(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d);
}

describe('computeQuitStats', () => {
  it('returns null when no quit date is set', () => {
    expect(computeQuitStats(null, null, at(2026, 4, 18))).toBeNull();
  });

  it('returns null for malformed quit date strings', () => {
    expect(computeQuitStats('not-a-date', 10, at(2026, 4, 18))).toBeNull();
  });

  it('treats the quit date itself as day 0', () => {
    const stats = computeQuitStats('2026-04-18', null, at(2026, 4, 18));
    expect(stats).not.toBeNull();
    expect(stats!.stage).toBe('free');
    expect(stats!.daysFree).toBe(0);
  });

  it('counts whole days since the quit date', () => {
    const stats = computeQuitStats('2026-04-04', null, at(2026, 4, 18));
    expect(stats!.daysFree).toBe(14);
  });

  it('returns countdown stage with daysUntilQuit when quit date is in the future', () => {
    const stats = computeQuitStats('2026-04-25', 12, at(2026, 4, 18));
    expect(stats!.stage).toBe('countdown');
    expect(stats!.daysUntilQuit).toBe(7);
    expect(stats!.daysFree).toBe(0);
    expect(stats!.moneySaved).toBeNull();
    expect(stats!.nextMilestone).toBeNull();
  });

  it('computes money saved as dailyCost * daysFree, rounded to cents', () => {
    const stats = computeQuitStats('2026-04-04', 12.5, at(2026, 4, 18));
    expect(stats!.moneySaved).toBe(175);
  });

  it('returns null moneySaved when dailyCost is null', () => {
    const stats = computeQuitStats('2026-04-04', null, at(2026, 4, 18));
    expect(stats!.moneySaved).toBeNull();
  });

  it('picks the next milestone the user has not yet reached', () => {
    const stats = computeQuitStats('2026-04-04', null, at(2026, 4, 18));
    expect(stats!.nextMilestone).toEqual({ days: 21, label: '3 Weeks', daysAway: 7 });
  });

  it('advances to the next milestone the day after one is reached', () => {
    const stats = computeQuitStats('2026-04-04', null, at(2026, 4, 11));
    expect(stats!.nextMilestone).toEqual({ days: 14, label: '2 Weeks', daysAway: 7 });
  });

  it('advances from 3 Weeks to 1 Month after the three-week milestone is reached', () => {
    const stats = computeQuitStats('2026-04-04', null, at(2026, 4, 25));
    expect(stats!.nextMilestone).toEqual({ days: 30, label: '1 Month', daysAway: 9 });
  });

  it('returns null nextMilestone after the final one is passed', () => {
    const stats = computeQuitStats('2024-01-01', null, at(2026, 4, 18));
    expect(stats!.nextMilestone).toBeNull();
  });

  it('parses quit_date as a local date so DST and timezones do not shift the day', () => {
    const stats = computeQuitStats('2026-03-08', null, at(2026, 3, 9));
    expect(stats!.daysFree).toBe(1);
  });

  it('ignores negative dailyCost', () => {
    const stats = computeQuitStats('2026-04-04', -5, at(2026, 4, 18));
    expect(stats!.moneySaved).toBeNull();
  });
});
