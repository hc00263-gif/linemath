import { isStale } from "@/lib/hub/store";
import { formatEt } from "@/lib/hub/format";

/** "Updated Mon, Nov 9, 3:19 AM ET" plus a clear warning when the data is older than the freshness window. */
export function Freshness({ updated }: { updated: string }) {
  const stale = isStale(updated);
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-xs text-ink-dim">Prices updated {formatEt(updated)}</p>
      {stale && (
        <p role="status" className="rounded-lg border border-negative/40 bg-negative/10 px-3 py-2 text-sm text-ink">
          These prices are more than a day and a half old and may no longer be available. Check the sportsbook before relying on them.
        </p>
      )}
    </div>
  );
}

export function PriceDisclaimer() {
  return (
    <p className="text-xs leading-relaxed text-ink-dim">
      LineMath shows prices collected from public odds feeds a few times a day, so lines move and sell out faster than this page
      updates. Always confirm the price and limits at the sportsbook before you bet. 21+. Informational only, not betting advice.
    </p>
  );
}

export function NoData({ configured }: { configured: boolean }) {
  return (
    <p className="rounded-xl border border-line bg-surface p-4 text-sm text-ink-dim">
      {configured
        ? "No odds are published for this yet. The board refreshes automatically a few times a day."
        : "The odds board isn't configured on this deployment yet."}
    </p>
  );
}
