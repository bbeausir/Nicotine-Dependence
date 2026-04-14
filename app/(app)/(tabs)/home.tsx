import { Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Screen } from '@/components/ui/Screen';
import { getTokens } from '@/theme/tokens';

export default function HomeTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: t.color.textPrimary }}>Home is your daily quit progress snapshot.</Text>
      <Text style={{ color: t.color.textSecondary }}>We are wiring this up next so you can check in quickly.</Text>
      <Text style={{ color: t.color.textSecondary }}>TODO: Add streak summary, cravings trend, and quick actions.</Text>
    </Screen>
  );
}
