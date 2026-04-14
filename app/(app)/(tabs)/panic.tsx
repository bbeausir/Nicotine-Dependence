import { Text } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { Screen } from '@/components/ui/Screen';
import { getTokens } from '@/theme/tokens';

export default function PanicTabScreen() {
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  return (
    <Screen contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: t.color.textPrimary }}>Panic is your immediate support space during cravings.</Text>
      <Text style={{ color: t.color.textSecondary }}>Fast relief tools are being connected now.</Text>
      <Text style={{ color: t.color.textSecondary }}>TODO: Add one-tap coping flows, timers, and SOS actions.</Text>
    </Screen>
  );
}
