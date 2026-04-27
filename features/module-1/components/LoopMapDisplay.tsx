import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

import { formatTriggers } from '@/features/module-1/loopMap';

type LoopMapDisplayProps = {
  triggers: string[];
  benefit: string;
  outcome: string;
  onSave: () => void | Promise<void>;
  isSaving?: boolean;
};

export function LoopMapDisplay({ triggers, benefit, outcome, onSave, isSaving }: LoopMapDisplayProps) {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const triggerText = formatTriggers(triggers);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <View style={styles.body}>
        <Text style={[styles.title, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Here is your loop
        </Text>

        <View style={[styles.summary, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
          <Text style={[styles.summaryText, { color: t.color.textPrimary, fontFamily: t.typeface.ui }]}>
            When moments like{' '}
            <Text style={{ fontFamily: t.typeface.uiMedium, color: t.color.accent }}>{triggerText}</Text>
            {' '}show up, nicotine seems to promise{' '}
            <Text style={{ fontFamily: t.typeface.uiMedium, color: t.color.accent }}>{benefit}</Text>
            . Later, it often leads to{' '}
            <Text style={{ fontFamily: t.typeface.uiMedium, color: t.color.accent }}>{outcome}</Text>
            .
          </Text>

          <Text style={[styles.supportLine, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
            That is a loop.
          </Text>
        </View>

        <View
          style={[
            styles.identityCallout,
            { backgroundColor: t.color.surfaceElevated, borderLeftColor: t.color.accent },
          ]}>
          <Text
            style={[styles.identityText, { color: t.color.textPrimary, fontFamily: t.typeface.uiMedium }]}>
            You're starting to see the pattern for what it is. That is how someone who is getting free begins.
          </Text>
        </View>
      </View>

      <PrimaryButton onPress={onSave} loading={isSaving} disabled={isSaving}>
        Save
      </PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 32,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  body: {
    gap: 20,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  summary: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
  supportLine: {
    fontSize: 13,
    lineHeight: 18,
  },
  identityCallout: {
    borderLeftWidth: 3,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  identityText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
