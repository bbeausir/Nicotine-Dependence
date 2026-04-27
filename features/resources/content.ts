import { Ionicons } from '@expo/vector-icons';
import type { Href } from 'expo-router';

export type ResourceIllustrationId =
  | 'illusionOfRelief'
  | 'insightsLibrary'
  | 'mythDissolutions'
  | 'cravingWaveTimer'
  | 'grounding54321'
  | 'patternBreak';

type ResourceCardBase = {
  title: string;
  description: string;
  href: Href;
};

export type UnderstandResource = ResourceCardBase & {
  icon: keyof typeof Ionicons.glyphMap;
  cta: string;
  illustration?: ResourceIllustrationId;
};

export type ShiftResource = ResourceCardBase & {
  icon: keyof typeof Ionicons.glyphMap;
  duration: string;
  illustration?: ResourceIllustrationId;
};

/**
 * Static metadata for a Module card. Live progress (lessonsCompleted, completed)
 * is computed at render time by the Resources screen — see useModule1Status.
 */
export type ModuleResource = {
  id: 'module1' | 'module2';
  title: string;
  description: string;
  totalLessons: number;
  href: Href;
  illustration: ResourceIllustrationId;
};

export const resourcesContent = {
  understand: [
    {
      icon: 'library-outline',
      title: 'Insights Library',
      description: 'Short reads and key insights to expand your perspective.',
      cta: 'Browse',
      href: '/insights',
      illustration: undefined,
    },
    {
      icon: 'analytics-outline',
      title: 'Myth Dissolutions',
      description: "See through the false beliefs that keep nicotine's trap alive.",
      cta: 'Explore',
      href: '/myths',
      illustration: undefined,
    },
  ] as const satisfies ReadonlyArray<UnderstandResource>,
  shift: [
    {
      icon: 'timer-outline',
      title: 'Craving Wave Timer',
      description: 'Ride the wave. It always passes.',
      duration: '2-5 min',
      href: '/craving-wave',
      illustration: undefined,
    },
    {
      icon: 'leaf-outline',
      title: '5-4-3-2-1 Grounding',
      description: "Come back to what's real, right now.",
      duration: '1 min',
      href: '/grounding',
      illustration: undefined,
    },
    {
      icon: 'game-controller-outline',
      title: 'Pattern Break',
      description: 'Interrupt the loop with a quick reset.',
      duration: '2 min',
      href: '/pattern-break',
      illustration: undefined,
    },
  ] as const satisfies ReadonlyArray<ShiftResource>,
  modules: [
    {
      id: 'module1',
      title: 'Module 1: See the Loop Clearly',
      description: 'Understand why the urge keeps coming back.',
      totalLessons: 1,
      href: '/module-1',
      illustration: 'insightsLibrary',
    },
    {
      id: 'module2',
      title: 'Module 2: The Illusion of Relief',
      description: 'Why nicotine seems to help—and why it never actually does.',
      totalLessons: 6,
      href: '/course-module',
      illustration: 'illusionOfRelief',
    },
  ] as const satisfies ReadonlyArray<ModuleResource>,
} as const;
