import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type PrimaryButtonProps = PropsWithChildren<{
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}>;

export function PrimaryButton({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: PrimaryButtonProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  const bg = isPrimary
    ? t.color.accent
    : isGhost
      ? 'transparent'
      : t.color.surfaceElevated;
  const fg = isPrimary ? '#ffffff' : t.color.textPrimary;
  const borderColor = isGhost
    ? t.color.border
    : isPrimary
      ? 'rgba(255, 255, 255, 0.28)'
      : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
        },
        isGhost && styles.ghostBorder,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.label, { color: fg, fontFamily: t.typeface.uiSemibold }]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ghostBorder: {
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
