import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { useColorScheme } from '@/components/useColorScheme';
import { getTokens } from '@/theme/tokens';

// ─── Life buoy icon ──────────────────────────────────────────────────────────
// Outer ring + inner ring + 2 filled alternating arc panels + 4 diagonal spokes.
// Panel maths: R=8.5 r=4 center=(12,12) dividers at 45°/135°/225°/315°
//   outer pts: 45°=(18.01,18.01) 135°=(5.99,18.01) 225°=(5.99,5.99) 315°=(18.01,5.99)
//   inner pts: 45°=(14.83,14.83) 135°=(9.17,14.83) 225°=(9.17,9.17) 315°=(14.83,9.17)
function LifeBuoyIcon({ color, size = 22 }: { color: string; size?: number }) {
  const sw = 1.55;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Filled panels: right arc (315°→45°) and left arc (135°→225°) */}
      <Path
        d="M18.01 5.99 A8.5 8.5 0 0 1 18.01 18.01 L14.83 14.83 A4 4 0 0 0 14.83 9.17 Z"
        fill={color} fillOpacity={0.22}
      />
      <Path
        d="M5.99 18.01 A8.5 8.5 0 0 1 5.99 5.99 L9.17 9.17 A4 4 0 0 0 9.17 14.83 Z"
        fill={color} fillOpacity={0.22}
      />
      {/* Rings */}
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={sw} />
      <Circle cx="12" cy="12" r="4"   stroke={color} strokeWidth={sw} />
      {/* Diagonal dividers — inner ring edge → outer ring edge */}
      <Line x1="14.83" y1="9.17"  x2="18.01" y2="5.99"  stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="14.83" y1="14.83" x2="18.01" y2="18.01" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="9.17"  y1="14.83" x2="5.99"  y2="18.01" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="9.17"  y1="9.17"  x2="5.99"  y2="5.99"  stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Tab metadata ─────────────────────────────────────────────────────────────
type TabMeta = {
  renderIcon: (color: string) => React.ReactNode;
  label: string;
};

const VISIBLE_TABS: Record<string, TabMeta> = {
  home: {
    renderIcon: (c) => <Ionicons name="sunny-outline" size={22} color={c} />,
    label: 'Today',
  },
  panic: {
    renderIcon: (c) => <LifeBuoyIcon color={c} size={22} />,
    label: 'Support',
  },
  resources: {
    renderIcon: (c) => <Ionicons name="book-outline" size={22} color={c} />,
    label: 'Resources',
  },
};

// ─── Tab bar ──────────────────────────────────────────────────────────────────
export function AppTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const t = getTokens(scheme);
  const isDark = scheme === 'dark';

  const activeColor   = t.color.accent;
  const inactiveColor = t.color.textMuted;

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
                {meta.renderIcon(color)}
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
  outer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
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
  fab: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
