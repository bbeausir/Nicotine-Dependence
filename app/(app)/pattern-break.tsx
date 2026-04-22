import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function PatternBreakScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const accent = t.color.sectionAccent.shift;

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Pattern Break
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Interrupt the loop with a quick reset. A 2-minute exercise to disrupt the automatic craving response.
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
  title: { fontSize: 26, lineHeight: 32 },
  body: { fontSize: 16, lineHeight: 24 },
  coming: { fontSize: 14, lineHeight: 20, marginTop: 8 },
});
