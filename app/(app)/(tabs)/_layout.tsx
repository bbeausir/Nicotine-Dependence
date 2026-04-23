import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTabBar } from '@/components/ui/AppTabBar';
import { ProfileMenu } from '@/components/ui/ProfileMenu';
import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

export default function InAppTabsLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/* Spacer to push content below menu button */}
      <View style={styles.spacer} />

      <Tabs
        initialRouteName="home"
        tabBar={(props) => <AppTabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="panic" />
        <Tabs.Screen name="resources" />
        {/* social and settings remain routable but hidden from the tab bar */}
        <Tabs.Screen name="social" options={{ tabBarButton: () => null }} />
        <Tabs.Screen name="settings" options={{ tabBarButton: () => null }} />
      </Tabs>

      {/* Menu button overlay */}
      <Pressable
        onPress={() => setMenuOpen(true)}
        style={[
          styles.menuButton,
          {
            top: insets.top + 8,
            left: 8,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Menu"
        accessibilityHint="Opens profile and settings menu">
        <Ionicons name="menu" size={24} color={t.color.textPrimary} />
      </Pressable>

      <ProfileMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: {
    height: 44,
  },
  menuButton: {
    position: 'absolute',
    zIndex: 10,
    padding: 8,
  },
});
