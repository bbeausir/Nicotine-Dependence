import { Tabs } from 'expo-router';

import { AppTabBar } from '@/components/ui/AppTabBar';

export default function InAppTabsLayout() {
  return (
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
  );
}
