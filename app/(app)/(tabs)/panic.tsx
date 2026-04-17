import { Alert, StyleSheet, Text, View } from 'react-native';

import { CircleActionButton } from '@/components/ui/CircleActionButton';
import { Screen } from '@/components/ui/Screen';
import { StatsCard } from '@/components/ui/StatsCard';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function PanicTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen scroll contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
        {'How can I help\nyou right now?'}
      </Text>

      <View style={styles.cluster}>
        <View style={styles.topRow}>
          <CircleActionButton
            icon="happy-outline"
            label="Craving Help"
            onPress={() =>
              Alert.alert('Craving Help', 'A 2-minute guided grounding exercise is coming soon.')
            }
          />
        </View>
        <View style={styles.bottomRow}>
          <CircleActionButton
            icon="chatbubble-ellipses-outline"
            label="Get Support"
            onPress={() =>
              Alert.alert('Get Support', 'Quick access to a trusted contact is coming soon.')
            }
          />
          <CircleActionButton
            icon="warning-outline"
            label={'System\nReboot'}
            onPress={() =>
              Alert.alert('System Reboot', 'A full reset protocol is coming soon.')
            }
            variant="accent"
          />
        </View>
      </View>

      <Text style={[styles.motivational, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
        {'Cravings can come and go.\nTake a deep breath.\nYou\'ve got this.'}
      </Text>

      <StatsCard daysNicotineFree={14} moneySaved={152.5} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    gap: 36,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
  },
  cluster: {
    alignItems: 'center',
  },
  topRow: {
    alignItems: 'center',
    zIndex: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: -18,
    zIndex: 1,
  },
  motivational: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
});
