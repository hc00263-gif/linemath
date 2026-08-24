import { usingMockData } from "@/lib/sports";

/** Shown on every sports-data page until real API-Sports keys are configured. */
export function DemoDataBanner() {
  if (!usingMockData) return null;
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
      Demo data — this page is showing placeholder fixtures, not live scores or schedules.
    </div>
  );
}
