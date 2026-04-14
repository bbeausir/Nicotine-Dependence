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
  const React = await import('react');

  const createHostComponent = (name: string) => {
    const Component = ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement(name, props, children);
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

import SignInScreen from '@/app/(auth)/sign-in';

async function renderScreen() {
  let renderer: ReactTestRenderer;

  await act(async () => {
    renderer = create(<SignInScreen />);
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

describe('SignInScreen', () => {
  it('shows a validation error for invalid credentials before calling signIn', async () => {
    const signIn = vi.fn().mockResolvedValue({ error: null });
    authMocks.useAuth.mockReturnValue({
      signIn,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('not-an-email');
      passwordInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(signIn).not.toHaveBeenCalled();
    expect(renderer.root.findByProps({ children: 'Enter a valid email address.' })).toBeTruthy();
  });

  it('calls signIn with a normalized email address', async () => {
    const signIn = vi.fn().mockResolvedValue({ error: null });
    authMocks.useAuth.mockReturnValue({
      signIn,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('  TeSt@Example.COM  ');
      passwordInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('shows the signIn error returned by auth', async () => {
    const signIn = vi.fn().mockResolvedValue({ error: 'Invalid credentials' });
    authMocks.useAuth.mockReturnValue({
      signIn,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('user@example.com');
      passwordInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(renderer.root.findByProps({ children: 'Invalid credentials' })).toBeTruthy();
    expect(routerMocks.replace).not.toHaveBeenCalled();
    expect(analyticsMocks.track).not.toHaveBeenCalled();
  });

  it('tracks analytics and redirects to /home after a successful sign-in', async () => {
    const signIn = vi.fn().mockResolvedValue({ error: null });
    authMocks.useAuth.mockReturnValue({
      signIn,
      authError: null,
    });

    const renderer = await renderScreen();
    const [emailInput, passwordInput] = getInputs(renderer);

    await act(async () => {
      emailInput.props.onChangeText('user@example.com');
      passwordInput.props.onChangeText('password123');
    });

    await pressSubmit(renderer);

    expect(analyticsMocks.track).toHaveBeenCalledWith(AnalyticsEvents.signedIn);
    expect(routerMocks.replace).toHaveBeenCalledWith('/home');
  });
});
