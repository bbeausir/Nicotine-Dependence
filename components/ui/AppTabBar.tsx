import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

type TabMeta = { icon: keyof typeof Ionicons.glyphMap; label: string };

const VISIBLE_TABS: Record<string, TabMeta> = {
  home:      { icon: 'sunny-outline',        label: 'Today'     },
  panic:     { icon: 'help-circle-outline',  label: 'Support'   },
  resources: { icon: 'book-outline',         label: 'Resources' },
};

export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const isDark = scheme === 'dark';

  const activeColor   = t.color.accent;
  const inactiveColor = t.color.textMuted;

  // Glassmorphism colours — semi-transparent so screen content tints through
  const pillBg     = isDark ? 'rgba(14, 18, 34, 0.92)' : 'rgba(255, 255, 255, 0.93)';
  const pillBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)';
  const fabBg      = isDark ? 'rgba(22, 26, 46, 0.96)' : 'rgba(255, 255, 255, 0.96)';
  const fabBorder  = isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';

  const shadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.48 : 0.13,
    shadowRadius: 24,
    elevation: 14,
  } as const;

  const visibleRoutes = state.routes.filter((r) => VISIBLE_TABS[r.name]);

  return (
    // Outer shell is transparent — React Navigation still measures the height
    // correctly so screens get the right bottom padding automatically.
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.row}>

        {/* ── Floating pill capsule ── */}
        <View style={[styles.pill, shadow, { backgroundColor: pillBg, borderColor: pillBorder }]}>
          {visibleRoutes.map((route) => {
            const meta      = VISIBLE_TABS[route.name];
            const isFocused = state.routes[state.index]?.name === route.name;
            const color     = isFocused ? activeColor : inactiveColor;

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
                <Ionicons name={meta.icon} size={22} color={color} />
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
        </View>

        {/* ── Standalone FAB ── */}
        <Pressable
          onPress={() => navigation.navigate('home')}
          style={[styles.fab, shadow, { backgroundColor: fabBg, borderColor: fabBorder }]}
          accessibilityRole="button"
          accessibilityLabel="Quick action">
          <Ionicons name="add" size={26} color={t.color.textPrimary} />
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Transparent wrapper — preserves React Navigation's height accounting
  outer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Pill capsule
  pill: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  // Individual tab inside the pill
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 6,
  },

  label: {
    fontSize: 11,
    lineHeight: 14,
  },

  // Standalone FAB circle
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
