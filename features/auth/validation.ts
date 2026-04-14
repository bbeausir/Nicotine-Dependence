const SIMPLE_EMAIL_REGEX = /\S+@\S+\.\S+/;
const MIN_PASSWORD_LENGTH = 8;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return SIMPLE_EMAIL_REGEX.test(normalizeEmail(value));
}

export function isValidPassword(value: string): boolean {
  return value.length >= MIN_PASSWORD_LENGTH;
}

export function getForgotPasswordValidationError(email: string): string | null {
  if (!normalizeEmail(email)) {
    return 'Enter your email address.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  return null;
}

export function getSignInValidationError(email: string, password: string): string | null {
  if (!normalizeEmail(email)) {
    return 'Enter your email address.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  if (!password) {
    return 'Enter your password.';
  }
  return null;
}

export function getSignUpValidationError(
  email: string,
  password: string,
  confirmPassword: string,
): string | null {
  if (!normalizeEmail(email)) {
    return 'Enter your email address.';
  }
  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }
  if (!isValidPassword(password)) {
    return 'Password must be at least 8 characters.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}
