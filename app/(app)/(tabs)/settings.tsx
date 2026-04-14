import { Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Screen } from '@/components/ui/Screen';
import { getTokens } from '@/theme/tokens';

export default function SettingsTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: t.color.textPrimary }}>Settings is where you personalize your quit journey.</Text>
      <Text style={{ color: t.color.textSecondary }}>Account and app preferences are coming soon.</Text>
      <Text style={{ color: t.color.textSecondary }}>TODO: Add profile, notification, privacy, and reset controls.</Text>
    </Screen>
  );
}
