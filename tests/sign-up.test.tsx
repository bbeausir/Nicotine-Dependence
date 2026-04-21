import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AnalyticsEvents } from '@/lib/analytics/events';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const authMocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
}));

const routerMocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

const analyticsMocks = vi.hoisted(() => ({
  track: vi.fn(),
}));

vi.mock('react-native', async () => {
  const ReactNs = await import('react');

  const createHostComponent = (name: string) => {
    const Component = ({ children, ...props }: { children?: React.ReactNode }) =>
      ReactNs.createElement(name, props, children);
    Component.displayName = name;
    return Component;
  };

  return {
    Pressable: createHostComponent('Pressable'),
    StyleSheet: {
      create: <T,>(styles: T) => styles,
    },
    Text: createHostComponent('Text'),
    TextInput: createHostComponent('TextInput'),
    View: createHostComponent('View'),
  };
});

vi.mock('@/providers/AuthProvider', () => ({
  useAuth: authMocks.useAuth,
}));

vi.mock('@/lib/analytics/track', () => ({
  track: analyticsMocks.track,
}));

vi.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  useRouter: () => routerMocks,
}));

vi.mock('@/components/ui/Screen', () => ({
  Screen: ({ children }: { children: React.ReactNode }) => React.createElement('View', null, children),
}));

vi.mock('@/components/ui/PrimaryButton', () => ({
  PrimaryButton: ({
    children,
    onPress,
    disabled,
  }: {
    children: React.ReactNode;
    onPress: () => void;
    disabled?: boolean;
  }) =>
    React.createElement(
      'Pressable',
      { accessibilityRole: 'button', disabled, onPress },
      React.createElement('Text', null, children),
    ),
}));

import SignUpScreen from '@/app/(auth)/sign-up';

async function renderScreen() {
  let renderer: ReactTestRenderer;

  await act(async () => {
    renderer = create(<SignUpScreen />);
  });

  return renderer!;
}

function getInputs(renderer: ReactTestRenderer) {
  return renderer.root.findAllByType('TextInput');
}

function getSubmitButton(renderer: ReactTestRenderer) {
  return renderer.root.findByProps({ accessibilityRole: 'button' });
}

async function pressSubmit(renderer: ReactTestRenderer) {
  await act(async () => {
    getSubmitButton(renderer).props.onPress();
    await Promise.resolve();
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('SignUpScreen', () => {
  it('shows a validation error before calling signUp', async () => {
    const signUp = vi.fn().mockResolvedValue({ status: 'signed_in', error: null });
    authMocks.useAuth.mockReturnValue({
      signUp,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput, confirmInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('not-an-email');
      passwordInput.props.onChangeText('password123');
      confirmInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(signUp).not.toHaveBeenCalled();
    expect(renderer.root.findByProps({ children: 'Enter a valid email address.' })).toBeTruthy();
  });

  it('calls signUp with a normalized email address', async () => {
    const signUp = vi.fn().mockResolvedValue({ status: 'awaiting_confirmation', error: null });
    authMocks.useAuth.mockReturnValue({
      signUp,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput, confirmInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('  TeSt@Example.COM  ');
      passwordInput.props.onChangeText('password123');
      confirmInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(signUp).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('shows the signUp error and does not redirect', async () => {
    const signUp = vi.fn().mockResolvedValue({ status: 'error', error: 'User already registered' });
    authMocks.useAuth.mockReturnValue({
      signUp,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput, confirmInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('user@example.com');
      passwordInput.props.onChangeText('password123');
      confirmInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    // `friendlyAuthError` maps "user already registered" to this user-facing copy.
    expect(
      renderer.root.findByProps({
        children: 'An account with this email already exists. Try signing in.',
      }),
    ).toBeTruthy();
    expect(routerMocks.replace).not.toHaveBeenCalled();
    expect(analyticsMocks.track).not.toHaveBeenCalled();
  });

  it('tracks analytics and redirects to /home only when signed in immediately', async () => {
    const signUp = vi.fn().mockResolvedValue({ status: 'signed_in', error: null });
    authMocks.useAuth.mockReturnValue({
      signUp,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput, confirmInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('user@example.com');
      passwordInput.props.onChangeText('password123');
      confirmInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(analyticsMocks.track).toHaveBeenCalledWith(AnalyticsEvents.accountCreatedAfterResults);
    expect(analyticsMocks.track).toHaveBeenCalledWith(AnalyticsEvents.signedIn);
    expect(routerMocks.replace).toHaveBeenCalledWith('/home');
  });

  it('does not redirect when awaiting confirmation and shows next-step messaging', async () => {
    const signUp = vi.fn().mockResolvedValue({ status: 'awaiting_confirmation', error: null });
    authMocks.useAuth.mockReturnValue({
      signUp,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput, confirmInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('user@example.com');
      passwordInput.props.onChangeText('password123');
      confirmInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(routerMocks.replace).not.toHaveBeenCalled();
    expect(analyticsMocks.track).toHaveBeenCalledWith(AnalyticsEvents.accountCreatedAfterResults);
    expect(analyticsMocks.track).not.toHaveBeenCalledWith(AnalyticsEvents.signedIn);
    expect(renderer.root.findByProps({ children: 'Next step' })).toBeTruthy();
    const bodyTexts = renderer.root
      .findAllByType('Text')
      .map((n) => n.props.children)
      .filter((c): c is string => typeof c === 'string');
    expect(bodyTexts.some((t) => t.includes('When email confirmation is required'))).toBe(true);
  });
});
