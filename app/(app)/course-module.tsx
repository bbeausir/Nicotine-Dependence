import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function CourseModuleScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const accent = t.color.sectionAccent.deepen;

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <Text style={[styles.eyebrow, { color: accent, fontFamily: t.typeface.uiMedium }]}>
          MODULE 2
        </Text>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          The Illusion of Relief
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Why nicotine seems to help—and why it never actually does.
        </Text>
        <View style={[styles.progressTrack, { backgroundColor: t.color.border }]}>
          <View style={[styles.progressFill, { backgroundColor: accent, width: `${(2 / 6) * 100}%` as any }]} />
        </View>
        <Text style={[styles.lessons, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
          2 of 6 lessons completed
        </Text>
        <Text style={[styles.coming, { color: accent, fontFamily: t.typeface.uiMedium }]}>
          Coming soon
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    gap: 12,
  },
  eyebrow: { fontSize: 12, letterSpacing: 0.8 },
  title: { fontSize: 26, lineHeight: 32 },
  body: { fontSize: 16, lineHeight: 24 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: { height: 4, borderRadius: 2 },
  lessons: { fontSize: 13, lineHeight: 18 },
  coming: { fontSize: 14, lineHeight: 20, marginTop: 8 },
});
