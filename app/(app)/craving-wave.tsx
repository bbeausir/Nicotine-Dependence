import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function CravingWaveScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const accent = t.color.sectionAccent.shift;

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Craving Wave Timer
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          Ride the wave. It always passes. A 2–5 minute guided timer to surf through the urge without acting on it.
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
