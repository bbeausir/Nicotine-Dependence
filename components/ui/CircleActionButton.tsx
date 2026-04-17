import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type CircleActionButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'accent';
};

const CIRCLE_SIZE = 120;

export function CircleActionButton({ icon, label, onPress, variant = 'default' }: CircleActionButtonProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const isAccent = variant === 'accent';

  const circleBg = isAccent
    ? scheme === 'dark'
      ? 'rgba(181, 147, 91, 0.22)'
      : '#fef3c7'
    : t.color.surfaceElevated;

  const iconColor = isAccent
    ? scheme === 'dark'
      ? '#b5935b'
      : '#d97706'
    : t.color.textSecondary;

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View
        style={[
          styles.circle,
          { backgroundColor: circleBg, borderColor: t.color.border },
        ]}>
        <Ionicons name={icon} size={34} color={iconColor} />
      </View>
      <Text
        style={[
          styles.label,
          { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 8,
    width: CIRCLE_SIZE,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
});
