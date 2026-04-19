import { describe, expect, it } from 'vitest';

import { parseDailyCost, parseDateInput } from '@/features/profile/profileFormHelpers';

describe('parseDateInput', () => {
  it('returns null with no error for empty input (clearing the field)', () => {
    expect(parseDateInput('')).toEqual({ value: null, error: null });
    expect(parseDateInput('   ')).toEqual({ value: null, error: null });
  });

  it('accepts a well-formed YYYY-MM-DD date', () => {
    expect(parseDateInput('2026-04-18')).toEqual({ value: '2026-04-18', error: null });
  });

  it('rejects non-ISO formats', () => {
    expect(parseDateInput('4/18/2026').error).toBe('Use YYYY-MM-DD.');
    expect(parseDateInput('2026/04/18').error).toBe('Use YYYY-MM-DD.');
  });

  it('rejects calendar-impossible dates', () => {
    expect(parseDateInput('2026-02-30').error).toBe('That date doesn’t exist.');
    expect(parseDateInput('2026-13-01').error).toBe('That date doesn’t exist.');
  });
});

describe('parseDailyCost', () => {
  it('returns null with no error for empty input', () => {
    expect(parseDailyCost('')).toEqual({ value: null, error: null });
    expect(parseDailyCost('   ')).toEqual({ value: null, error: null });
  });

  it('parses a plain number', () => {
    expect(parseDailyCost('12.5')).toEqual({ value: 12.5, error: null });
  });

  it('strips a leading dollar sign and commas', () => {
    expect(parseDailyCost('$1,234.50')).toEqual({ value: 1234.5, error: null });
  });

  it('rounds to cents', () => {
    expect(parseDailyCost('12.345')).toEqual({ value: 12.35, error: null });
  });

  it('rejects negatives and non-numeric input', () => {
    expect(parseDailyCost('-5').error).toBe('Enter a positive amount.');
    expect(parseDailyCost('abc').error).toBe('Enter a positive amount.');
  });

  it('rejects amounts above the cap', () => {
    expect(parseDailyCost('10000').error).toBe('Keep it under $10,000.');
  });
});
