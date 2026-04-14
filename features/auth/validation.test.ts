import { describe, expect, it } from 'vitest';

import {
  getForgotPasswordValidationError,
  getSignInValidationError,
  getSignUpValidationError,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
} from '@/features/auth/validation';

describe('auth validation', () => {
  it('normalizes email by trimming and lowercasing', () => {
    expect(normalizeEmail('  TeSt@Example.COM  ')).toBe('test@example.com');
  });

  it('validates email format', () => {
    expect(isValidEmail('good@example.com')).toBe(true);
    expect(isValidEmail('bad-email')).toBe(false);
  });

  it('validates password length', () => {
    expect(isValidPassword('12345678')).toBe(true);
    expect(isValidPassword('short')).toBe(false);
  });

  it('returns sign-in validation errors', () => {
    expect(getSignInValidationError('', 'abcdefghi')).toBe('Enter your email address.');
    expect(getSignInValidationError('bad', 'abcdefghi')).toBe('Enter a valid email address.');
    expect(getSignInValidationError('ok@example.com', '')).toBe('Enter your password.');
    expect(getSignInValidationError('ok@example.com', 'abcdefghi')).toBeNull();
  });

  it('returns sign-up validation errors', () => {
    expect(getSignUpValidationError('', '12345678', '12345678')).toBe('Enter your email address.');
    expect(getSignUpValidationError('bad', '12345678', '12345678')).toBe('Enter a valid email address.');
    expect(getSignUpValidationError('ok@example.com', 'short', 'short')).toBe(
      'Password must be at least 8 characters.',
    );
    expect(getSignUpValidationError('ok@example.com', '12345678', '87654321')).toBe(
      'Passwords do not match.',
    );
    expect(getSignUpValidationError('ok@example.com', '12345678', '12345678')).toBeNull();
  });

  it('returns forgot-password validation errors', () => {
    expect(getForgotPasswordValidationError('')).toBe('Enter your email address.');
    expect(getForgotPasswordValidationError('bad')).toBe('Enter a valid email address.');
    expect(getForgotPasswordValidationError('ok@example.com')).toBeNull();
  });
});
