import type { AnalyticsEventName } from '@/lib/analytics/events';

/**
 * TODO(DATA): Send to PostHog with user id when session exists.
 */
export function track(event: AnalyticsEventName, properties?: Record<string, unknown>): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event, properties ?? {});
  }
}
