import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type SettingsSectionProps = PropsWithChildren<{
  header: string;
}>;

export function SettingsSection({ header, children }: SettingsSectionProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <View style={styles.section}>
      <Text style={[styles.header, { color: t.color.textMuted, fontFamily: t.typeface.uiSemibold }]}>
        {header}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: t.color.surfaceElevated,
            borderRadius: t.radius.md,
            borderColor: t.color.border,
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  header: {
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
  },
});
