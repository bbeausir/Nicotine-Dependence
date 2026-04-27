import { StyleSheet, Text, View } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type ProgressIndicatorProps = {
  step: number; // 1-indexed
  total: number;
};

export function ProgressIndicator({ step, total }: ProgressIndicatorProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const ratio = Math.min(Math.max(step / total, 0), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: t.color.border }]}>
        <View style={[styles.fill, { backgroundColor: t.color.accent, width: `${ratio * 100}%` as any }]} />
      </View>
      <Text style={[styles.label, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
        Step {step} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  track: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
  },
});
