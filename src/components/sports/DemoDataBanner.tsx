export interface DemoDataBannerProps {
  show: boolean;
  note?: string;
}

const DEFAULT_NOTE = "Demo data — this page is showing placeholder fixtures, not live scores or schedules.";

/** Shown wherever the current page/sport combination is still backed by mock data. */
export function DemoDataBanner({ show, note }: DemoDataBannerProps) {
  if (!show) return null;
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
      {note ?? DEFAULT_NOTE}
    </div>
  );
}
