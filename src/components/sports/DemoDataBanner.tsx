export interface DemoDataBannerProps {
  show: boolean;
  note?: string;
}

const DEFAULT_NOTE = "Demo data — this page is showing placeholder fixtures, not live scores or schedules.";

/** Shown wherever the current page/sport combination is still backed by mock data. */
export function DemoDataBanner({ show, note }: DemoDataBannerProps) {
  if (!show) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-fill px-3 py-2 text-xs text-ink-dim">
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink-dim" />
      {note ?? DEFAULT_NOTE}
    </div>
  );
}
