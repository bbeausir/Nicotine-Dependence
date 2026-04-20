import { useEffect, useState } from 'react';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const MILESTONES: readonly { days: number; label: string }[] = [
  { days: 1, label: '1 Day' },
  { days: 3, label: '3 Days' },
  { days: 7, label: '1 Week' },
  { days: 14, label: '2 Weeks' },
  { days: 30, label: '1 Month' },
  { days: 60, label: '2 Months' },
  { days: 90, label: '3 Months' },
  { days: 180, label: '6 Months' },
  { days: 365, label: '1 Year' },
];

export type QuitStage = 'pre_quit' | 'countdown' | 'free';

export type QuitStats = {
  stage: QuitStage;
  /** Whole days since quit_date (>=0 once quit). 0 when stage is 'countdown'. */
  daysFree: number;
  /** Whole days until quit_date when in the future. 0 otherwise. */
  daysUntilQuit: number;
  /** Cumulative money saved in user currency, or null when no daily_cost set. */
  moneySaved: number | null;
  /** Next milestone the user is working toward, or null past the last one. */
  nextMilestone: { days: number; label: string; daysAway: number } | null;
};

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** quit_date arrives as 'YYYY-MM-DD' (Postgres date). Parse as a local date, not UTC. */
function parseQuitDate(input: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function computeQuitStats(
  quitDate: string | null,
  dailyCost: number | null,
  now: Date = new Date(),
): QuitStats | null {
  if (!quitDate) return null;
  const quit = parseQuitDate(quitDate);
  if (!quit) return null;

  const today = startOfDay(now);
  const diffDays = Math.round((today.getTime() - quit.getTime()) / MS_PER_DAY);

  if (diffDays < 0) {
    return {
      stage: 'countdown',
      daysFree: 0,
      daysUntilQuit: Math.abs(diffDays),
      moneySaved: null,
      nextMilestone: null,
    };
  }

  const moneySaved =
    dailyCost !== null && dailyCost >= 0 ? Math.round(dailyCost * diffDays * 100) / 100 : null;

  const upcoming = MILESTONES.find((m) => m.days > diffDays);
  const nextMilestone = upcoming
    ? { days: upcoming.days, label: upcoming.label, daysAway: upcoming.days - diffDays }
    : null;

  return {
    stage: 'free',
    daysFree: diffDays,
    daysUntilQuit: 0,
    moneySaved,
    nextMilestone,
  };
}

export function useQuitStats(quitDate: string | null, dailyCost: number | null): QuitStats | null {
  const [stats, setStats] = useState(() => computeQuitStats(quitDate, dailyCost));

  useEffect(() => {
    const stats = computeQuitStats(quitDate, dailyCost);
    setStats(stats);

    if (!stats) return;

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    // Recalculate stats at midnight
    const timeout = setTimeout(() => {
      setStats(computeQuitStats(quitDate, dailyCost));
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, [quitDate, dailyCost]);

  return stats;
}
