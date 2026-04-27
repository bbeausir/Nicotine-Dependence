import type { LoopMap as RawLoopMap } from '@/lib/database/schema';

/**
 * The DB stores top_triggers as a JSON-encoded string. Components should
 * always work with this parsed form so they never touch raw JSON.
 */
export interface LoopMap {
  id: string;
  triggers: string[];
  benefit: string;
  outcome: string;
  completedAt: string;
  version: string;
}

export function parseLoopMap(raw: RawLoopMap | null | undefined): LoopMap | null {
  if (!raw) return null;

  let triggers: string[] = [];
  try {
    const parsed = JSON.parse(raw.top_triggers);
    if (Array.isArray(parsed)) {
      triggers = parsed.filter((t): t is string => typeof t === 'string');
    }
  } catch {
    triggers = [];
  }

  return {
    id: raw.id,
    triggers,
    benefit: raw.perceived_benefit,
    outcome: raw.later_outcome,
    completedAt: raw.completed_at,
    version: raw.version,
  };
}

/** Format a list of triggers as natural language: "stress", "stress or work", "stress, work, or driving". */
export function formatTriggers(triggers: string[]): string {
  if (triggers.length === 0) return '';
  if (triggers.length === 1) return triggers[0];
  if (triggers.length === 2) return `${triggers[0]} or ${triggers[1]}`;
  return `${triggers.slice(0, -1).join(', ')}, or ${triggers[triggers.length - 1]}`;
}

/** Short pattern summary used by the Today tab. */
export function summarizePattern(loopMap: LoopMap): string {
  return `In ${formatTriggers(loopMap.triggers)}, nicotine tends to promise ${loopMap.benefit}, but the urge usually returns later.`;
}

/** Contextual hint used by the Support tab during craving moments. */
export function contextualHint(loopMap: LoopMap): string {
  return `This may be one of your loop moments. Nicotine often promises ${loopMap.benefit}, but you said the urge usually returns later.`;
}
