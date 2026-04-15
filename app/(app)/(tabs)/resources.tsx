import { Alert, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function ResourcesTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Resources
        </Text>
        <Text style={[styles.body, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
          Resources will organize trusted quit-help content.
        </Text>
        <Text style={[styles.body, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          We are curating practical guides you can use right away.
        </Text>
        <Text style={[styles.bodyMuted, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          TODO: Add categorized articles, tools, and local support links.
        </Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          onPress={() =>
            Alert.alert('Guides', 'Browseable guides are coming — clear, kind, and actionable.')
          }>
          Browse guides
        </PrimaryButton>
        <PrimaryButton
          variant="secondary"
          onPress={() =>
            Alert.alert('Favorites', 'Saving articles you love will land here so you can reopen them anytime.')
          }>
          Save a favorite
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          onPress={() =>
            Alert.alert(
              'Local support',
              'We will help you find local and national support options when this section goes live.',
            )
          }>
          Find local support
        </PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 24,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  textBlock: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMuted: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
});
