import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function InAppTabsLayout() {
  return (
    <Tabs initialRouteName="home" screenOptions={{ headerShown: false, tabBarLabelPosition: 'below-icon' }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: 'Social',
          tabBarAccessibilityLabel: 'Social feed tab',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="panic"
        options={{
          title: 'SOS',
          tabBarAccessibilityLabel: 'SOS panic support tab',
          tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarAccessibilityLabel: 'Resources tab',
          tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarAccessibilityLabel: 'Settings tab',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
