import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';

import { Screen } from '@/components/ui/Screen';
import { useColorScheme } from '@/components/useColorScheme';
import type { ColorSchemeName } from '@/theme/tokens';
import { getTokens } from '@/theme/tokens';

// ─── database bootstrap (mirrors existing pattern) ───────────────────────────
let useSQLiteContext: any;
let initializeDatabase: any;

if (Platform.OS !== 'web') {
  const sqliteModule = require('expo-sqlite');
  useSQLiteContext = sqliteModule.useSQLiteContext;
  const schemaModule = require('@/lib/database/schema');
  initializeDatabase = schemaModule.initializeDatabase;
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function alpha(hex: string, opacity: number): string {
  const a = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
type SectionHeaderProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  accent: string;
  scheme: ColorSchemeName;
};

function SectionHeader({ icon, title, accent, scheme }: SectionHeaderProps) {
  const t = getTokens(scheme);
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={20} color={accent} />
      <Text style={[styles.sectionTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
        {title}
      </Text>
    </View>
  );
}

// ─── ArrowCircle ─────────────────────────────────────────────────────────────
function ArrowCircle({ accent, size = 32 }: { accent: string; size?: number }) {
  return (
    <View style={[styles.arrowCircle, { backgroundColor: accent, width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="arrow-forward" size={size * 0.45} color="#ffffff" />
    </View>
  );
}

// ─── UnderstandCard ───────────────────────────────────────────────────────────
type UnderstandCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  cta: string;
  accent: string;
  cardBg: string;
  scheme: ColorSchemeName;
  onPress: () => void;
};

function UnderstandCard({ icon, title, description, cta, accent, cardBg, scheme, onPress }: UnderstandCardProps) {
  const t = getTokens(scheme);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.understandCard, { backgroundColor: cardBg, borderColor: t.color.border }]}>
      <View style={[styles.understandIconArea, { backgroundColor: alpha(accent, 0.12) }]}>
        <Ionicons name={icon} size={44} color={accent} />
      </View>
      <View style={styles.understandBody}>
        <Text style={[styles.cardTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {title}
        </Text>
        <Text style={[styles.cardDesc, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {description}
        </Text>
        <View style={styles.ctaRow}>
          <Text style={[styles.ctaText, { color: accent, fontFamily: t.typeface.uiMedium }]}>{cta}</Text>
          <ArrowCircle accent={accent} size={30} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── ShiftCard ────────────────────────────────────────────────────────────────
type ShiftCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  duration: string;
  accent: string;
  cardBg: string;
  scheme: ColorSchemeName;
  onPress: () => void;
};

function ShiftCard({ icon, title, description, duration, accent, cardBg, scheme, onPress }: ShiftCardProps) {
  const t = getTokens(scheme);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.shiftCard, { backgroundColor: cardBg, borderColor: t.color.border }]}>
      <View style={[styles.shiftIconCircle, { backgroundColor: alpha(accent, 0.14) }]}>
        <Ionicons name={icon} size={26} color={accent} />
      </View>
      <Text style={[styles.shiftTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
        {title}
      </Text>
      <Text style={[styles.shiftDesc, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
        {description}
      </Text>
      <View style={styles.shiftFooter}>
        <Text style={[styles.durationTag, { color: accent, fontFamily: t.typeface.uiMedium }]}>{duration}</Text>
        <ArrowCircle accent={accent} size={28} />
      </View>
    </TouchableOpacity>
  );
}

// ─── ModuleCard ───────────────────────────────────────────────────────────────
type ModuleCardProps = {
  title: string;
  description: string;
  lessonsCompleted: number;
  totalLessons: number;
  accent: string;
  scheme: ColorSchemeName;
  onPress: () => void;
};

function ModuleCard({ title, description, lessonsCompleted, totalLessons, accent, scheme, onPress }: ModuleCardProps) {
  const t = getTokens(scheme);
  const progress = lessonsCompleted / totalLessons;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.moduleCard, { backgroundColor: t.color.surface, borderColor: t.color.border }]}>
      {/* Thumbnail */}
      <View style={[styles.moduleThumbnail, { backgroundColor: alpha(accent, 0.18) }]}>
        <Ionicons name="flag-outline" size={36} color={accent} />
      </View>
      {/* Content */}
      <View style={styles.moduleContent}>
        <Text style={[styles.progressLabel, { color: accent, fontFamily: t.typeface.uiMedium }]}>
          COURSE PROGRESS
        </Text>
        <Text style={[styles.moduleTitle, { color: t.color.textPrimary, fontFamily: t.typeface.uiSemibold }]}>
          {title}
        </Text>
        <Text style={[styles.moduleDesc, { color: t.color.textSecondary, fontFamily: t.typeface.ui }]}>
          {description}
        </Text>
        <View style={[styles.progressTrack, { backgroundColor: t.color.border }]}>
          <View style={[styles.progressFill, { backgroundColor: accent, width: `${progress * 100}%` as any }]} />
        </View>
        <View style={styles.moduleFooter}>
          <Text style={[styles.lessonsText, { color: t.color.textMuted, fontFamily: t.typeface.ui }]}>
            {lessonsCompleted} of {totalLessons} lessons completed
          </Text>
          <ArrowCircle accent={accent} size={32} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ResourcesTabScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const t = getTokens(scheme);

  const db = Platform.OS !== 'web' ? useSQLiteContext?.() : null;
  useEffect(() => {
    if (db && initializeDatabase) {
      initializeDatabase(db).catch((err: any) => console.error('db init failed:', err));
    }
  }, [db]);

  const ua = t.color.sectionAccent.understand;
  const sa = t.color.sectionAccent.shift;
  const da = t.color.sectionAccent.deepen;

  const understandCardBg = scheme === 'dark' ? '#14102c' : '#ffffff';
  const shiftCardBg = scheme === 'dark' ? '#0c1e1b' : '#ffffff';

  return (
    <Screen scroll includeBottomInset={false} contentContainerStyle={styles.content}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: t.color.textPrimary, fontFamily: t.typeface.display }]}>
          Resources
        </Text>
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: t.color.surfaceElevated, borderColor: t.color.border }]}
          accessibilityLabel="Search resources">
          <Ionicons name="search-outline" size={18} color={t.color.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── Understand ────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader icon="hardware-chip-outline" title="Understand" accent={ua} scheme={scheme} />
        <View style={styles.twoColRow}>
          <UnderstandCard
            icon="library-outline"
            title="Insights Library"
            description="Short reads and key insights to expand your perspective."
            cta="Browse"
            accent={ua}
            cardBg={understandCardBg}
            scheme={scheme}
            onPress={() => router.push('/insights' as Href)}
          />
          <UnderstandCard
            icon="analytics-outline"
            title="Myth Dissolutions"
            description="See through the false beliefs that keep nicotine's trap alive."
            cta="Explore"
            accent={ua}
            cardBg={understandCardBg}
            scheme={scheme}
            onPress={() => router.push('/myths' as Href)}
          />
        </View>
      </View>

      {/* ── Shift your State ──────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader icon="water-outline" title="Shift your State" accent={sa} scheme={scheme} />
        <View style={styles.threeColRow}>
          <ShiftCard
            icon="timer-outline"
            title="Craving Wave Timer"
            description="Ride the wave. It always passes."
            duration="2-5 min"
            accent={sa}
            cardBg={shiftCardBg}
            scheme={scheme}
            onPress={() => router.push('/craving-wave' as Href)}
          />
          <ShiftCard
            icon="leaf-outline"
            title="5-4-3-2-1 Grounding"
            description="Come back to what's real, right now."
            duration="1 min"
            accent={sa}
            cardBg={shiftCardBg}
            scheme={scheme}
            onPress={() => router.push('/grounding' as Href)}
          />
          <ShiftCard
            icon="game-controller-outline"
            title="Pattern Break"
            description="Interrupt the loop with a quick reset."
            duration="2 min"
            accent={sa}
            cardBg={shiftCardBg}
            scheme={scheme}
            onPress={() => router.push('/pattern-break' as Href)}
          />
        </View>
      </View>

      {/* ── Go Deeper ─────────────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader icon="book-outline" title="Go Deeper" accent={da} scheme={scheme} />
        <ModuleCard
          title="Module 2: The Illusion of Relief"
          description="Why nicotine seems to help—and why it never actually does."
          lessonsCompleted={2}
          totalLessons={6}
          accent={da}
          scheme={scheme}
          onPress={() => router.push('/course-module' as Href)}
        />
      </View>
    </Screen>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 28,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
  },

  // page header
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 32,
    lineHeight: 38,
  },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // section
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    lineHeight: 22,
  },

  // shared card primitives
  arrowCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto' as any,
    paddingTop: 8,
  },
  ctaText: {
    fontSize: 13,
    lineHeight: 18,
  },

  // understand cards (2-column)
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  understandCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  understandIconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  understandBody: {
    padding: 14,
    flexGrow: 1,
    gap: 6,
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 19,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 17,
  },

  // shift cards (3-column)
  threeColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shiftCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  shiftIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftTitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  shiftDesc: {
    fontSize: 11,
    lineHeight: 15,
    flexGrow: 1,
  },
  shiftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  durationTag: {
    fontSize: 11,
    lineHeight: 14,
  },

  // module / go deeper card
  moduleCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  moduleThumbnail: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleContent: {
    flex: 1,
    padding: 14,
    gap: 5,
  },
  progressLabel: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.6,
  },
  moduleTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  moduleDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  moduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  lessonsText: {
    fontSize: 11,
    lineHeight: 14,
    flex: 1,
    marginRight: 8,
  },
});
