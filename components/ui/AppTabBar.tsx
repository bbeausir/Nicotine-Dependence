import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type TabMeta = { icon: keyof typeof Ionicons.glyphMap; label: string };

const VISIBLE_TABS: Record<string, TabMeta> = {
  home: { icon: 'sunny-outline', label: 'Today' },
  panic: { icon: 'help-circle-outline', label: 'Support' },
  resources: { icon: 'book-outline', label: 'Resources' },
};

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const activeColor = t.color.sectionAccent.understand;
  const inactiveColor = t.color.textMuted;

  const visibleRoutes = state.routes.filter((r) => VISIBLE_TABS[r.name]);

  return (
    <View
      style={[
        styles.outer,
        {
          backgroundColor: t.color.surface,
          borderTopColor: t.color.border,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}>
      <View style={styles.inner}>
        {visibleRoutes.map((route) => {
          const meta = VISIBLE_TABS[route.name];
          const isFocused = state.routes[state.index]?.name === route.name;
          const color = isFocused ? activeColor : inactiveColor;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}>
              <Ionicons name={meta.icon} size={24} color={color} />
              <Text
                style={[
                  styles.label,
                  {
                    color,
                    fontFamily: isFocused ? t.typeface.uiSemibold : t.typeface.ui,
                  },
                ]}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}

        <View style={styles.spacer} />

        {/* FAB — navigates to home/today and opens craving log */}
        <Pressable
          onPress={() => navigation.navigate('home')}
          style={[
            styles.fab,
            {
              backgroundColor: scheme === 'dark' ? t.color.surfaceElevated : t.color.surface,
              borderColor: t.color.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Quick action">
          <Ionicons name="add" size={26} color={t.color.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
  },
  spacer: {
    flex: 0.3,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 2,
  },
});
